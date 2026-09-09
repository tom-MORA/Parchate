// 1. Cargar parámetros de la URL
const parametros = new URLSearchParams(window.location.search);
const comuna = parametros.get("comuna");

console.log("Comuna recibida:", comuna);

// 2. Buscar datos en el objeto global datosComunas
const datos = window.datosComunas ? window.datosComunas[comuna] : null;

if (datos) {
    document.getElementById("nombre-comuna").textContent = datos.nombre;
    document.getElementById("descripcion-comuna").textContent = datos.descripcion;
    document.getElementById("eventos-comuna").textContent = datos.eventos;
    document.getElementById("lugares-comuna").textContent = datos.lugares;
    document.getElementById("actividades-comuna").textContent = datos.actividades;
} else {
    document.getElementById("nombre-comuna").textContent = "Comuna no encontrada";
    document.getElementById("descripcion-comuna").textContent = "No encontramos información de esta comuna.";
    document.getElementById("eventos-comuna").textContent = "";
    document.getElementById("lugares-comuna").textContent = "";
    document.getElementById("actividades-comuna").textContent = "";
}

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