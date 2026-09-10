document.addEventListener('DOMContentLoaded', () => {
    const btnAuth = document.getElementById('btn-nav-auth');
    const esAdmin = localStorage.getItem('adminToken') === 'true';

    if (btnAuth) {
        if (esAdmin) {
            // Si ya hay sesión iniciada, redirige al panel admin
            btnAuth.textContent = 'Panel Admin';
            btnAuth.href = 'admin.html';
        } else {
            // Si no hay sesión, lleva al login
            btnAuth.textContent = 'Iniciar Sesión';
            btnAuth.href = 'login.html';
        }
    }
});