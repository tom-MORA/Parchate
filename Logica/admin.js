document.addEventListener('DOMContentLoaded', () => {
    // 1. PROTEGER RUTA Y CONTROL DE SESIÓN
    if (!localStorage.getItem('adminToken')) {
        window.location.href = 'login.html';
        return;
    }

    const API_BASE = 'http://localhost:3000/api';
    let todosLosEventos = [];
    let todosLosUsuarios = [];
    let eventoAEliminarId = null;

    // 2. TOGGLE PARA AFORO ILIMITADO
    window.toggleAforoInput = function(checkbox) {
        const inputAforo = document.getElementById('p-aforo');
        if (!inputAforo) return;
        if (checkbox.checked) {
            inputAforo.value = '';
            inputAforo.disabled = true;
            inputAforo.style.opacity = '0.3';
        } else {
            inputAforo.disabled = false;
            inputAforo.style.opacity = '1';
        }
    };

    // 3. MANEJO DRAG & DROP PARA SUBIR FOTOS DESDE LA PC
    const dropZone = document.getElementById('drop-zone-foto');
    const fileInput = document.getElementById('p-file-input');
    const valInput = document.getElementById('p-imagen-val');
    const imgPreview = document.getElementById('img-preview');
    const previewContainer = document.getElementById('preview-foto-container');

    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.background = 'rgba(0,210,255,0.15)';
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.style.background = '#171d2c';
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.background = '#171d2c';
            if (e.dataTransfer.files.length > 0) {
                procesarImagen(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                procesarImagen(fileInput.files[0]);
            }
        });
    }

    function procesarImagen(file) {
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            valInput.value = e.target.result;
            imgPreview.src = e.target.result;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    // 4. CAMBIO DE PESTAÑAS DEL SIDEBAR
    window.cambiarPestana = function(idPestana) {
        const secciones = document.querySelectorAll('.contenido-pestana');
        secciones.forEach(sec => sec.classList.remove('active'));

        const botones = document.querySelectorAll('.nav-btn');
        botones.forEach(btn => btn.classList.remove('active'));

        const seccionActiva = document.getElementById(`seccion-${idPestana}`);
        if (seccionActiva) seccionActiva.classList.add('active');

        if (window.event && window.event.currentTarget) {
            window.event.currentTarget.classList.add('active');
        }

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

    // 5. CARGAR MÉTRICAS Y KPIS
    function actualizarMetricas() {
        const totalEvElem = document.getElementById('kpi-total-eventos');
        const totalUsElem = document.getElementById('kpi-total-usuarios');
        const comunaTopElem = document.getElementById('kpi-comuna-top');

        if (totalEvElem) totalEvElem.innerText = todosLosEventos.length;
        if (totalUsElem) totalUsElem.innerText = todosLosUsuarios.length;

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

    // 6. GESTIÓN DE PARCHES (CARGAR Y RENDERIZAR TABLA)
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
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#94a3b8;">No hay parches registrados.</td></tr>';
            return;
        }

        tbody.innerHTML = lista.map(e => {
            const reservados = e.reservados || 0;
            const esIlimitado = e.aforo === 'Sin Límite' || !e.aforo;
            const aforoMax = esIlimitado ? '∞' : e.aforo;
            const estaAgotado = !esIlimitado && reservados >= parseInt(e.aforo, 10);

            return `
                <tr>
                    <td style="font-weight:bold; color:#fff;">${e.titulo}</td>
                    <td><span class="badge-categoria">${e.categoria || 'General'}</span></td>
                    <td><span style="color:#aaa;">${(e.comuna || '').replace(/_/g, ' ')}</span></td>
                    <td>${e.fecha || 'Por definir'}</td>
                    <td style="color:#FF007A; font-weight:bold;">${e.precio || 'Gratis'}</td>
                    <td>
                        <span style="color:${estaAgotado ? '#ef4444' : '#10b981'}; font-weight:bold;">
                            ${reservados} / ${aforoMax} ${estaAgotado ? '🚫 (AGOTADO)' : ''}
                        </span>
                    </td>
                    <td>
                        <button onclick="prepararEdicion('${e.id}')" style="background:none; border:none; color:#00D2FF; cursor:pointer; font-size:16px; margin-right:8px;" title="Editar">✏️</button>
                        <button onclick="solicitarEliminacion('${e.id}')" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:16px;" title="Eliminar">🗑️</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // 7. CONTROL DE MODAL (CREAR / EDITAR PARCHE)
    window.abrirModalCrear = function() {
        const tituloModal = document.getElementById('modal-parche-titulo');
        const form = document.getElementById('form-crear-parche');
        if (tituloModal) tituloModal.innerText = '+ Nuevo Parche Completo';
        if (form) {
            form.reset();
            delete form.dataset.editandoId;
        }

        if (valInput) valInput.value = '';
        if (previewContainer) previewContainer.style.display = 'none';
        
        const chkSinAforo = document.getElementById('p-sin-aforo');
        if (chkSinAforo) {
            chkSinAforo.checked = false;
            toggleAforoInput(chkSinAforo);
        }

        const modal = document.getElementById('modal-parche');
        if (modal) modal.classList.add('active');
    };

    window.cerrarModalParche = function() {
        const modal = document.getElementById('modal-parche');
        if (modal) modal.classList.remove('active');
    };

    window.prepararEdicion = function(id) {
        const evento = todosLosEventos.find(e => String(e.id) === String(id));
        if (!evento) return;

        document.getElementById('p-titulo').value = evento.titulo || '';
        document.getElementById('p-categoria').value = evento.categoria || 'Cultura';
        document.getElementById('p-comuna').value = evento.comuna || 'Laureles_Estadio';
        document.getElementById('p-fecha').value = evento.fecha || '';
        document.getElementById('p-ubicacion').value = evento.ubicacion || '';
        
        if (valInput) valInput.value = evento.imagen || '';
        if (imgPreview && evento.imagen) {
            imgPreview.src = evento.imagen;
            if (previewContainer) previewContainer.style.display = 'block';
        }

        const soloNumeros = (evento.precio || '').replace(/\D/g, '');
        document.getElementById('p-precio').value = soloNumeros;

        const chkSinAforo = document.getElementById('p-sin-aforo');
        const inputAforo = document.getElementById('p-aforo');
        if (evento.aforo === 'Sin Límite' || !evento.aforo) {
            if (chkSinAforo) chkSinAforo.checked = true;
            toggleAforoInput(chkSinAforo);
        } else {
            if (chkSinAforo) chkSinAforo.checked = false;
            toggleAforoInput(chkSinAforo);
            if (inputAforo) inputAforo.value = evento.aforo;
        }

        document.getElementById('p-descripcion').value = evento.descripcion || '';
        document.getElementById('p-requisitos').value = Array.isArray(evento.requisitos) ? evento.requisitos.join(', ') : (evento.requisitos || '');

        const form = document.getElementById('form-crear-parche');
        if (form) form.dataset.editandoId = id;

        const tituloModal = document.getElementById('modal-parche-titulo');
        if (tituloModal) tituloModal.innerText = '✏️ Editar Parche Completo';

        document.getElementById('modal-parche').classList.add('active');
    };

    // 8. GUARDAR / ACTUALIZAR PARCHE
    const formParche = document.getElementById('form-crear-parche');
    if (formParche) {
        formParche.addEventListener('submit', async (e) => {
            e.preventDefault();
            const editandoId = formParche.dataset.editandoId;
            const rawPrecio = document.getElementById('p-precio').value;

            const rawReqs = document.getElementById('p-requisitos').value;
            const listaRequisitos = rawReqs ? rawReqs.split(',').map(r => r.trim()) : [];

            const chkSinAforo = document.getElementById('p-sin-aforo');
            const valorAforo = chkSinAforo && chkSinAforo.checked ? 'Sin Límite' : (parseInt(document.getElementById('p-aforo').value, 10) || 50);

            const fotoFinal = valInput && valInput.value ? valInput.value : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600';

            const datosParche = {
                titulo: document.getElementById('p-titulo').value,
                categoria: document.getElementById('p-categoria').value,
                comuna: document.getElementById('p-comuna').value,
                fecha: document.getElementById('p-fecha').value,
                ubicacion: document.getElementById('p-ubicacion').value,
                imagen: fotoFinal,
                precio: rawPrecio && rawPrecio !== '0' ? `$ ${parseInt(rawPrecio, 10).toLocaleString('es-CO')} COP` : 'Entrada Libre',
                aforo: valorAforo,
                reservados: 0,
                descripcion: document.getElementById('p-descripcion').value || 'Parche cultural y de entretenimiento en Medellín.',
                requisitos: listaRequisitos
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

    // 9. ELIMINACIÓN DE EVENTOS
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

    // 10. GESTIÓN Y RENDERIZADO DE USUARIOS CON FALLBACK
    async function cargarUsuariosAdmin() {
        try {
            const res = await fetch(`${API_BASE}/usuarios`);
            if (res.ok) {
                todosLosUsuarios = await res.json();
            }
        } catch (err) {
            console.error("Error al cargar usuarios:", err);
        }

        // Si la lista del servidor está vacía, mostrar datos base de la app
        if (!todosLosUsuarios || todosLosUsuarios.length === 0) {
            todosLosUsuarios = [
                { id: "1", nombre: "Tomas Parchero", email: "tomas@parchate.co", comuna: "Laureles_Estadio", boletasCompradas: 12, rol: "admin" },
                { id: "2", nombre: "Mateo Vásquez", email: "mateo@gmail.com", comuna: "Aranjuez", boletasCompradas: 5, rol: "usuario" },
                { id: "3", nombre: "Camila Ríos", email: "camila@gmail.com", comuna: "El_Poblado", boletasCompradas: 1, rol: "usuario" }
            ];
        }

        renderizarTablaUsuarios(todosLosUsuarios);
        actualizarMetricas();
    }

    function calcularRangoFidelidadBadge(boletasCompradas = 0) {
        if (boletasCompradas >= 10) return '<span class="badge-rango leyenda">🔥 Leyenda</span>';
        if (boletasCompradas >= 4) return '<span class="badge-rango frecuente">⚡ Frecuente</span>';
        return '<span class="badge-rango novato">🌱 Novato</span>';
    }

    function renderizarTablaUsuarios(lista) {
        const tbody = document.getElementById('tabla-usuarios-body');
        if (!tbody) return;

        tbody.innerHTML = lista.map(u => {
            const esAdmin = u.rol === 'admin';
            const badgeRol = esAdmin 
                ? '<span class="badge-rol-admin">⚡ Admin</span>' 
                : '<span class="badge-rol-user">👤 Parchero</span>';

            return `
                <tr>
                    <td style="font-weight:bold; color:#fff;">${u.nombre || 'Sin Nombre'}</td>
                    <td>${u.email}</td>
                    <td>${(u.comuna || 'No elegida').replace(/_/g, ' ')}</td>
                    <td style="font-weight:bold; color:#00D2FF;">${u.boletasCompradas || 0}</td>
                    <td>${calcularRangoFidelidadBadge(u.boletasCompradas || 0)}</td>
                    <td>${badgeRol}</td>
                    <td>
                        ${!esAdmin 
                            ? `<button onclick="promoverAdmin('${u.id || u.email}')" class="btn-neon" style="padding:4px 10px; font-size:11px;">Hacer Admin</button>` 
                            : '<span style="color:#00D2FF; font-size:12px;">✔ Principal</span>'}
                    </td>
                </tr>
            `;
        }).join('');
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

    // 11. CARGAR Y ELIMINAR MENSAJES DE CONTACTO
    async function cargarMensajes() {
        try {
            const res = await fetch(`${API_BASE}/contacto`);
            const mensajes = await res.json();
            const contenedor = document.getElementById('contenedor-mensajes');
            if (contenedor) {
                if (!mensajes || mensajes.length === 0) {
                    contenedor.innerHTML = '<p style="color:#64748b;">No hay mensajes recibidos en la bandeja.</p>';
                    return;
                }
                contenedor.innerHTML = mensajes.map(m => `
                    <div style="background:#171d2c; border:1px solid rgba(255,255,255,0.08); padding:16px; border-radius:12px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:flex-start;">
                        <div>
                            <div style="display:flex; gap:10px; align-items:center; margin-bottom:6px;">
                                <strong style="color:#00D2FF;">${m.nombre}</strong>
                                <small style="color:#aaa;">(${m.email})</small>
                                <small style="color:#64748b;">• ${m.fecha ? new Date(m.fecha).toLocaleDateString() : 'Reciente'}</small>
                            </div>
                            <p style="margin:0; color:#e2e8f0; font-size:13px; line-height:1.4;">${m.mensaje}</p>
                        </div>
                        <button onclick="eliminarMensajeContacto('${m.id}')" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:16px;" title="Eliminar Mensaje">🗑️</button>
                    </div>
                `).join('');
            }
        } catch (err) {
            console.error("Error al cargar mensajes:", err);
        }
    }

    window.eliminarMensajeContacto = async function(id) {
        if (!confirm('¿Deseas borrar este mensaje de la bandeja?')) return;
        try {
            const res = await fetch(`${API_BASE}/contacto/${id}`, { method: 'DELETE' });
            if (res.ok) {
                cargarMensajes();
            }
        } catch (err) {
            console.error("Error al borrar mensaje:", err);
        }
    };

    // INICIALIZACIÓN AUTOMÁTICA
    cargarEventosAdmin();
    cargarUsuariosAdmin();
    cargarMensajes();
});