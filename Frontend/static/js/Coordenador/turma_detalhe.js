let turmas = [];
let turmaAtual = null;
let nextId = 1;

async function carregarTurmas() {
    try {
        const resposta = await fetch('/API/GetTurmas', {
            credentials: 'same-origin'
        });

        if (!resposta.ok) {
            throw new Error('Resposta inválida da API');
        }

        const dados = await resposta.json();
        turmas = Array.isArray(dados) ? dados : [];
        return turmas;
    } catch (erro) {
        console.error('Falha ao carregar turmas!', erro);
        turmas = [];
        return [];
    }
}

async function carregarTurma() {
    const path = window.location.pathname;
    const idTurma = path.split('/').filter(Boolean).pop();

    const lista = await carregarTurmas();
    const turma = lista.find(t => String(t.id) === String(idTurma));

    if (!turma) {
        const topo = document.querySelector('.perfil-topo');
        if (topo) {
            topo.innerHTML = '<p style="padding:40px;color:#f44336;">Turma não encontrada</p>';
        }
        return;
    }

    turmaAtual = turma;
    preencherDados(turmaAtual);
}

function preencherDados(t) {
    document.getElementById('nome').textContent = t.nome;
    document.getElementById('curso').textContent = t.descricao;
    document.getElementById('periodo').textContent = t.periodo;
    document.getElementById('alunos').textContent = t.alunos;
    document.getElementById('ano').textContent = t.ano;
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
    document.getElementById('modalEditar').classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function fecharModalEditar() {
    document.getElementById('modalEditar').classList.remove('ativo');
    document.body.style.overflow = '';
}

function salvarEdicao(event) {
    event.preventDefault();
    const id = document.getElementById('editId').value;
    const dados = {
        id: id,
        nome: document.getElementById('editNome').value.trim(),
        curso: document.getElementById('editCurso').value,
        periodo: document.getElementById('editPeriodo').value,
        status: document.getElementById('editStatus').value,
        ano: parseInt(document.getElementById('editAno').value),
        vagas: parseInt(document.getElementById('editVagas').value),
        alunos: turmaAtual ? turmaAtual.alunos || 0 : 0
    };

    const index = turmas.findIndex(t => String(t.id) === String(id));
    if (index !== -1) {
        turmas[index] = dados;
    }

    turmaAtual = dados;
    preencherDados(dados);
    fecharModalEditar();
    showToast('Turma atualizada com sucesso!', 'success');
}

function showToast(message, type) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'info');
    toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;font-size:18px;cursor:pointer;color:#999;">×</button>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

document.addEventListener('DOMContentLoaded', function () {
    carregarTurma();
});