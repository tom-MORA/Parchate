const contenedorMapa = document.getElementById("mapa");

let comunaSeleccionada = null;

fetch("imagenes/medellin.svg")
    .then(respuesta => respuesta.text())
    .then(svg => {
        contenedorMapa.innerHTML += svg;
        iniciarMapa();
    });

function iniciarMapa() {

    const comunas = document.querySelectorAll("path[id]");

    console.log("Comunas encontradas:", comunas.length);


    comunas.forEach(comuna => {

        comuna.style.cursor = "pointer";


        // Hover
        comuna.addEventListener("mouseenter", () => {

            if (comuna !== comunaSeleccionada) {
                comuna.style.fill = "#2ecc71";
            }

        });


        // Salir del hover
        comuna.addEventListener("mouseleave", () => {

            if (comuna !== comunaSeleccionada) {
                comuna.style.fill = "";
            }

        });


        // Click
        comuna.addEventListener("click", () => {

            document.getElementById("eventos_prin").style.display = "block";

            // Quitar selección anterior
            if (comunaSeleccionada) {
                comunaSeleccionada.style.fill = "";
            }


            // Guardar nueva selección
            comunaSeleccionada = comuna;


            // Pintar seleccionada
            comunaSeleccionada.style.fill = "#f39c12";


            // Obtener información de la comuna
            const datos = datosComunas[comuna.id];


            // Mostrar información
            if (datos) {

                document.getElementById("nombre-comuna").textContent =
                    datos.nombre;

                document.getElementById("info-comuna").textContent =
                    datos.descripcion;

                document.getElementById("eventos-comuna").textContent =
                    datos.eventos;

                document.getElementById("lugares-comuna").textContent =
                    datos.lugares;

                document.getElementById("actividades-comuna").textContent =
                    datos.actividades;

            } else {

                document.getElementById("nombre-comuna").textContent =
                    comuna.id;

                document.getElementById("info-comuna").textContent =
                    "Todavía no tenemos información de esta comuna.";

                document.getElementById("eventos-comuna").textContent =
                    "Próximamente...";

                document.getElementById("lugares-comuna").textContent =
                    "Próximamente...";

                document.getElementById("actividades-comuna").textContent =
                    "Próximamente...";
            }


            // BOTÓN VER MÁS
            document.getElementById("ver-mas").onclick = () => {
                window.location.href = `comuna.html?comuna=${comuna.id}`;
            };


            // Desplazar automáticamente hacia la tarjeta
            document.getElementById("tarjeta-comuna").scrollIntoView({ behavior: "smooth" });
        });

    });
};

document.addEventListener("click", (evento) => {

    const mapa = document.getElementById("mapa");
    const tarjeta = document.getElementById("eventos_prin");

    // Si el clic fue fuera del mapa y fuera de la tarjeta
    if (!mapa.contains(evento.target) && !tarjeta.contains(evento.target)) {

        // Quitar selección
        if (comunaSeleccionada) {
            comunaSeleccionada.style.fill = "";
            comunaSeleccionada = null;
        }

        // Ocultar tarjeta
        tarjeta.style.display = "none";
    }

});


// Lógica para el menú desplegable del perfil
const btnPerfil = document.getElementById("btn-perfil");
const dropdownPerfil = document.getElementById("dropdown-perfil");

if (btnPerfil && dropdownPerfil) {
    btnPerfil.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownPerfil.classList.toggle("activo");
    });

    document.addEventListener("click", () => {
        dropdownPerfil.classList.remove("activo");
    });
}


// Ocultar Navbar 
let ultimoScroll = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
    let scrollActual = window.pageYOffset || document.documentElement.scrollTop;

    // Si baja más de 80px, oculta la barra. Si sube, la muestra.
    if (scrollActual > ultimoScroll && scrollActual > 80) {
        navbar.classList.add("nav-oculto");
    } else {
        navbar.classList.remove("nav-oculto");
    }
    
    ultimoScroll = scrollActual <= 0 ? 0 : scrollActual;
});

// Mostrar la barra si el usuario mueve el cursor a la parte superior de la pantalla
document.addEventListener("mousemove", (e) => {
    if (e.clientY <= 50) {
        navbar.classList.remove("nav-oculto");
    }
});


// Abrir y cerrar el widget de IA
const aiBtn = document.getElementById("ai-widget-btn");
const aiChatBox = document.getElementById("ai-chat-box");
const aiCloseBtn = document.getElementById("ai-chat-close");

if (aiBtn && aiChatBox && aiCloseBtn) {
    aiBtn.addEventListener("click", () => {
        aiChatBox.classList.toggle("oculto");
    });

    aiCloseBtn.addEventListener("click", () => {
        aiChatBox.classList.add("oculto");
    });
}

// Manejo del formulario de contacto
const formContacto = document.getElementById("form-contacto");

if (formContacto) {
    formContacto.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("¡Gracias por escribirnos! Tu mensaje ha sido enviado correctamente.");
        formContacto.reset();
    });
}