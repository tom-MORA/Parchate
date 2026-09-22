document.addEventListener('DOMContentLoaded', () => {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const groupNombre = document.getElementById('group-nombre');
    const groupTelefono = document.getElementById('group-telefono');
    const groupComuna = document.getElementById('group-comuna');
    const groupLegal = document.getElementById('group-legal');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const btnSubmitText = document.getElementById('btn-submit-text');
    const formAuth = document.getElementById('form-auth');
    const statusMsg = document.getElementById('status-msg');

    const API_BASE = 'http://localhost:3000/api/usuarios';
    let modoRegistro = false;

    // Alternar pestañas entre Iniciar Sesión y Registro
    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            modoRegistro = false;
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            if (groupNombre) groupNombre.style.display = 'none';
            if (groupTelefono) groupTelefono.style.display = 'none';
            if (groupComuna) groupComuna.style.display = 'none';
            if (groupLegal) groupLegal.style.display = 'none';
            authTitle.textContent = 'Iniciar Sesión';
            authSubtitle.textContent = 'Ingresa tus datos para gestionar o explorar el parche.';
            btnSubmitText.textContent = 'Continuar';
            ocultarMensaje();
        });

        tabRegister.addEventListener('click', () => {
            modoRegistro = true;
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            if (groupNombre) groupNombre.style.display = 'block';
            if (groupTelefono) groupTelefono.style.display = 'block';
            if (groupComuna) groupComuna.style.display = 'block';
            if (groupLegal) groupLegal.style.display = 'flex';
            authTitle.textContent = 'Crea tu cuenta';
            authSubtitle.textContent = 'Con tu cuenta podrás guardar eventos, reservar boletas y personalizar tu experiencia.';
            btnSubmitText.textContent = 'Crear Cuenta';
            ocultarMensaje();
        });
    }

    // Procesar el envío del formulario
    if (formAuth) {
        formAuth.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Enviando formulario de autenticación...");

            const identificador = document.getElementById('identificador').value.trim();
            const password = document.getElementById('password').value.trim();

            if (modoRegistro) {
                // REGISTRO DE NUEVO USUARIO
                const nuevoUsuario = {
                    nombre: document.getElementById('nombre').value.trim(),
                    usuario: identificador,
                    email: identificador.includes('@') ? identificador : `${identificador}@parchate.com`,
                    password: password,
                    telefono: document.getElementById('telefono').value.trim(),
                    comunaPref: document.getElementById('comuna-pref').value
                };

                try {
                    const res = await fetch(`${API_BASE}/registro`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(nuevoUsuario)
                    });

                    const data = await res.json();

                    if (res.ok) {
                        mostrarMensaje('¡Registro exitoso! Ya puedes iniciar sesión.', 'success');
                        setTimeout(() => tabLogin.click(), 1200);
                    } else {
                        mostrarMensaje(data.error || 'Error al registrar el usuario.', 'error');
                    }
                } catch (err) {
                    console.error("Error al registrar:", err);
                    mostrarMensaje('Error de conexión con el servidor.', 'error');
                }

            } else {
                // INICIO DE SESIÓN DESDE BASE DE DATOS
                try {
                    const res = await fetch(`${API_BASE}/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ identificador, password })
                    });

                    const data = await res.json();
                    console.log("Respuesta del servidor:", data);

                    if (res.ok) {
                        localStorage.setItem('usuarioSesion', JSON.stringify(data.usuario));

                        if (data.usuario.rol === 'admin') {
                            localStorage.setItem('adminToken', 'true');
                            mostrarMensaje(`¡Bienvenido Administrador ${data.usuario.nombre}!`, 'success');
                            setTimeout(() => window.location.href = 'admin.html', 800);
                        } else {
                            mostrarMensaje(`¡Bienvenido ${data.usuario.nombre}!`, 'success');
                            setTimeout(() => window.location.href = 'inicio.html', 800);
                        }
                    } else {
                        mostrarMensaje(data.error || 'Usuario o contraseña incorrectos.', 'error');
                    }
                } catch (err) {
                    console.error("Error al conectar:", err);
                    mostrarMensaje('Error al conectar con el servidor (Asegúrate de ejecutar node server.js).', 'error');
                }
            }
        });
    }

    function mostrarMensaje(texto, tipo) {
        if (statusMsg) {
            statusMsg.textContent = texto;
            statusMsg.className = `status-msg ${tipo}`;
            statusMsg.style.display = 'block';
        }
    }

    function ocultarMensaje() {
        if (statusMsg) statusMsg.style.display = 'none';
    }
});