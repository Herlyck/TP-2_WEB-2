import { consumirExcelDrive } from "./consumirExcelDrive.js";

const ID_EXCEL = "1RDN_6mV9xaEjAXrhvYCmjPndFYKid_i_eLO6b2lguWM";
let listaProductosOferta = []; // Guardamos las ofertas acá para poder filtrarlas

document.addEventListener('DOMContentLoaded', async () => {
    const infoExcel = await consumirExcelDrive(ID_EXCEL);
    const contenedorOfertas = document.querySelector('.productos-oferta');
    const inputBuscador = document.getElementById('buscadorOfertas');

    if (!infoExcel || infoExcel.length === 0) {
        contenedorOfertas.innerHTML = `
            <div class="col-12 text-center">
                <p class="alert alert-warning">No se encontraron ofertas disponibles en este momento.</p>
            </div>
        `;
        return;
    }

    // ==========================================================================
    // FILTRO: Traer ÚNICAMENTE los productos que están marcados como Oferta
    // ==========================================================================
    listaProductosOferta = infoExcel.filter(item => {
        if (!item.Descuento) return false;
        const valorDescuento = item.Descuento.toString().trim().toUpperCase();
        return valorDescuento === "SI" || valorDescuento === "SÍ";
    });

    // Render inicial: Muestra todas las ofertas al cargar la página
    renderizarOfertas(listaProductosOferta, contenedorOfertas);

    // ==========================================================================
    // ESCUCHADOR DEL BUSCADOR DE OFERTAS: Filtra en tiempo real mientras escribís
    // ==========================================================================
    if (inputBuscador) {
        inputBuscador.addEventListener('input', (e) => {
            const textoBusqueda = e.target.value.toLowerCase().trim();
            
            // Filtramos el array global de ofertas
            const ofertasFiltradas = listaProductosOferta.filter(item => {
                const nombre = (item.PRODUCTO || "").toLowerCase();
                return nombre.includes(textoBusqueda);
            });

            // Volvemos a dibujar solo las ofertas que coinciden
            renderizarOfertas(ofertasFiltradas, contenedorOfertas);
        });
    }

    // LÓGICA DEL BOTÓN DE COMPRAR
    contenedorOfertas.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-comprar')) {
            const nombre = e.target.getAttribute('data-name');
            const precio = parseInt(e.target.getAttribute('data-price'), 10);

            document.getElementById('modalCompraNombre').textContent = nombre;
            document.getElementById('modalCompraPrecio').textContent = `$${precio.toLocaleString('es-AR')}`;

            const modalExito = new bootstrap.Modal(document.getElementById('modalCompraExito'));
            modalExito.show();
        }
    });
});

// ==========================================================================
// FUNCIÓN PARA RENDERIZAR LAS TARJETAS DE OFERTAS
// ==========================================================================
function renderizarOfertas(productos, contenedor) {
    contenedor.innerHTML = ""; // Limpiamos el contenedor antes de redibujar

    if (productos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center my-4">
                <p class="text-white-50 fs-5">🔍 No hay ofertas que coincidan con la búsqueda.</p>
            </div>
        `;
        return;
    }

    productos.forEach(item => {
        const nombreProducto = item.PRODUCTO || "Producto en Oferta";
        
        let precioLimpio = 0;
        if (item.PRECIO) {
            // CORRECCIÓN: Quitamos tanto el signo $ como los puntos de miles para evitar cortes en el parseInt
            precioLimpio = parseInt(item.PRECIO.toString().replace(/[$.]/g, ''), 10);
        }

        const cuotas = item.Garantia || "Sin especificar";
        const imagenUrl = item["Imagen Url"] || "https://via.placeholder.com/150";

        const columna = document.createElement('div');
        columna.classList.add('col');

        columna.innerHTML = `
            <div class="card h-100 shadow-sm border-0 mt-2 position-relative">
                <span class="position-absolute top-0 start-0 badge bg-danger m-2 px-3 py-2 rounded-pill shadow">🔥 OFERTA</span>
                
                <div class="p-3 bg-white d-flex align-items-center justify-content-center" style="height: 220px;">
                    <img src="${imagenUrl}" class="img-fluid object-fit-contain h-100" alt="${nombreProducto}">
                </div>
                <div class="card-body d-flex flex-column pt-0">
                    <h5 class="card-title fs-6 text-dark text-truncate-2 mb-2" style="height: 40px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${nombreProducto}
                    </h5>
                    <p class="card-text fs-4 fw-bold text-danger mb-1">
                        $${precioLimpio.toLocaleString('es-AR')}
                    </p>
                    <p class="card-text text-muted small mb-3">
                        📅 Garantía/Cuotas: <span class="fw-semibold text-secondary">${cuotas}</span>
                    </p>
                    <button class="btn btn-danger btn-comprar mt-auto w-100 fw-bold" 
                            data-name="${nombreProducto}" 
                            data-price="${precioLimpio}">
                        Aprovechar Oferta
                    </button>
                </div>
            </div>
        `;

        contenedor.appendChild(columna);
    });
}