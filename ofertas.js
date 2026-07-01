import { consumirExcelDrive } from "./consumirExcelDrive.js";

const ID_EXCEL = "1RDN_6mV9xaEjAXrhvYCmjPndFYKid_i_eLO6b2lguWM";

document.addEventListener('DOMContentLoaded', async () => {
    const infoExcel = await consumirExcelDrive(ID_EXCEL);
    const contenedorOfertas = document.querySelector('.productos-oferta');

    if (!infoExcel || infoExcel.length === 0) {
        mostrarMensajeVacio(contenedorOfertas);
        return;
    }

    // ==========================================================================
    // FILTRAR: Trae solo las filas donde la columna Descuento sea "SI" o "SÍ"
    // ==========================================================================
    const productosEnOferta = infoExcel.filter(item => {
        if (!item.Descuento) return false;
        
        const valor = item.Descuento.toString().trim().toUpperCase();
        return valor === "SI" || valor === "SÍ";
    });

    if (productosEnOferta.length === 0) {
        mostrarMensajeVacio(contenedorOfertas);
        return;
    }

    // Dibujar las tarjetas filtradas en la sección de ofertas
    productosEnOferta.forEach(item => {
        let nombreProducto = item.PRODUCTO || "Producto en Oferta";
        
        let precioLimpio = 0;
        if (item.PRECIO) {
            precioLimpio = parseInt(item.PRECIO.toString().replace('$', ''), 10);
        }

        const cuotas = item.Garantia || "Sin especificar";
        const imagenUrl = item["Imagen Url"] || "https://via.placeholder.com/150";

        const columna = document.createElement('div');
        columna.classList.add('col', 'position-relative');

        columna.innerHTML = `
            <div class="card h-100 shadow-sm border-0 mt-2">
                <span class="badge-oferta">🔥 OFERTA</span>
                
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
                    <button class="btn btn-danger btn-comprar-oferta mt-auto w-100 fw-medium" 
                            data-name="${nombreProducto}" 
                            data-price="${precioLimpio}">
                        Comprar Oferta
                    </button>
                </div>
            </div>
        `;

        contenedorOfertas.appendChild(columna);
    });

    // ==========================================================================
    // LÓGICA DEL BOTÓN DE COMPRAR OFERTA (Alerta local)
    // ==========================================================================
    contenedorOfertas.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-comprar-oferta')) {
            const nombre = e.target.getAttribute('data-name');
            const precio = parseInt(e.target.getAttribute('data-price'), 10);

            // Muestra una ventana de confirmación en el navegador en lugar de abrir WhatsApp
            alert(`¡Excelente elección!\n\nVas a comprar la oferta de:\n${nombre}\n\nTotal Especial: $${precio.toLocaleString('es-AR')}`);
        }
    });
});

function mostrarMensajeVacio(contenedor) {
    contenedor.innerHTML = `
        <div class="col-12 text-center my-5">
            <p class="alert alert-info bg-black text-white border-secondary">
                📢 En este momento no hay liquidaciones activas. ¡Volvé pronto!
            </p>
        </div>
    `;
}