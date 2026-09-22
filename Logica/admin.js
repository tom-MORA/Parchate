document.addEventListener('DOMContentLoaded', () => {
    // Proteger ruta
    if (!localStorage.getItem('adminToken')) {
        window.location.href = 'login.html';
        return;
    }

    const btnCerrar = document.getElementById('btn-cerrar-admin') || document.getElementById('btn-cerrar');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('usuarioSesion');
            window.location.href = 'login.html';
        });
    }

    const API_BASE = 'http://localhost:3000/api';
    const formEvento = document.getElementById('form-crear-evento') || document.getElementById('form-evento');
    const btnSubmit = document.getElementById('btn-submit-evento');
    const selectFiltroComuna = document.getElementById('filtro-comuna');
    let todosLosEventos = [];
    let editandoId = null;

    // Formateador de moneda en pesos colombianos
    function formatearPrecioCOP(valorInput, requiereTicket) {
        if (!requiereTicket || !valorInput || valorInput == '0') {
            return 'Entrada Libre';
        }
        const numero = parseInt(valorInput.toString().replace(/\D/g, ''), 10);
        if (isNaN(numero)) return 'Entrada Libre';
        return `$ ${numero.toLocaleString('es-CO')} COP`;
    }

    // Cargar Eventos desde API
    async function cargarEventosAdmin() {
        try {
            const res = await fetch(`${API_BASE}/eventos`);
            todosLosEventos = await res.json();
            renderizarTablaEventos(todosLosEventos);
        } catch (err) {
            console.error("Error al cargar eventos:", err);
        }
    }

    // Renderizar tabla aplicando filtro
    function renderizarTablaEventos(lista) {
        const tbodyTabla = document.getElementById('tabla-eventos');
        const comunaSeleccionada = selectFiltroComuna ? selectFiltroComuna.value : 'TODAS';

        let eventosFiltrados = lista;
        if (comunaSeleccionada !== 'TODAS') {
            eventosFiltrados = lista.filter(e => e.comuna === comunaSeleccionada);
        }

        if (tbodyTabla) {
            if (eventosFiltrados.length === 0) {
                tbodyTabla.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--texto-mutado);">No hay eventos para la comuna seleccionada.</td></tr>';
                return;
            }

            tbodyTabla.innerHTML = eventosFiltrados.map(e => `
                <tr>
                    <td style="font-weight:bold;">${e.titulo}</td>
                    <td><span style="color:var(--azul-neon);">${e.comuna.replace(/_/g, ' ')}</span></td>
                    <td>${e.lugar}</td>
                    <td>${e.requiereTicket ? '🎟️ Ticket' : '🆓 Libre'}</td>
                    <td style="font-weight:bold;">${e.precio}</td>
                    <td>
                        <button class="btn-edit" onclick="prepararEdicion(${e.id})">✏️ Editar</button>
                        <button class="btn-delete" onclick="eliminarEventoAdmin(${e.id})">🗑️ Borrar</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    // Listener para el Filtro de Comuna
    if (selectFiltroComuna) {
        selectFiltroComuna.addEventListener('change', () => {
            renderizarTablaEventos(todosLosEventos);
        });
    }

    // Guardar (Crear / Editar) Evento
    if (formEvento) {
        formEvento.addEventListener('submit', async (e) => {
            e.preventDefault();

            const requiereTicketBool = document.getElementById('requiereTicket').value === 'true';
            const rawPrecio = document.getElementById('precio').value;

            const datosEvento = {
                titulo: document.getElementById('titulo').value,
                comuna: document.getElementById('comuna').value,
                fecha: document.getElementById('fecha').value,
                lugar: document.getElementById('lugar').value,
                requiereTicket: requiereTicketBool,
                precio: formatearPrecioCOP(rawPrecio, requiereTicketBool),
                descripcion: document.getElementById('descripcion').value
            };

            try {
                let res;
                if (editandoId) {
                    res = await fetch(`${API_BASE}/eventos/${editandoId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(datosEvento)
                    });
                } else {
                    res = await fetch(`${API_BASE}/eventos`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(datosEvento)
                    });
                }

                if (res.ok) {
                    formEvento.reset();
                    editandoId = null;
                    if (btnSubmit) btnSubmit.textContent = 'Guardar Evento';
                    cargarEventosAdmin();
                } else {
                    alert("Error al procesar el evento.");
                }
            } catch (error) {
                console.error("Error de conexión:", error);
            }
        });
    }

    // Cargar datos en formulario para editar
    window.prepararEdicion = (id) => {
        const evento = todosLosEventos.find(e => e.id === id);

        if (evento) {
            editandoId = id;
            document.getElementById('titulo').value = evento.titulo || '';
            document.getElementById('comuna').value = evento.comuna || '';
            document.getElementById('fecha').value = evento.fecha || '';
            document.getElementById('lugar').value = evento.lugar || '';
            document.getElementById('requiereTicket').value = evento.requiereTicket ? 'true' : 'false';
            
            // Extrae únicamente los dígitos si tiene precio
            const soloNumeros = (evento.precio || '').replace(/\D/g, '');
            document.getElementById('precio').value = soloNumeros;

            document.getElementById('descripcion').value = evento.descripcion || '';

            if (btnSubmit) btnSubmit.textContent = '💾 Actualizar Evento';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Eliminar Evento
    window.eliminarEventoAdmin = async (id) => {
        if (confirm("¿Estás seguro de borrar este evento?")) {
            await fetch(`${API_BASE}/eventos/${id}`, { method: 'DELETE' });
            cargarEventosAdmin();
        }
    };

    // Cargar Mensajes de Contacto
    async function cargarMensajes() {
        try {
            const res = await fetch(`${API_BASE}/contacto`);
            const mensajes = await res.json();
            const tbody = document.getElementById('tabla-mensajes');
            if (tbody) {
                if (mensajes.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--texto-mutado);">No hay mensajes recibidos.</td></tr>';
                    return;
                }
                tbody.innerHTML = mensajes.map(m => `
                    <tr>
                        <td>${new Date(m.fecha).toLocaleDateString()}</td>
                        <td style="font-weight:bold;">${m.nombre}</td>
                        <td>${m.email}</td>
                        <td>${m.mensaje}</td>
                    </tr>
                `).join('');
            }
        } catch (err) {
            console.error("Error al cargar mensajes:", err);
        }
    }

    cargarEventosAdmin();
    cargarMensajes();
});