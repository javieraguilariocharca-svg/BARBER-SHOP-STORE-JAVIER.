
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

document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);

window.addEventListener("storage", actualizarContadorCarrito);
