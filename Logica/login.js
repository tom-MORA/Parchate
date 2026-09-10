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

    let modoRegistro = false;

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
            btnSubmitText.textContent = 'Ingresar';
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

    if (formAuth) {
        formAuth.addEventListener('submit', (e) => {
            e.preventDefault();
            const identificador = document.getElementById('identificador').value.trim();
            const password = document.getElementById('password').value.trim();

            if (modoRegistro) {
                mostrarMensaje('¡Registro exitoso! Tus datos han sido guardados.', 'success');
                setTimeout(() => tabLogin.click(), 1500);
            } else {
                // Validación para ingresar al Panel de Administración
                if ((identificador === 'admin' || identificador === 'admin@parchate.com') && password === '1234') {
                    localStorage.setItem('adminToken', 'true');
                    mostrarMensaje('Acceso concedido. Redirigiendo al panel...', 'success');
                    setTimeout(() => {
                        window.location.href = 'admin.html';
                    }, 800);
                } else {
                    mostrarMensaje('Credenciales incorrectas. Usa usuario: admin y clave: 1234', 'error');
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
        if (statusMsg) {
            statusMsg.style.display = 'none';
        }
    }
});