document.addEventListener('DOMContentLoaded', () => {
    // Proteger la ruta: si no ha iniciado sesión, lo regresa a login.html
    if (!localStorage.getItem('adminToken')) {
        window.location.href = 'login.html';
        return;
    }

    // Botón para cerrar sesión
    const btnCerrar = document.getElementById('btn-cerrar');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            localStorage.removeItem('adminToken');
            window.location.href = 'login.html';
        });
    }

    const API_BASE = 'http://localhost:3000/api';

    // Cargar Eventos desde el Backend
    async function cargarEventos() {
        try {
            const res = await fetch(`${API_BASE}/eventos`);
            const eventos = await res.json();
            const tbody = document.getElementById('tabla-eventos');
            if (tbody) {
                tbody.innerHTML = eventos.map(e => `
                    <tr>
                        <td>${e.titulo}</td>
                        <td>${e.comuna}</td>
                        <td>${e.lugar}</td>
                        <td>${e.requiereTicket ? '🎟️ Ticket' : '🆓 Libre'}</td>
                        <td>${e.precio}</td>
                        <td>
                            <button class="btn-delete" data-id="${e.id}">Eliminar</button>
                        </td>
                    </tr>
                `).join('');

                // Asignar evento de eliminar a los botones
                document.querySelectorAll('.btn-delete').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        eliminarEvento(id);
                    });
                });
            }
        } catch (err) {
            console.error("Error al cargar eventos:", err);
        }
    }

    // Crear un nuevo evento (POST)
    const formCrear = document.getElementById('form-crear-evento');
    if (formCrear) {
        formCrear.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nuevoEvento = {
                titulo: document.getElementById('titulo').value,
                comuna: document.getElementById('comuna').value,
                fecha: document.getElementById('fecha').value,
                lugar: document.getElementById('lugar').value,
                requiereTicket: document.getElementById('requiereTicket').value === 'true',
                precio: document.getElementById('precio').value,
                descripcion: document.getElementById('descripcion').value
            };

            try {
                const respuesta = await fetch(`${API_BASE}/eventos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevoEvento)
                });

                if (respuesta.ok) {
                    alert('¡Evento creado exitosamente!');
                    formCrear.reset();
                    cargarEventos();
                } else {
                    alert('Error al guardar el evento.');
                }
            } catch (error) {
                console.error("Error al conectar con la API de eventos:", error);
            }
        });
    }

    // Eliminar evento (DELETE)
    async function eliminarEvento(id) {
        if (confirm("¿Estás seguro de eliminar este evento?")) {
            try {
                await fetch(`${API_BASE}/eventos/${id}`, { method: 'DELETE' });
                cargarEventos();
            } catch (error) {
                console.error("Error al eliminar el evento:", error);
            }
        }
    }

    // Cargar Mensajes de Contacto desde el Backend
    async function cargarMensajes() {
        try {
            const res = await fetch(`${API_BASE}/contacto`);
            const mensajes = await res.json();
            const tbody = document.getElementById('tabla-mensajes');
            if (tbody) {
                tbody.innerHTML = mensajes.map(m => `
                    <tr>
                        <td>${new Date(m.fecha).toLocaleDateString()}</td>
                        <td>${m.nombre}</td>
                        <td>${m.email}</td>
                        <td>${m.mensaje}</td>
                    </tr>
                `).join('');
            }
        } catch (err) {
            console.error("Error al cargar mensajes:", err);
        }
    }

    // Inicializar cargas de datos al abrir
    cargarEventos();
    cargarMensajes();
});