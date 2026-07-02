import { consumirExcelDrive } from "./consumirExcelDrive.js";

const ID_EXCEL = "1RDN_6mV9xaEjAXrhvYCmjPndFYKid_i_eLO6b2lguWM";

document.addEventListener('DOMContentLoaded', async () => {
    const infoExcel = await consumirExcelDrive(ID_EXCEL);
    const contenedorOfertas = document.querySelector('.productos-oferta');

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
    const productosEnOferta = infoExcel.filter(item => {
        if (!item.Descuento) return false;
        
        const valorDescuento = item.Descuento.toString().trim().toUpperCase();
        return valorDescuento === "SI" || valorDescuento === "SÍ";
    });

    if (productosEnOferta.length === 0) {
        contenedorOfertas.innerHTML = `
            <div class="col-12 text-center">
                <p class="alert alert-info">Próximamente verás nuestras ofertas exclusivas en esta sección.</p>
            </div>
        `;
        return;
    }

    // Dibujamos los productos en oferta
    productosEnOferta.forEach(item => {
        const nombreProducto = item.PRODUCTO || "Producto en Oferta";
        
        let precioLimpio = 0;
        if (item.PRECIO) {
            precioLimpio = parseInt(item.PRECIO.toString().replace('$', ''), 10);
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

        contenedorOfertas.appendChild(columna);
    });

    // LÓGICA DEL BOTÓN DE COMPRAR MODERNA (MODAL PREMIUM DE ÉXITO)
    contenedorOfertas.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-comprar')) {
            const nombre = e.target.getAttribute('data-name');
            const precio = parseInt(e.target.getAttribute('data-price'), 10);

            // Inyectamos los datos en el modal de éxito de la sección ofertas
            document.getElementById('modalCompraNombre').textContent = nombre;
            document.getElementById('modalCompraPrecio').textContent = `$${precio.toLocaleString('es-AR')}`;

            // Levantamos el modal usando la API global de Bootstrap
            const modalExito = new bootstrap.Modal(document.getElementById('modalCompraExito'));
            modalExito.show();
        }
    });
});