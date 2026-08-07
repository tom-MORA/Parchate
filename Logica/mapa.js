const contenedorMapa = document.getElementById("mapa");

let comunaSeleccionada = null;

fetch("imagenes/medellin.svg")
    .then(respuesta => respuesta.text())
    .then(svg => {
        contenedorMapa.innerHTML = svg;
        iniciarMapa();
    });

function iniciarMapa() {

    const comunas = document.querySelectorAll("path[id]");

    console.log("Comunas encontradas:", comunas.length);

    comunas.forEach(comuna => {

        comuna.style.cursor = "pointer";

        // Cuando entra el mouse
        comuna.addEventListener("mouseenter", () => {

            if (comuna !== comunaSeleccionada) {
                comuna.style.fill = "#2ecc71";
            }

        });

        // Cuando sale el mouse
        comuna.addEventListener("mouseleave", () => {

            if (comuna !== comunaSeleccionada) {
                comuna.style.fill = "";
            }

        });

        // Cuando hace clic
        comuna.addEventListener("click", () => {

            // Quitar selección anterior
            if (comunaSeleccionada) {
                comunaSeleccionada.style.fill = "";
            }

            // Seleccionar nueva comuna
            comunaSeleccionada = comuna;
            comunaSeleccionada.style.fill = "#f39c12";

            // Mostrar nombre
            const nombre = comuna.id;

            document.getElementById("nombre-comuna").textContent = nombre;

            document.getElementById("info-comuna").textContent =
                "Aquí aparecerá la información de esta comuna.";

        });

    });

}