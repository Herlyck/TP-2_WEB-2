import { consumirExcelDrive } from "./consumirExcelDrive.js";

const ID_EXCEL = "1RDN_6mV9xaEjAXrhvYCmjPndFYKid_i_eLO6b2lguWM";

document.addEventListener('DOMContentLoaded', async () => {
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

    infoExcel.forEach(item => {
        // 1. Limpieza del nombre del producto
        let nombreProducto = item.PRODUCTO || "Producto sin nombre";
        if (nombreProducto.includes("Pinza Amperimétrica Digital Uni-T UT210D")) {
            nombreProducto = "Pinza Amperimétrica Digital Uni-T UT210D 200A True RMS 600V 20000μF";
        }

        // 2. Limpieza y formateo del precio a tipo número
        let precioLimpio = 0;
        if (item.PRECIO) {
            precioLimpio = parseInt(item.PRECIO.toString().replace('$', ''), 10);
        }

        const cuotas = item.Garantia || "Sin especificar";
        const imagenUrl = item["Imagen Url"] || "https://via.placeholder.com/150";

        const columna = document.createElement('div');
        columna.classList.add('col');

        // Nota: Agregamos data-name y data-price al botón para usarlos en la lógica de compra
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

    // ==========================================
    // LÓGICA DEL BOTÓN DE COMPRAR
    // ==========================================
    contenedorProductos.addEventListener('click', (e) => {
        // Validamos si el elemento clickeado es el botón de comprar
        if (e.target.classList.contains('btn-comprar')) {
            // Obtenemos los datos guardados en los atributos del botón
            const nombre = e.target.getAttribute('data-name');
            const precio = parseInt(e.target.getAttribute('data-price'), 10);

            // Acción de compra: Por ahora disparamos un alert de confirmación.
            // Podés cambiar esto por un modal de Bootstrap o sumarlo a un carrito.
            alert(`¡Excelente elección!\n\nVas a comprar:\n${nombre}\n\nTotal: $${precio.toLocaleString('es-AR')}`);
            
            // Ejemplo de cómo redirigir a WhatsApp con el producto ya escrito si quisieras:
            /*
            const mensaje = encodeURIComponent(`Hola! Me interesa comprar el producto: ${nombre} por $${precio.toLocaleString('es-AR')}`);
            window.open(`https://wa.me/TUNUMERODETELEFONO?text=${mensaje}`, '_blank');
            */
        }
    });
});