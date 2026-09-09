// 1. Obtener la comuna desde la URL
const parametros = new URLSearchParams(window.location.search);
let comunaKey = parametros.get("comuna");

async function cargarDetalleComuna() {
    if (!comunaKey) {
        document.getElementById("nombre-comuna").textContent = "Selecciona una comuna";
        document.getElementById("descripcion-comuna").textContent = "Regresa al inicio y elige una comuna del mapa para ver sus detalles.";
        return;
    }

    // Normalizar la clave para que coincida con comunasData.json (ej: "El Poblado" -> "El_poblado")
    comunaKey = comunaKey.replace(/ /g, "_");

    document.getElementById("nombre-comuna").textContent = "Cargando...";
    document.getElementById("descripcion-comuna").textContent = "Consultando datos del servidor...";

    try {
        const respuesta = await fetch(`http://localhost:3000/api/infocomunas/${comunaKey}`);
        
        if (!respuesta.ok) {
            throw new Error("No se encontró la comuna");
        }

        const datos = await respuesta.json();

        document.getElementById("nombre-comuna").textContent = datos.nombre;
        document.getElementById("descripcion-comuna").textContent = datos.descripcion;
        document.getElementById("eventos-comuna").textContent = datos.eventos;
        document.getElementById("lugares-comuna").textContent = datos.lugares;
        document.getElementById("actividades-comuna").textContent = datos.actividades;

    } catch (error) {
        console.error("Error al obtener detalle de la comuna:", error);
        document.getElementById("nombre-comuna").textContent = "Error de conexión";
        document.getElementById("descripcion-comuna").textContent = "Asegúrate de que el servidor (node server.js) esté encendido.";
    }
}

cargarDetalleComuna();

// 2. Función asíncrona para consultar la API
async function cargarDetalleComuna() {
    if (!comunaKey) {
        document.getElementById("nombre-comuna").textContent = "Comuna no especificada";
        document.getElementById("descripcion-comuna").textContent = "Por favor selecciona una comuna desde el mapa.";
        return;
    }

    // Mensaje visual mientras responde el servidor
    document.getElementById("nombre-comuna").textContent = "Cargando...";
    document.getElementById("descripcion-comuna").textContent = "Consultando datos del servidor...";

    try {
        const respuesta = await fetch(`http://localhost:3000/api/infocomunas/${comunaKey}`);
        
        if (!respuesta.ok) {
            throw new Error("No se encontró la comuna en el servidor");
        }

        const datos = await respuesta.json();

        // Rellenar la información recibida de la API
        document.getElementById("nombre-comuna").textContent = datos.nombre;
        document.getElementById("descripcion-comuna").textContent = datos.descripcion;
        document.getElementById("eventos-comuna").textContent = datos.eventos;
        document.getElementById("lugares-comuna").textContent = datos.lugares;
        document.getElementById("actividades-comuna").textContent = datos.actividades;

    } catch (error) {
        console.error("Error al obtener detalle de la comuna:", error);
        document.getElementById("nombre-comuna").textContent = "Error de conexión";
        document.getElementById("descripcion-comuna").textContent = "No pudimos conectar con el servidor para obtener la información.";
    }
}

// Ejecutar la carga de datos al abrir la página
cargarDetalleComuna();

// 3. MENÚ HAMBURGUESA EN VISTA COMUNA
const hamburgerBtn = document.getElementById("hamburger-menu");
const navLinks = document.getElementById("nav-links");

if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });
}