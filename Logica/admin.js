document.addEventListener('DOMContentLoaded', () => {
    // 1. PROTEGER RUTA Y CONTROL DE SESIÓN
    if (!localStorage.getItem('adminToken')) {
        window.location.href = 'login.html';
        return;
    }

    const btnSalir = document.querySelector('.btn-salir');
    if (btnSalir) {
        btnSalir.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('adminToken');
            localStorage.removeItem('usuarioSesion');
            window.location.href = 'login.html';
        });
    }

    const API_BASE = 'http://localhost:3000/api';
    let todosLosEventos = [];
    let todosLosUsuarios = [];
    let eventoAEliminarId = null;

    // 2. CAMBIO DE PESTAÑAS DEL SIDEBAR
    window.cambiarPestana = function(idPestana) {
        // Ocultar todas las secciones
        const secciones = document.querySelectorAll('.contenido-pestana');
        secciones.forEach(sec => sec.classList.remove('active'));

        // Desmarcar botones del sidebar
        const botones = document.querySelectorAll('.nav-btn');
        botones.forEach(btn => btn.classList.remove('active'));

        // Mostrar sección actual
        const seccionActiva = document.getElementById(`seccion-${idPestana}`);
        if (seccionActiva) seccionActiva.classList.add('active');

        // Activar el botón presionado
        if (window.event && window.event.currentTarget) {
            window.event.currentTarget.classList.add('active');
        }

        // Título dinámico en la barra superior
        const titulos = {
            'metricas': 'Métricas Principales',
            'parches': 'Gestión de Parches',
            'usuarios': 'Gestión de Parcheros y Fidelidad',
            'mensajes': 'Bandeja de Mensajes'
        };
        const tituloElem = document.getElementById('titulo-seccion');
        if (tituloElem) {
            tituloElem.innerText = titulos[idPestana] || 'Panel de Control';
        }
    };

    // 3. CARGAR MÉTRICAS Y KPIS
    function actualizarMetricas() {
        const totalEvElem = document.getElementById('kpi-total-eventos');
        const totalUsElem = document.getElementById('kpi-total-usuarios');
        const comunaTopElem = document.getElementById('kpi-comuna-top');

        if (totalEvElem) totalEvElem.innerText = todosLosEventos.length;
        if (totalUsElem) totalUsElem.innerText = todosLosUsuarios.length;

        // Calcular comuna más activa según eventos cargados
        if (comunaTopElem) {
            if (todosLosEventos.length > 0) {
                const conteoComunas = {};
                todosLosEventos.forEach(e => {
                    const c = e.comuna ? e.comuna.replace(/_/g, ' ') : 'Desconocida';
                    conteoComunas[c] = (conteoComunas[c] || 0) + 1;
                });
                const comunaTop = Object.keys(conteoComunas).reduce((a, b) => conteoComunas[a] > conteoComunas[b] ? a : b);
                comunaTopElem.innerText = comunaTop;
            } else {
                comunaTopElem.innerText = 'Sin Datos';
            }
        }
    }

    // 4. GESTIÓN DE PARCHES (CARGAR Y RENDERIZAR TABLA)
    async function cargarEventosAdmin() {
        try {
            const res = await fetch(`${API_BASE}/eventos`);
            todosLosEventos = await res.json();
            renderizarTablaParches(todosLosEventos);
            actualizarMetricas();
        } catch (err) {
            console.error("Error al cargar eventos:", err);
        }
    }

    function renderizarTablaParches(lista) {
        const tbody = document.getElementById('tabla-parches-body');
        if (!tbody) return;

        if (lista.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No hay parches registrados.</td></tr>';
            return;
        }

        tbody.innerHTML = lista.map(e => `
            <tr>
                <td style="font-weight:bold; color:#fff;">${e.titulo}</td>
                <td><span style="color:#00D2FF;">${(e.comuna || '').replace(/_/g, ' ')}</span></td>
                <td>${e.fecha || 'Por definir'}</td>
                <td style="color:#FF007A; font-weight:bold;">${e.precio || 'Gratis'}</td>
                <td>${e.aforo || 'Libre'}</td>
                <td>
                    <button onclick="prepararEdicion(${e.id})" style="background:none; border:none; color:#00D2FF; cursor:pointer; font-size:16px;" title="Editar">✏️</button>
                    <button onclick="solicitarEliminacion(${e.id})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:16px;" title="Eliminar">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    // 5. CONTROL DE MODAL (CREAR / EDITAR PARCHES)
    window.abrirModalCrear = function() {
        const tituloModal = document.getElementById('modal-parche-titulo');
        const form = document.getElementById('form-crear-parche');
        if (tituloModal) tituloModal.innerText = '+ Nuevo Parche';
        if (form) {
            form.reset();
            delete form.dataset.editandoId;
        }
        const modal = document.getElementById('modal-parche');
        if (modal) modal.classList.add('active');
    };

    window.cerrarModalParche = function() {
        const modal = document.getElementById('modal-parche');
        if (modal) modal.classList.remove('active');
    };

    window.prepararEdicion = function(id) {
        const evento = todosLosEventos.find(e => e.id === id);
        if (!evento) return;

        document.getElementById('p-titulo').value = evento.titulo || '';
        document.getElementById('p-comuna').value = evento.comuna || 'Laureles_Estadio';
        document.getElementById('p-fecha').value = evento.fecha || '';
        
        // Extraer números si contiene formato COP
        const soloNumeros = (evento.precio || '').replace(/\D/g, '');
        document.getElementById('p-precio').value = soloNumeros;
        document.getElementById('p-aforo').value = evento.aforo || '';

        const form = document.getElementById('form-crear-parche');
        if (form) form.dataset.editandoId = id;

        const tituloModal = document.getElementById('modal-parche-titulo');
        if (tituloModal) tituloModal.innerText = '✏️ Editar Parche';

        document.getElementById('modal-parche').classList.add('active');
    };

    const formParche = document.getElementById('form-crear-parche');
    if (formParche) {
        formParche.addEventListener('submit', async (e) => {
            e.preventDefault();
            const editandoId = formParche.dataset.editandoId;
            const rawPrecio = document.getElementById('p-precio').value;

            const datosParche = {
                titulo: document.getElementById('p-titulo').value,
                comuna: document.getElementById('p-comuna').value,
                fecha: document.getElementById('p-fecha').value,
                precio: rawPrecio && rawPrecio !== '0' ? `$ ${parseInt(rawPrecio, 10).toLocaleString('es-CO')} COP` : 'Entrada Libre',
                aforo: document.getElementById('p-aforo').value || 'Libre'
            };

            try {
                let res;
                if (editandoId) {
                    res = await fetch(`${API_BASE}/eventos/${editandoId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(datosParche)
                    });
                } else {
                    res = await fetch(`${API_BASE}/eventos`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(datosParche)
                    });
                }

                if (res.ok) {
                    cerrarModalParche();
                    cargarEventosAdmin();
                } else {
                    alert("Error al procesar el parche.");
                }
            } catch (err) {
                console.error("Error al guardar parche:", err);
            }
        });
    }

    // 6. MODAL DE CONFIRMACIÓN DE ELIMINACIÓN
    window.solicitarEliminacion = function(id) {
        eventoAEliminarId = id;
        const modal = document.getElementById('modal-confirmar');
        if (modal) modal.classList.add('active');
    };

    window.cerrarModalConfirmar = function() {
        eventoAEliminarId = null;
        const modal = document.getElementById('modal-confirmar');
        if (modal) modal.classList.remove('active');
    };

    const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', async () => {
            if (eventoAEliminarId) {
                try {
                    await fetch(`${API_BASE}/eventos/${eventoAEliminarId}`, { method: 'DELETE' });
                    cerrarModalConfirmar();
                    cargarEventosAdmin();
                } catch (err) {
                    console.error("Error al borrar evento:", err);
                }
            }
        });
    }

    // 7. GESTIÓN DE USUARIOS Y NIVELES DE FIDELIDAD
    async function cargarUsuariosAdmin() {
        try {
            const res = await fetch(`${API_BASE}/usuarios`);
            todosLosUsuarios = await res.json();
            renderizarTablaUsuarios(todosLosUsuarios);
            actualizarMetricas();
        } catch (err) {
            console.error("Error al cargar usuarios:", err);
        }
    }

    function calcularRangoFidelidad(boletasCompradas = 0) {
        if (boletasCompradas >= 10) return '<span style="color:#FFD700; font-weight:bold;">🔥 Leyenda del Parche</span>';
        if (boletasCompradas >= 4) return '<span style="color:#00D2FF; font-weight:bold;">⚡ Parchero Frecuente</span>';
        return '<span style="color:#94a3b8;">🌱 Parchero Novato</span>';
    }

    function renderizarTablaUsuarios(lista) {
        const tbody = document.getElementById('tabla-usuarios-body');
        if (!tbody) return;

        if (lista.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#94a3b8;">No hay usuarios registrados.</td></tr>';
            return;
        }

        tbody.innerHTML = lista.map(u => `
            <tr>
                <td style="font-weight:bold; color:#fff;">${u.nombre || 'Sin Nombre'}</td>
                <td>${u.email}</td>
                <td>${u.comuna || 'No elegida'}</td>
                <td>${u.boletasCompradas || 0}</td>
                <td>${calcularRangoFidelidad(u.boletasCompradas || 0)}</td>
                <td><span style="padding:4px 8px; border-radius:6px; background:${u.rol === 'admin' ? 'rgba(0,210,255,0.2)' : 'rgba(255,255,255,0.05)'}; color:${u.rol === 'admin' ? '#00D2FF' : '#aaa'};">${u.rol || 'usuario'}</span></td>
                <td>
                    ${u.rol !== 'admin' 
                        ? `<button onclick="promoverAdmin('${u.id || u.email}')" class="btn-neon" style="padding:4px 10px; font-size:12px;">Hacer Admin</button>` 
                        : '<span style="color:#00D2FF;">✔ Admin</span>'}
                </td>
            </tr>
        `).join('');
    }

    window.promoverAdmin = async function(idUsuario) {
        if (!confirm('¿Seguro que deseas otorgar permisos de Administrador a este usuario?')) return;
        try {
            const res = await fetch(`${API_BASE}/usuarios/${idUsuario}/rol`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nuevoRol: 'admin' })
            });
            if (res.ok) {
                cargarUsuariosAdmin();
            }
        } catch (err) {
            console.error("Error al cambiar rol:", err);
        }
    };

    // 8. CARGAR MENSAJES DE CONTACTO
    async function cargarMensajes() {
        try {
            const res = await fetch(`${API_BASE}/contacto`);
            const mensajes = await res.json();
            const contenedor = document.getElementById('contenedor-mensajes');
            if (contenedor) {
                if (mensajes.length === 0) {
                    contenedor.innerHTML = '<p style="color:#64748b;">No hay mensajes recibidos.</p>';
                    return;
                }
                contenedor.innerHTML = mensajes.map(m => `
                    <div style="background:#171d2c; border:1px solid rgba(255,255,255,0.05); padding:16px; border-radius:12px; margin-bottom:12px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                            <strong style="color:#00D2FF;">${m.nombre} (${m.email})</strong>
                            <small style="color:#64748b;">${m.fecha ? new Date(m.fecha).toLocaleDateString() : 'Reciente'}</small>
                        </div>
                        <p style="margin:0; color:#e2e8f0;">${m.mensaje}</p>
                    </div>
                `).join('');
            }
        } catch (err) {
            console.error("Error al cargar mensajes:", err);
        }
    }

    // INICIALIZACIÓN
    cargarEventosAdmin();
    cargarUsuariosAdmin();
    cargarMensajes();
});