import { consumirExcelDrive } from "./consumirExcelDrive.js";

const ID_EXCEL = "1RDN_6mV9xaEjAXrhvYCmjPndFYKid_i_eLO6b2lguWM";

document.addEventListener('DOMContentLoaded', async () => {
    
    cargarCarruselDinamico();

    
    const infoExcel = await consumirExcelDrive(ID_EXCEL);
    const contenedorProductos = document.querySelector('.productos');

    if (!infoExcel || infoExcel.length === 0) {
        contenedorProductos.innerHTML = `
            <div class="col-12 text-center">
                <p class="alert alert-warning">No se encontraron productos disponibles en este momento.</p>
            </div>
        `;
        return;
    }

    
    const productosNormales = infoExcel.filter(item => {
        if (!item.Descuento) return true;
        
        const valorDescuento = item.Descuento.toString().trim().toUpperCase();
        return valorDescuento !== "SI" && valorDescuento !== "SÍ";
    });

    if (productosNormales.length === 0) {
        contenedorProductos.innerHTML = `
            <div class="col-12 text-center">
                <p class="alert alert-info">Todos nuestros productos actuales se encuentran en la sección de Ofertas.</p>
            </div>
        `;
        return;
    }

  
    productosNormales.forEach(item => {
        let nombreProducto = item.PRODUCTO || "Producto sin nombre";
        if (nombreProducto.includes("Pinza Amperimétrica Digital Uni-T UT210D")) {
            nombreProducto = "Pinza Amperimétrica Digital Uni-T UT210D 200A True RMS 600V 20000μF";
        }

        let precioLimpio = 0;
        if (item.PRECIO) {
            precioLimpio = parseInt(item.PRECIO.toString().replace('$', ''), 10);
        }

        const cuotas = item.Garantia || "Sin especificar";
        const imagenUrl = item["Imagen Url"] || "https://via.placeholder.com/150";

        const columna = document.createElement('div');
        columna.classList.add('col');

        columna.innerHTML = `
            <div class="card h-100 shadow-sm border-0 mt-2">
                <div class="p-3 bg-white d-flex align-items-center justify-content-center" style="height: 220px;">
                    <img src="${imagenUrl}" class="img-fluid object-fit-contain h-100" alt="${nombreProducto}">
                </div>
                <div class="card-body d-flex flex-column pt-0">
                    <h5 class="card-title fs-6 text-dark text-truncate-2 mb-2" style="height: 40px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${nombreProducto}
                    </h5>
                    <p class="card-text fs-4 fw-bold text-success mb-1">
                        $${precioLimpio.toLocaleString('es-AR')}
                    </p>
                    <p class="card-text text-muted small mb-3">
                        📅 Garantía/Cuotas: <span class="fw-semibold text-secondary">${cuotas}</span>
                    </p>
                    <button class="btn btn-outline-primary btn-comprar mt-auto w-100 fw-medium" 
                            data-name="${nombreProducto}" 
                            data-price="${precioLimpio}">
                        Comprar
                    </button>
                </div>
            </div>
        `;

        contenedorProductos.appendChild(columna);
    });

    // LÓGICA DEL BOTÓN DE COMPRAR
    contenedorProductos.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-comprar')) {
            const nombre = e.target.getAttribute('data-name');
            const precio = parseInt(e.target.getAttribute('data-price'), 10);
            alert(`¡Excelente elección!\n\nVas a comprar:\n${nombre}\n\nTotal: $${precio.toLocaleString('es-AR')}`);
        }
    });
});

async function cargarCarruselDinamico() {
    const contenedorBanners = document.getElementById('contenedorBanners');
    if (!contenedorBanners) return;

    try {
        // Conectamos a la URL del Excel apuntando específicamente a la hoja 'Banners'
        const urlBanners = `https://docs.google.com/spreadsheets/d/${ID_EXCEL}/gviz/tq?tqx=out:json&sheet=Banners`;
        
        const respuesta = await fetch(urlBanners);
        const textoResponse = await respuesta.text();
        
        // Limpiamos la respuesta JSON estructurada que devuelve la API de Google Sheets
        const jsonLimpio = JSON.parse(textoResponse.substring(47, textoResponse.length - 2));
        const filas = jsonLimpio.table.rows;

        if (!filas || filas.length === 0) {
            contenedorBanners.innerHTML = `<div class="carousel-item active"><img src="https://via.placeholder.com/800x400?text=ElectroTienda" class="d-block w-100"></div>`;
            return;
        }

        contenedorBanners.innerHTML = ""; // Limpiamos cargadores previos

        filas.forEach((fila, index) => {
            // Evaluamos que la celda de la columna Imagen no esté vacía
            const urlImagen = fila.c[0] ? fila.c[0].v : null;

            if (urlImagen) {
                const itemCarrusel = document.createElement('div');
                itemCarrusel.classList.add('carousel-item');
                
                // Bootstrap exige que el primer elemento tenga obligatoriamente la clase 'active'
                if (index === 0) {
                    itemCarrusel.classList.add('active');
                }

                itemCarrusel.innerHTML = `<img src="${urlImagen}" class="d-block w-100" alt="Banner ElectroTienda">`;
                contenedorBanners.appendChild(itemCarrusel);
            }
        });

    } catch (error) {
        console.error("Error cargando los banners del carrusel:", error);
        contenedorBanners.innerHTML = `<div class="carousel-item active"><img src="https://via.placeholder.com/800x400?text=Error+Al+Cargar+Banners" class="d-block w-100"></div>`;
    }
}