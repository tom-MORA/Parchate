const contenedorMapa = document.getElementById("contenedor-svg-mapa");
const selectComunaMovil = document.getElementById("select-comuna");
let comunaSeleccionada = null;

// 1. CARGAR EL MAPA SVG EN DESKTOP
if (contenedorMapa) {
    fetch("imagenes/medellin.svg")
        .then(respuesta => respuesta.text())
        .then(svg => {
            contenedorMapa.innerHTML = svg;
            iniciarMapa();
        })
        .catch(error => console.error("Error al cargar mapa SVG:", error));
}

// 2. FUNCIÓN PARA CARGAR Y MOSTRAR LOS DATOS DE LA COMUNA
function cargarDatosComuna(comunaKey) {
    const tarjetaContenedor = document.getElementById("eventos_prin");
    if (tarjetaContenedor) {
        tarjetaContenedor.style.display = "block";
    }

    const datos = window.datosComunas ? window.datosComunas[comunaKey] : null;

    if (datos) {
        document.getElementById("nombre-comuna").textContent = datos.nombre;
        document.getElementById("info-comuna").textContent = datos.descripcion;
        document.getElementById("eventos-comuna").textContent = datos.eventos;
        document.getElementById("lugares-comuna").textContent = datos.lugares;
        document.getElementById("actividades-comuna").textContent = datos.actividades;
    } else {
        document.getElementById("nombre-comuna").textContent = comunaKey;
        document.getElementById("info-comuna").textContent = "Sin información disponible por ahora.";
        document.getElementById("eventos-comuna").textContent = "Próximamente...";
        document.getElementById("lugares-comuna").textContent = "Próximamente...";
        document.getElementById("actividades-comuna").textContent = "Próximamente...";
    }

    const btnVerMas = document.getElementById("ver-mas");
    if (btnVerMas) {
        btnVerMas.onclick = () => {
            window.location.href = `comuna.html?comuna=${comunaKey}`;
        };
    }

    // Baja suavemente y centra la tarjeta en pantalla
    tarjetaContenedor.scrollIntoView({ behavior: "smooth", block: "center" });
}

// 3. EVENTOS DEL MAPA INTERACTIVO (DESKTOP)
function iniciarMapa() {
    const comunas = document.querySelectorAll("path[id]");

    comunas.forEach(comuna => {
        comuna.style.cursor = "pointer";

        // Hover
        comuna.addEventListener("mouseenter", () => {
            if (comuna !== comunaSeleccionada) comuna.style.fill = "#2ecc71";
        });

        // Salir del hover
        comuna.addEventListener("mouseleave", () => {
            if (comuna !== comunaSeleccionada) comuna.style.fill = "";
        });

        // Click en la comuna
        comuna.addEventListener("click", () => {
            if (comunaSeleccionada) comunaSeleccionada.style.fill = "";
            comunaSeleccionada = comuna;
            comunaSeleccionada.style.fill = "#f39c12";

            cargarDatosComuna(comuna.id);
        });
    });
}

// 4. SELECTOR DESPLEGABLE PARA MÓVILES
if (selectComunaMovil) {
    selectComunaMovil.addEventListener("change", (e) => {
        const comunaValor = e.target.value;
        if (comunaValor) {
            cargarDatosComuna(comunaValor);
        }
    });
}

// 5. OCULTAR TARJETA AL HACER CLIC FUERA DEL MAPA
document.addEventListener("click", (evento) => {
    const mapa = document.getElementById("mapa");
    const tarjeta = document.getElementById("eventos_prin");

    if (mapa && tarjeta && !mapa.contains(evento.target) && !tarjeta.contains(evento.target)) {
        if (comunaSeleccionada) {
            comunaSeleccionada.style.fill = "";
            comunaSeleccionada = null;
        }
        tarjeta.style.display = "none";
    }
});

// 6. MENÚ HAMBURGUESA
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

// 7. MENÚ DESPLEGABLE DE PERFIL
const btnPerfil = document.getElementById("btn-perfil");
const dropdownPerfil = document.getElementById("dropdown-perfil");

if (btnPerfil && dropdownPerfil) {
    btnPerfil.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownPerfil.classList.toggle("show");
    });

    document.addEventListener("click", () => {
        dropdownPerfil.classList.remove("show");
    });
}

// 8. AUTO-OCULTAR NAVBAR AL HACER SCROLL
let ultimoScroll = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
    let scrollActual = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollActual > ultimoScroll && scrollActual > 80) {
        navbar.classList.add("nav-oculto");
    } else {
        navbar.classList.remove("nav-oculto");
    }
    ultimoScroll = scrollActual <= 0 ? 0 : scrollActual;
});

document.addEventListener("mousemove", (e) => {
    if (e.clientY <= 50 && navbar) {
        navbar.classList.remove("nav-oculto");
    }
});

// 9. WIDGET FLOTANTE DE IA
const aiBtn = document.getElementById("ai-widget-btn");
const aiChatBox = document.getElementById("ai-chat-box");
const aiCloseBtn = document.getElementById("ai-chat-close");

if (aiBtn && aiChatBox && aiCloseBtn) {
    aiBtn.addEventListener("click", () => aiChatBox.classList.toggle("oculto"));
    aiCloseBtn.addEventListener("click", () => aiChatBox.classList.add("oculto"));
}

// 10. FORMULARIO DE CONTACTO
const formContacto = document.getElementById("form-contacto");

if (formContacto) {
    formContacto.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("¡Gracias por escribirnos! Tu mensaje ha sido enviado correctamente.");
        formContacto.reset();
    });
}