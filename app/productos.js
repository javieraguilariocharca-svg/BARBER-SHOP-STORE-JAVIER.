
/* =========================================
   BARBER SHOP STORE - PRODUCTOS
========================================= */

const contenedorProductos = document.getElementById("lista-productos");
const buscador = document.getElementById("buscar-producto");
const filtroCategoria = document.getElementById("filtro-categoria");
const ordenarPrecio = document.getElementById("ordenar-precio");
const filtroStock = document.getElementById("filtro-stock");
const totalProductos = document.getElementById("total-productos");
const mensajeResultados = document.getElementById("mensaje-resultados");

const modal = document.getElementById("modal-producto");
const detalleProducto = document.getElementById("detalle-producto");
const cerrarModal = document.getElementById("cerrar-modal");

let productos = [];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/* CARGAR PRODUCTOS DESDE JSON */

async function cargarProductos() {
    try {
        const respuesta = await fetch("app/productos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo encontrar productos.json");
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
            throw new Error("El JSON debe contener una lista de productos.");
        }

        productos = datos;

        mostrarProductos(productos);

    } catch (error) {
        console.error("Error al cargar los productos:", error);

        contenedorProductos.innerHTML = `
            <div class="sin-productos">
                <h3>No se pudieron cargar los productos</h3>
                <p>Verifica el archivo productos.json e inténtalo nuevamente.</p>
            </div>
        `;
    }
}

/* MOSTRAR PRODUCTOS */

function mostrarProductos(lista) {
    contenedorProductos.innerHTML = "";

    totalProductos.textContent = lista.length;

    if (lista.length === 0) {
        contenedorProductos.innerHTML = `
            <div class="sin-productos">
                <h3>No encontramos productos</h3>
                <p>Prueba con otra búsqueda o modifica los filtros.</p>
            </div>
        `;

        mensajeResultados.textContent = "No hay productos que coincidan con tu búsqueda.";
        return;
    }

    mensajeResultados.textContent = `Se encontraron ${lista.length} productos.`;

    lista.forEach(producto => {
        const disponible = producto.stock > 0;

        contenedorProductos.innerHTML += `
            <article class="tarjeta-producto">

                <div class="imagen-producto">

                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                        onerror="this.src='img/sin-imagen.png'"
                    >

                    <span class="etiqueta-stock ${disponible ? "stock-disponible" : "stock-agotado"}">
                        ${disponible ? "Disponible" : "Agotado"}
                    </span>

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
                        Bs. ${Number(producto.precio).toLocaleString("es-BO")}
                    </p>

                    <p class="cantidad-stock">
                        ${disponible ? "Stock disponible: " + producto.stock : "Producto sin existencias"}
                    </p>

                    <button
                        class="boton-detalles"
                        data-accion="detalles"
                        data-id="${producto.id}"
                    >
                        Ver detalles
                    </button>

                    <button
                        class="boton-agregar"
                        data-accion="agregar"
                        data-id="${producto.id}"
                        ${!disponible ? "disabled" : ""}
                    >
                        ${disponible ? "Agregar al carrito" : "Producto agotado"}
                    </button>

                </div>

            </article>
        `;
    });
}

/* BUSCAR, FILTRAR Y ORDENAR */

function aplicarFiltros() {
    let resultado = [...productos];

    const texto = buscador.value.toLowerCase().trim();
    const categoria = filtroCategoria.value;
    const stock = filtroStock.value;
    const orden = ordenarPrecio.value;

    if (texto !== "") {
        resultado = resultado.filter(producto =>
            producto.nombre.toLowerCase().includes(texto) ||
            producto.descripcion.toLowerCase().includes(texto) ||
            producto.categoria.toLowerCase().includes(texto)
        );
    }

    if (categoria !== "") {
        resultado = resultado.filter(producto =>
            producto.categoria === categoria
        );
    }

    if (stock === "disponible") {
        resultado = resultado.filter(producto =>
            producto.stock > 0
        );
    }

    if (stock === "agotado") {
        resultado = resultado.filter(producto =>
            producto.stock <= 0
        );
    }

    if (orden === "menor") {
        resultado.sort((a, b) => a.precio - b.precio);
    }

    if (orden === "mayor") {
        resultado.sort((a, b) => b.precio - a.precio);
    }

    mostrarProductos(resultado);
}

/* AGREGAR AL CARRITO */

function agregarAlCarrito(id) {
    const producto = productos.find(p => String(p.id) === String(id));

    if (!producto || producto.stock <= 0) {
        alert("Este producto no está disponible.");
        return;
    }

    const productoExistente = carrito.find(p =>
        String(p.id) === String(producto.id) ||
        (!p.id && p.nombre === producto.nombre)
    );

    if (productoExistente) {

        if (productoExistente.cantidad >= producto.stock) {
            alert("No hay suficiente stock disponible.");
            return;
        }

        productoExistente.cantidad++;

        productoExistente.stock = producto.stock;

    } else {

        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            cantidad: 1,
            imagen: producto.imagen
        });

    }

    guardarCarrito();

    alert(`${producto.nombre} se agregó al carrito.`);
}

/* GUARDAR CARRITO */

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

/* MOSTRAR DETALLES */

function abrirDetalles(id) {
    const producto = productos.find(p => String(p.id) === String(id));

    if (!producto) return;

    const disponible = producto.stock > 0;

    detalleProducto.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}"
             onerror="this.src='img/sin-imagen.png'">

        <span class="categoria-producto">
            ${producto.categoria}
        </span>

        <h2>${producto.nombre}</h2>

        <p>${producto.descripcion}</p>

        <p class="precio-producto">
            Bs. ${Number(producto.precio).toLocaleString("es-BO")}
        </p>

        <p class="cantidad-stock">
            ${disponible ? "Stock disponible: " + producto.stock : "Producto agotado"}
        </p>

        <button
            class="boton-agregar"
            data-accion="agregar"
            data-id="${producto.id}"
            ${!disponible ? "disabled" : ""}
        >
            ${disponible ? "Agregar al carrito" : "Producto agotado"}
        </button>
    `;

    modal.classList.add("mostrar");
}

/* EVENTOS DE LOS PRODUCTOS */

contenedorProductos.addEventListener("click", function(event) {
    const boton = event.target.closest("button[data-accion]");

    if (!boton) return;

    const id = boton.dataset.id;
    const accion = boton.dataset.accion;

    if (accion === "detalles") {
        abrirDetalles(id);
    }

    if (accion === "agregar") {
        agregarAlCarrito(id);
    }
});

/* EVENTOS DEL MODAL */

detalleProducto.addEventListener("click", function(event) {
    const boton = event.target.closest("button[data-accion]");

    if (!boton) return;

    if (boton.dataset.accion === "agregar") {
        agregarAlCarrito(boton.dataset.id);
        modal.classList.remove("mostrar");
    }
});

cerrarModal.addEventListener("click", function() {
    modal.classList.remove("mostrar");
});

modal.addEventListener("click", function(event) {
    if (event.target === modal) {
        modal.classList.remove("mostrar");
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        modal.classList.remove("mostrar");
    }
});

/* EVENTOS DE LOS FILTROS */

buscador.addEventListener("input", aplicarFiltros);

filtroCategoria.addEventListener("change", aplicarFiltros);

ordenarPrecio.addEventListener("change", aplicarFiltros);

filtroStock.addEventListener("change", aplicarFiltros);

/* INICIAR CATÁLOGO */

cargarProductos();
