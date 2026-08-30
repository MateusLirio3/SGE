function abrirSidebar() {
    document.getElementById('sidebar').classList.add('aberta');
    document.querySelector('.sidebar-overlay').classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function fecharSidebar() {
    document.getElementById('sidebar').classList.remove('aberta');
    document.querySelector('.sidebar-overlay').classList.remove('ativo');
    document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard carregado');
});