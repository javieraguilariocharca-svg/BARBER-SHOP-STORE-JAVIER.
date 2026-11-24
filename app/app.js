
async function cargarProductosDestacados() {
    const contenedor = document.getElementById("productos-destacados");

    if (!contenedor) return;

    try {
        const respuesta = await fetch("app/productos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar productos.json");
        }

        const productos = await respuesta.json();

        contenedor.innerHTML = "";

        productos.slice(0, 4).forEach(producto => {
            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta-producto";

            tarjeta.innerHTML = `
                <div class="imagen-producto">
                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                    >
                </div>

                <div class="informacion-producto">
                    <span class="categoria-producto">
                        ${producto.categoria}
                    </span>

                    <h3 class="nombre-producto">
                        ${producto.nombre}
                    </h3>

                    <p class="descripcion-producto">
                        ${producto.descripcion}
                    </p>

                    <p class="precio-producto">
                        Bs ${Number(producto.precio).toFixed(2)}
                    </p>

                    <a href="productos.html" class="boton-detalles">
                        Ver producto
                    </a>
                </div>
            `;

            contenedor.appendChild(tarjeta);
        });

    } catch (error) {
        console.error("Error al cargar productos:", error);

        contenedor.innerHTML = `
            <p class="inicio-cargando">
                No se pudieron cargar los productos.
                Verifica el archivo productos.json.
            </p>
        `;
    }
}

function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");

    if (!contador) return;

    try {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        const cantidadTotal = carrito.reduce(
            (total, producto) => total + Number(producto.cantidad || 0),
            0
        );

        contador.textContent = `Mi compra (${cantidadTotal})`;

    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        contador.textContent = "Mi compra (0)";
    }
}

cargarProductosDestacados();
actualizarContadorCarrito();

window.addEventListener("storage", actualizarContadorCarrito);
