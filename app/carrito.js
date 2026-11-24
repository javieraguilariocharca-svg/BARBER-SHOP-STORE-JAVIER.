

const listaCarrito = document.getElementById("lista-carrito");
const subtotalElemento = document.getElementById("subtotal");
const envioElemento = document.getElementById("envio");
const totalElemento = document.getElementById("total");

const botonFinalizar = document.getElementById("btn-finalizar");
const botonConfirmar = document.getElementById("btn-confirmar");
const botonCancelar = document.getElementById("btn-cancelar");

const confirmacionCompra = document.getElementById("confirmacion-compra");
const mensajeExito = document.getElementById("mensaje-exito");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let temporizadorMensaje;

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function mostrarCarrito() {
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = `
            <div class="carrito-vacio">
                <p>Tu carrito está vacío.</p>
                <a href="productos.html" class="btn-comprar">
                    Ver productos
                </a>
            </div>
        `;

        subtotalElemento.textContent = "Bs. 0";
        envioElemento.textContent = "Por calcular";
        totalElemento.textContent = "Bs. 0";
        return;
    }

    carrito.forEach((producto, indice) => {
        listaCarrito.innerHTML += `
            <div class="producto-carrito">
                <div class="info-carrito">
                    <h3>${producto.nombre}</h3>
                    <p>Precio: Bs. ${producto.precio}</p>
                    <p>Stock disponible: ${producto.stock}</p>
                </div>

                <div class="controles-cantidad">
                    <button onclick="cambiarCantidad(${indice}, -1)">−</button>
                    <span>${producto.cantidad}</span>
                    <button onclick="cambiarCantidad(${indice}, 1)">+</button>
                </div>

                <div class="precio-carrito">
                    <strong>Bs. ${producto.precio * producto.cantidad}</strong>
                    <button class="eliminar-producto" onclick="eliminarProducto(${indice})">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    });

    calcularTotal();
}

function calcularTotal() {
    const subtotal = carrito.reduce((total, producto) => {
        return total + producto.precio * producto.cantidad;
    }, 0);

    subtotalElemento.textContent = "Bs. " + subtotal.toLocaleString("es-BO");
    envioElemento.textContent = "Por calcular";
    totalElemento.textContent = "Bs. " + subtotal.toLocaleString("es-BO");
}

function cambiarCantidad(indice, cambio) {
    const nuevaCantidad = carrito[indice].cantidad + cambio;

    if (nuevaCantidad <= 0) {
        return;
    }

    if (nuevaCantidad > carrito[indice].stock) {
        alert("No hay suficiente stock disponible.");
        return;
    }

    carrito[indice].cantidad = nuevaCantidad;

    guardarCarrito();
    mostrarCarrito();
}

function eliminarProducto(indice) {
    carrito.splice(indice, 1);

    guardarCarrito();
    mostrarCarrito();
}

/* =========================================
   FINALIZAR COMPRA
========================================= */

botonFinalizar.addEventListener("click", function() {

    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    confirmacionCompra.hidden = false;
});

/* =========================================
   CANCELAR COMPRA
========================================= */

botonCancelar.addEventListener("click", function() {

    confirmacionCompra.hidden = true;

});

/* =========================================
   CONFIRMAR COMPRA
========================================= */

botonConfirmar.addEventListener("click", function() {

    if (carrito.length === 0) {
        confirmacionCompra.hidden = true;
        alert("Tu carrito está vacío.");
        return;
    }

    confirmacionCompra.hidden = true;

    clearTimeout(temporizadorMensaje);

    mensajeExito.hidden = false;

    mensajeExito.classList.remove("mostrar");

    void mensajeExito.offsetWidth;

    mensajeExito.classList.add("mostrar");

    temporizadorMensaje = setTimeout(function() {

        mensajeExito.hidden = true;

        mensajeExito.classList.remove("mostrar");

    }, 3000);

});

/* =========================================
   MOSTRAR PRODUCTOS
========================================= */

mostrarCarrito();
