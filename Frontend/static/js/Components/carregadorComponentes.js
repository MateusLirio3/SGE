function carregarComponentes(tipoUsuario, nomeUsuario) {
    fetch('/permissoes/permissoes')
        .then(function (res) {
            if (!res.ok) throw new Error('Erro ao carregar permissões: ' + res.status);
            return res.json();
        })
        .then(function (permissoes) {
            window.permissoes = permissoes;
            carregarSidebar(tipoUsuario, nomeUsuario);
        })
        .catch(function (err) {
            console.error('Erro ao carregar permissões:', err);
            window.permissoes = {};
            carregarSidebar(tipoUsuario, nomeUsuario);
        });
}

function carregarSidebar(tipoUsuario, nomeUsuario) {
    fetch('/static/components/sidebar.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Erro ao carregar sidebar: ' + res.status);
            return res.text();
        })
        .then(function (html) {
            document.body.insertAdjacentHTML('afterbegin', html);
            carregarNavbar(tipoUsuario, nomeUsuario);
        })
        .catch(function (err) {
            console.error('Erro ao carregar sidebar:', err);
            carregarNavbar(tipoUsuario, nomeUsuario);
        });
}

function carregarNavbar(tipoUsuario, nomeUsuario) {
    fetch('/static/components/navbar.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Erro ao carregar navbar: ' + res.status);
            return res.text();
        })
        .then(function (html) {
            var navbarContainer = document.getElementById('navbar-container');
            if (navbarContainer) {
                navbarContainer.innerHTML = html;
                aplicarPermissoes(tipoUsuario);
                atualizarUsuario(nomeUsuario, tipoUsuario);
                marcarPaginaAtiva();
            }
        })
        .catch(function (err) {
            console.error('Erro ao carregar navbar:', err);
        });
}

function aplicarPermissoes(tipoUsuario) {
    var permissoes = window.permissoes || {};
    var todosLinks = document.querySelectorAll('.sidebar-menu li, .nav-link');

    for (var i = 0; i < todosLinks.length; i++) {
        var link = todosLinks[i];
        var page = link.dataset.page;

        if (!page) {
            link.style.display = '';
            continue;
        }

        if (permissoes[page] === false) {
            link.style.display = 'none';
        } else {
            link.style.display = '';
        }
    }
}

function atualizarUsuario(nome, tipo) {
    var nameEl = document.getElementById('userName');
    var roleEl = document.getElementById('userRole');

    if (nameEl) {
        nameEl.textContent = 'Olá, ' + (nome || 'Usuário');
    }

    if (roleEl) {
        var roles = {
            'Coordenador': 'Administrador',
            'Aluno': 'Aluno',
            'Professor': 'Professor'
        };
        roleEl.textContent = roles[tipo] || tipo;
    }
}

function marcarPaginaAtiva() {
    var path = window.location.pathname;
    var pagina = path.split('/').pop().toLowerCase().replace('.html', '');

    var mapaPaginas = {
        'pagina-inicial': 'dashboard',
        'dashboard': 'dashboard',
        'alunos': 'alunos',
        'professores': 'professores',
        'turmas': 'turmas',
        'matriculas': 'matriculas',
        'minhas-matriculas': 'minhas_matriculas',
        'configuracoes': 'configuracoes',
        'calendario': 'calendario'
    };

    var paginaId = mapaPaginas[pagina] || pagina;

    var sidebarItems = document.querySelectorAll('.sidebar-menu li');
    for (var i = 0; i < sidebarItems.length; i++) {
        sidebarItems[i].classList.remove('active');
        if (sidebarItems[i].dataset.page === paginaId) {
            sidebarItems[i].classList.add('active');
        }
    }

    var navLinks = document.querySelectorAll('.nav-link');
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove('active');
        if (navLinks[i].dataset.page === paginaId) {
            navLinks[i].classList.add('active');
        }
    }
}

function getTipoUsuario() {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.startsWith('tipo_usuario=')) {
            return cookie.substring('tipo_usuario='.length, cookie.length);
        }
    }
    return '';
}

function getNomeUsuario() {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.startsWith('nome_usuario=')) {
            return decodeURIComponent(cookie.substring('nome_usuario='.length, cookie.length));
        }
    }
    return '';
}

document.addEventListener('DOMContentLoaded', function () {
    var tipoUsuario = getTipoUsuario();
    var nomeUsuario = getNomeUsuario();
    carregarComponentes(tipoUsuario, nomeUsuario);
});

function abrirSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.add('aberta');
    if (overlay) overlay.classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        fetch('/logout', {
            method: 'POST',
            credentials: 'same-origin'
        })
            .then(function () {
                window.location.href = '/';
            })
            .catch(function () {
                window.location.href = '/';
            });
    }
}

function fecharSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.remove('aberta');
    if (overlay) overlay.classList.remove('ativo');
    document.body.style.overflow = '';
}