
const tabla = document.getElementById("tabla-productos");
const tablaBajoStock = document.getElementById("tabla-bajo-stock");

const totalProductos = document.getElementById("total-productos");
const disponibles = document.getElementById("productos-disponibles");
const agotados = document.getElementById("productos-agotados");
const bajoStock = document.getElementById("productos-bajo-stock");
const valorInventario = document.getElementById("valor-inventario");
const totalCategorias = document.getElementById("total-categorias");

const buscador = document.getElementById("buscar-producto");
const fechaActualizacion = document.getElementById("fecha-actualizacion");

let listaProductos = [];

const LIMITE_STOCK = 5;

async function cargarDashboard() {
    try {
        const respuesta = await fetch("app/productos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el archivo JSON");
        }

        listaProductos = await respuesta.json();

        if (!Array.isArray(listaProductos)) {
            throw new Error("El archivo JSON no contiene una lista de productos");
        }

        mostrarResumen();
        mostrarProductos(listaProductos);
        mostrarProductosBajoStock();
        mostrarGraficoCategorias();
        mostrarGraficoStock();
        actualizarFecha();

    } catch (error) {
        console.error("Error:", error);

        tabla.innerHTML = `
            <tr>
                <td colspan="5">No se pudieron cargar los productos.</td>
            </tr>
        `;

        tablaBajoStock.innerHTML = `
            <tr>
                <td colspan="4">No se pudieron cargar los productos.</td>
            </tr>
        `;
    }
}

// RESUMEN DE INVENTARIO

function mostrarResumen() {
    const disponiblesLista = listaProductos.filter(
        producto => Number(producto.stock) > 0
    );

    const agotadosLista = listaProductos.filter(
        producto => Number(producto.stock) <= 0
    );

    const bajoStockLista = listaProductos.filter(
        producto => Number(producto.stock) > 0 &&
                    Number(producto.stock) <= LIMITE_STOCK
    );

    const categorias = [
        ...new Set(listaProductos.map(
            producto => producto.categoria
        ))
    ];

    const valor = listaProductos.reduce(
        (total, producto) =>
            total + (
                Number(producto.precio) * Number(producto.stock)
            ),
        0
    );

    totalProductos.textContent = listaProductos.length;
    disponibles.textContent = disponiblesLista.length;
    agotados.textContent = agotadosLista.length;
    bajoStock.textContent = bajoStockLista.length;
    totalCategorias.textContent = categorias.length;

    valorInventario.textContent =
        "Bs. " + valor.toLocaleString("es-BO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
}

// TABLA GENERAL DE PRODUCTOS

function mostrarProductos(productos) {
    if (productos.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="5">No se encontraron productos.</td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = productos.map(producto => {
        const stock = Number(producto.stock);
        const precio = Number(producto.precio);

        return `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>Bs. ${precio.toFixed(2)}</td>
                <td>${stock}</td>
                <td>
                    <span class="${
                        stock > 0
                            ? "estado-disponible"
                            : "estado-agotado"
                    }">
                        ${stock > 0 ? "Disponible" : "Agotado"}
                    </span>
                </td>
            </tr>
        `;
    }).join("");
}

// BUSCAR PRODUCTOS

buscador.addEventListener("input", function () {
    const texto = this.value.toLowerCase().trim();

    const filtrados = listaProductos.filter(producto =>
        producto.nombre.toLowerCase().includes(texto) ||
        producto.categoria.toLowerCase().includes(texto)
    );

    mostrarProductos(filtrados);
});

// PRODUCTOS CON POCO STOCK

function mostrarProductosBajoStock() {
    const productosBajos = listaProductos.filter(producto => {
        const stock = Number(producto.stock);

        return stock > 0 && stock <= LIMITE_STOCK;
    });

    if (productosBajos.length === 0) {
        tablaBajoStock.innerHTML = `
            <tr>
                <td colspan="4">No hay productos con poco stock.</td>
            </tr>
        `;
        return;
    }

    tablaBajoStock.innerHTML = productosBajos.map(producto => `
        <tr>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>${Number(producto.stock)}</td>
            <td>
                <span class="estado-bajo-stock">
                    Reponer producto
                </span>
            </td>
        </tr>
    `).join("");
}

// GRÁFICO DE PRODUCTOS POR CATEGORÍA

function mostrarGraficoCategorias() {
    const contenedor = document.getElementById("grafico-categorias");

    const categorias = {};

    listaProductos.forEach(producto => {
        const categoria = producto.categoria || "Sin categoría";

        categorias[categoria] = (categorias[categoria] || 0) + 1;
    });

    const valores = Object.entries(categorias);
    const maximo = Math.max(...valores.map(item => item[1]), 1);

    if (valores.length === 0) {
        contenedor.innerHTML = "<p>No hay datos para mostrar.</p>";
        return;
    }

    contenedor.innerHTML = valores.map(([categoria, cantidad]) => {
        const porcentaje = (cantidad / maximo) * 100;

        return `
            <div class="barra-categoria">
                <div class="barra-informacion">
                    <span>${categoria}</span>
                    <strong>${cantidad}</strong>
                </div>

                <div class="barra-fondo">
                    <div
                        class="barra-relleno"
                        style="width: ${porcentaje}%"
                    ></div>
                </div>
            </div>
        `;
    }).join("");
}

// GRÁFICO DE DISTRIBUCIÓN DEL STOCK

function mostrarGraficoStock() {
    const grafico = document.getElementById("grafico-stock");
    const totalGrafico = document.getElementById("total-stock-grafico");
    const leyenda = document.getElementById("leyenda-stock");

    const disponiblesCantidad = listaProductos.filter(
        producto => Number(producto.stock) > 0
    ).length;

    const agotadosCantidad = listaProductos.filter(
        producto => Number(producto.stock) <= 0
    ).length;

    const total = disponiblesCantidad + agotadosCantidad;

    totalGrafico.textContent = total;

    if (total === 0) {
        grafico.style.background = "#dddddd";
    } else {
        const porcentajeDisponibles =
            (disponiblesCantidad / total) * 100;

        grafico.style.background = `
            conic-gradient(
                #c9a227 0% ${porcentajeDisponibles}%,
                #b83b32 ${porcentajeDisponibles}% 100%
            )
        `;
    }

    leyenda.innerHTML = `
        <div class="elemento-leyenda">
            <span class="color-disponible"></span>
            <p>Disponibles: <strong>${disponiblesCantidad}</strong></p>
        </div>

        <div class="elemento-leyenda">
            <span class="color-agotado"></span>
            <p>Agotados: <strong>${agotadosCantidad}</strong></p>
        </div>
    `;
}

// FECHA Y HORA DE ACTUALIZACIÓN

function actualizarFecha() {
    const ahora = new Date();

    fechaActualizacion.textContent = ahora.toLocaleString("es-BO", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

// INICIAR DASHBOARD

cargarDashboard();
