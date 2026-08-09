const contenedorMapa = document.getElementById("mapa");

let comunaSeleccionada = null;

fetch("imagenes/medellin.svg")
    .then(respuesta => respuesta.text())
    .then(svg => {
        contenedorMapa.innerHTML = svg;
        iniciarMapa();
    });

function iniciarMapa() {

    const datosComunas = {

        Popular: {
            nombre: "Popular",
            descripcion: "Comuna ubicada en la zona nororiental de Medellín.",
            eventos: "Próximamente tendremos eventos de Popular.",
            lugares: "Próximamente tendremos lugares de Popular.",
            actividades: "Próximamente tendremos actividades de Popular."
        },

        Santa_Cruz: {
            nombre: "Santa Cruz",
            descripcion: "Comuna ubicada en la zona nororiental de Medellín.",
            eventos: "Próximamente tendremos eventos de Santa Cruz.",
            lugares: "Próximamente tendremos lugares de Santa Cruz.",
            actividades: "Próximamente tendremos actividades de Santa Cruz."
        },

        Manrique: {
            nombre: "Manrique",
            descripcion: "Comuna ubicada en la zona nororiental de Medellín.",
            eventos: "Próximamente tendremos eventos de Manrique.",
            lugares: "Próximamente tendremos lugares de Manrique.",
            actividades: "Próximamente tendremos actividades de Manrique."
        },

        Aranjuez: {
            nombre: "Aranjuez",
            descripcion: "Comuna ubicada en la zona nororiental de Medellín.",
            eventos: "Próximamente tendremos eventos de Aranjuez.",
            lugares: "Próximamente tendremos lugares de Aranjuez.",
            actividades: "Próximamente tendremos actividades de Aranjuez."
        },

        Castilla: {
            nombre: "Castilla",
            descripcion: "Comuna ubicada en la zona noroccidental de Medellín.",
            eventos: "Próximamente tendremos eventos de Castilla.",
            lugares: "Próximamente tendremos lugares de Castilla.",
            actividades: "Próximamente tendremos actividades de Castilla."
        },

        Doce_de_octubre: {
            nombre: "Doce de Octubre",
            descripcion: "Comuna ubicada en la zona noroccidental de Medellín.",
            eventos: "Próximamente tendremos eventos del Doce de Octubre.",
            lugares: "Próximamente tendremos lugares del Doce de Octubre.",
            actividades: "Próximamente tendremos actividades del Doce de Octubre."
        },

        Robledo: {
            nombre: "Robledo",
            descripcion: "Comuna ubicada al occidente de Medellín.",
            eventos: "Próximamente tendremos eventos de Robledo.",
            lugares: "Próximamente tendremos lugares de Robledo.",
            actividades: "Próximamente tendremos actividades de Robledo."
        },

        Villa_hermosa: {
            nombre: "Villa Hermosa",
            descripcion: "Comuna ubicada en la zona centrooriental de Medellín.",
            eventos: "Próximamente tendremos eventos de Villa Hermosa.",
            lugares: "Próximamente tendremos lugares de Villa Hermosa.",
            actividades: "Próximamente tendremos actividades de Villa Hermosa."
        },

        Buenos_aires: {
            nombre: "Buenos Aires",
            descripcion: "Comuna ubicada en la zona centrooriental de Medellín.",
            eventos: "Próximamente tendremos eventos de Buenos Aires.",
            lugares: "Próximamente tendremos lugares de Buenos Aires.",
            actividades: "Próximamente tendremos actividades de Buenos Aires."
        },

        La_candelaria: {
            nombre: "La Candelaria",
            descripcion: "Comuna ubicada en el centro de Medellín.",
            eventos: "Próximamente tendremos eventos de La Candelaria.",
            lugares: "Próximamente tendremos lugares de La Candelaria.",
            actividades: "Próximamente tendremos actividades de La Candelaria."
        },

        Laureles_Estadio: {
            nombre: "Laureles-Estadio",
            descripcion: "Comuna ubicada en la zona centrooccidental de Medellín.",
            eventos: "Próximamente tendremos eventos de Laureles-Estadio.",
            lugares: "Próximamente tendremos lugares de Laureles-Estadio.",
            actividades: "Próximamente tendremos actividades de Laureles-Estadio."
        },

        La_america: {
            nombre: "La América",
            descripcion: "Comuna ubicada en la zona centrooccidental de Medellín.",
            eventos: "Próximamente tendremos eventos de La América.",
            lugares: "Próximamente tendremos lugares de La América.",
            actividades: "Próximamente tendremos actividades de La América."
        },

        San_javier: {
            nombre: "San Javier",
            descripcion: "Comuna ubicada en la zona occidental de Medellín.",
            eventos: "Próximamente tendremos eventos de San Javier.",
            lugares: "Próximamente tendremos lugares de San Javier.",
            actividades: "Próximamente tendremos actividades de San Javier."
        },

        Belen: {
            nombre: "Belén",
            descripcion: "Comuna ubicada en la zona suroccidental de Medellín.",
            eventos: "Próximamente tendremos eventos de Belén.",
            lugares: "Próximamente tendremos lugares de Belén.",
            actividades: "Próximamente tendremos actividades de Belén."
        },

        Guayabal: {
            nombre: "Guayabal",
            descripcion: "Comuna ubicada en la zona suroccidental de Medellín.",
            eventos: "Próximamente tendremos eventos de Guayabal.",
            lugares: "Próximamente tendremos lugares de Guayabal.",
            actividades: "Próximamente tendremos actividades de Guayabal."
        },

        El_poblado: {
            nombre: "El Poblado",
            descripcion: "Comuna ubicada en la zona suroriental de Medellín.",
            eventos: "Próximamente tendremos eventos de El Poblado.",
            lugares: "Próximamente tendremos lugares de El Poblado.",
            actividades: "Próximamente tendremos actividades de El Poblado."
        }
    };


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

            document.getElementById("ver-mas").onclick = () => {
                window.location.href = `comuna.html?comuna=${comuna.id}`;
            };
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