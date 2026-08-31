let turmaAtual = null;
let todasTurmas = [
    { id: 1, nome: '3° A', curso: 'Engenharia de Software', periodo: 'Matutino', alunos: 42, status: 'Ativa', ano: 2026, vagas: 45 },
    { id: 2, nome: '2° B', curso: 'Ciência da Computação', periodo: 'Vespertino', alunos: 38, status: 'Ativa', ano: 2026, vagas: 40 },
    { id: 3, nome: '1° A', curso: 'Sistemas de Informação', periodo: 'Noturno', alunos: 35, status: 'Ativa', ano: 2026, vagas: 40 },
    { id: 4, nome: '3° B', curso: 'Engenharia de Software', periodo: 'Matutino', alunos: 28, status: 'Concluída', ano: 2025, vagas: 40 },
    { id: 5, nome: '2° A', curso: 'Análise de Sistemas', periodo: 'Vespertino', alunos: 30, status: 'Inativa', ano: 2026, vagas: 35 }
];

document.addEventListener('DOMContentLoaded', function () {
    const id = window.location.pathname.split('/').pop();
    turmaAtual = todasTurmas.find(t => t.id === parseInt(id));
    if (!turmaAtual) {
        document.querySelector('.perfil-topo').innerHTML = '<p style="padding:40px;color:#f44336;">Turma não encontrada</p>';
        return;
    }
    preencherDados(turmaAtual);
});

function preencherDados(t) {
    document.getElementById('nome').textContent = t.nome;
    document.getElementById('curso').textContent = t.curso;
    document.getElementById('periodo').textContent = t.periodo;
    document.getElementById('alunos').textContent = t.alunos + '/' + t.vagas;
    document.getElementById('ano').textContent = t.ano;
    document.getElementById('vagas').textContent = t.vagas;
    const statusEl = document.getElementById('status');
    statusEl.textContent = t.status;
    statusEl.className = 'status-badge ' + (t.status === 'Ativa' ? 'ativa' : t.status === 'Concluída' ? 'concluida' : 'inativa');
    document.querySelector('.perfil-titulo h1').textContent = t.nome;
}

function abrirModalEditar() {
    if (!turmaAtual) return;
    document.getElementById('editId').value = turmaAtual.id;
    document.getElementById('editNome').value = turmaAtual.nome;
    document.getElementById('editCurso').value = turmaAtual.curso;
    document.getElementById('editPeriodo').value = turmaAtual.periodo;
    document.getElementById('editStatus').value = turmaAtual.status;
    document.getElementById('editAno').value = turmaAtual.ano;
    document.getElementById('editVagas').value = turmaAtual.vagas;
    document.getElementById('modalEditar').classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function fecharModalEditar() {
    document.getElementById('modalEditar').classList.remove('ativo');
    document.body.style.overflow = '';
}

function salvarEdicao(event) {
    event.preventDefault();
    const id = parseInt(document.getElementById('editId').value);
    const dados = {
        id: id,
        nome: document.getElementById('editNome').value.trim(),
        curso: document.getElementById('editCurso').value,
        periodo: document.getElementById('editPeriodo').value,
        status: document.getElementById('editStatus').value,
        ano: parseInt(document.getElementById('editAno').value),
        vagas: parseInt(document.getElementById('editVagas').value),
        alunos: turmaAtual.alunos || 0
    };
    const index = todasTurmas.findIndex(t => t.id === id);
    if (index !== -1) todasTurmas[index] = dados;
    turmaAtual = dados;
    preencherDados(dados);
    fecharModalEditar();
    showToast('Turma atualizada com sucesso!', 'success');
}

function showToast(message, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'info');
    toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;font-size:18px;cursor:pointer;color:#999;">×</button>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}