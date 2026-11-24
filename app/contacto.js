const formulario = document.getElementById("formulario-contacto");
const respuesta = document.getElementById("respuesta");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    // OBTENER LOS DATOS
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const celular = document.getElementById("celular").value.trim();
    const asunto = document.getElementById("asunto").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    // VALIDAR CAMPOS VACÍOS
    if (!nombre || !correo || !celular || !asunto || !mensaje) {
        mostrarRespuesta("Por favor, completa todos los campos.", "error");
        return;
    }

    // VALIDAR NOMBRE
    if (nombre.length < 3) {
        mostrarRespuesta("El nombre debe tener al menos 3 caracteres.", "error");
        return;
    }

    // VALIDAR CORREO
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correo)) {
        mostrarRespuesta("Ingresa un correo electrónico válido.", "error");
        return;
    }

    // VALIDAR CELULAR
    const formatoCelular = /^[0-9]{8}$/;

    if (!formatoCelular.test(celular)) {
        mostrarRespuesta("El celular debe tener exactamente 8 dígitos.", "error");
        return;
    }

    // VALIDAR ASUNTO
    if (asunto.length < 3) {
        mostrarRespuesta("El asunto debe tener al menos 3 caracteres.", "error");
        return;
    }

    // VALIDAR MENSAJE
    if (mensaje.length < 10) {
        mostrarRespuesta("El mensaje debe tener al menos 10 caracteres.", "error");
        return;
    }

    // CONFIRMAR REGISTRO
    mostrarRespuesta(
        "¡Gracias, " + nombre + "! Tu mensaje fue registrado correctamente.",
        "exito"
    );

    formulario.reset();
});

// MOSTRAR RESPUESTAS
function mostrarRespuesta(texto, tipo) {
    respuesta.textContent = texto;

    respuesta.className = tipo === "exito"
        ? "respuesta-exito"
        : "respuesta-error";
}