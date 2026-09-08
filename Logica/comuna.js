const parametros = new URLSearchParams(window.location.search);

const comuna = parametros.get("comuna");

console.log("Comuna recibida:", comuna);

const datos = datosComunas[comuna];


if (datos) {

    document.getElementById("nombre-comuna").textContent =
        datos.nombre;

    document.getElementById("descripcion-comuna").textContent =
        datos.descripcion;

    document.getElementById("eventos-comuna").textContent =
        datos.eventos;

    document.getElementById("lugares-comuna").textContent =
        datos.lugares;

    document.getElementById("actividades-comuna").textContent =
        datos.actividades;

} else {
    document.getElementById("nombre-comuna").textContent = 
        "Comuna no encontrada";
    document.getElementById("descripcion-comuna").textContent = 
        "No encontramos información de esta comuna.";
        
    document.getElementById("eventos-comuna").textContent = "";
    document.getElementById("lugares-comuna").textContent = "";
    document.getElementById("actividades-comuna").textContent = "";
}