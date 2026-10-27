document.addEventListener('DOMContentLoaded', () => {
    actualizarNavegacionSesion();
    cargarEventosDestacados();
});

// 1. Seensa Seensaa (Authentication Nav) Fooyyessuu
function actualizarNavegacionSesion() {
    const btnAuth = document.getElementById('btn-nav-auth');
    if (!btnAuth) return;

    const esAdmin = localStorage.getItem('adminToken') === 'true';
    const usuarioSesion = JSON.parse(localStorage.getItem('usuarioSesion') || 'null');

    if (esAdmin) {
        // Seensi Admin yoo jiraate
        btnAuth.textContent = '⚡ Panel Admin';
        btnAuth.href = 'admin.html';
        btnAuth.className = 'btn-nav-admin';
    } else if (usuarioSesion) {
        // Seensi Barataa/Gama User yoo jiraate
        btnAuth.textContent = `👤 ${usuarioSesion.nombre || 'Mi Perfil'}`;
        btnAuth.href = 'perfil.html';
        btnAuth.className = 'btn-nav-user';
    } else {
        // Seensi yoo hin jirre
        btnAuth.textContent = 'Iniciar Sesión';
        btnAuth.href = 'login.html';
        btnAuth.className = 'btn-nav-login';
    }
}

// 2. Taateewwan Dinamikii ta'an Carga gochuu (cargarEventosDestacados)
async function cargarEventosDestacados() {
    const contenedor = document.getElementById('contenedor-eventos-destacados');
    if (!contenedor) return;

    try {
        const res = await fetch('http://localhost:3000/api/eventos');
        const eventos = await res.json();

        if (eventos.length === 0) {
            contenedor.innerHTML = '<p style="color:#aaa; text-align:center; grid-column:1/-1;">No hay eventos destacados publicados en este momento.</p>';
            return;
        }

        contenedor.innerHTML = eventos.map(e => {
            const esIlimitado = e.aforo === 'Sin Límite' || !e.aforo;
            const aforoTexto = esIlimitado ? '∞ Cupos Libres' : `${e.aforo || 50} Cupos`;

            return `
                <div class="tarjeta-evento">
                    <span class="etiqueta">${e.comuna ? e.comuna.replace(/_/g, ' ') : 'Medellín'}</span>
                    <h3>${e.titulo}</h3>
                    <p>📍 Fecha: ${e.fecha || 'Por definir'} — <strong>${e.precio || 'Entrada Libre'}</strong></p>
                    <p style="font-size:12px; color:#aaa; margin-top:-5px;">Aforo: ${aforoTexto}</p>
                    <button class="btn-reserva" onclick="reservarParche('${e.id}', '${e.titulo}')">Reservar Boleta</button>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error("Error al cargar eventos en inicio:", err);
        contenedor.innerHTML = '<p style="color:#ef4444; text-align:center; grid-column:1/-1;">Error al conectar con el servidor.</p>';
    }
}

// 3. Booleetii Qabachuuf (Reserva)
function reservarParche(id, titulo) {
    const usuario = localStorage.getItem('usuarioSesion');
    const esAdmin = localStorage.getItem('adminToken') === 'true';

    if (!usuario && !esAdmin) {
        alert("Para reservar tu boleta primero debes iniciar sesión.");
        window.location.href = "login.html";
        return;
    }
    
    alert(`🎟️ ¡Reserva iniciada para "${titulo}"! Se agregará a tus boletas en tu perfil.`);
}