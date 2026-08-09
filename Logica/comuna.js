const parametros = new URLSearchParams(window.location.search);

const comuna = parametros.get("comuna");

console.log("Comuna recibida:", comuna);