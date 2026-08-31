let alunos = [];
let nextId = 1;

async function carregarAlunos() {
    try {
        const resposta = await fetch('/API/GetAlunos', {
            credentials: 'same-origin'
        });

        if (!resposta.ok) {
            throw new Error('Resposta inválida da API');
        }

        const dados = await resposta.json();
        alunos = Array.isArray(dados) ? dados : [];
        return alunos;
    } catch (erro) {
        console.error('❌ Falha ao carregar alunos!', erro);
        alunos = [];
        return [];
    }
}

var alunoAtual = null;

async function carregarAluno() {
    const path = window.location.pathname;
    const idAluno = path.split('/').filter(Boolean).pop();

    const lista = await carregarAlunos();
    const aluno = lista.find(a => String(a.id) === String(idAluno));

    if (!aluno) {
        const topo = document.querySelector('.perfil-topo');
        if (topo) {
            topo.innerHTML = '<p style="padding:40px;color:#f44336;">Aluno não encontrado</p>';
        }
        return;
    }

    alunoAtual = aluno;

    if (!alunoAtual) {
        document.querySelector('.perfil-topo').innerHTML = '<p style="padding:40px;color:#f44336;">Aluno não encontrado</p>';
        return;
    }

    preencherDados(alunoAtual);
}

function preencherDados(aluno) {
    document.getElementById('nome').textContent = aluno.nome;
    document.getElementById('matricula').textContent = aluno.matricula;
    document.getElementById('cpf').textContent = aluno.cpf;
    document.getElementById('curso').textContent = aluno.curso;
    document.getElementById('turma').textContent = aluno.turma || 'Não definida';
    document.getElementById('email').textContent = aluno.email || 'Não informado';
    document.getElementById('telefone').textContent = aluno.telefone || 'Não informado';
    document.getElementById('endereco').textContent = aluno.endereco || 'Não informado';
    document.getElementById('nascimento').textContent = aluno.data_nascimento || 'Não informado';

    var statusEl = document.getElementById('status');
    var statusClass = aluno.status === 'Ativo' ? 'ativo' : aluno.status === 'Pendente' ? 'pendente' : 'inativo';
    statusEl.textContent = aluno.status;
    statusEl.className = 'status-badge ' + statusClass;
}

function abrirModalEditar() {
    if (!alunoAtual) return;

    document.getElementById('editId').value = alunoAtual.id;
    document.getElementById('editNome').value = alunoAtual.nome;
    document.getElementById('editMatricula').value = alunoAtual.matricula;
    document.getElementById('editCpf').value = alunoAtual.cpf;
    document.getElementById('editCurso').value = alunoAtual.curso;
    document.getElementById('editTurma').value = alunoAtual.turma || '';
    document.getElementById('editStatus').value = alunoAtual.status;
    document.getElementById('editEmail').value = alunoAtual.email || '';
    document.getElementById('editTelefone').value = alunoAtual.telefone || '';

    document.getElementById('modalEditar').classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function fecharModalEditar() {
    document.getElementById('modalEditar').classList.remove('ativo');
    document.body.style.overflow = '';
}

function salvarEdicao(event) {
    event.preventDefault();

    var id = parseInt(document.getElementById('editId').value);
    var dados = {
        id: id,
        nome: document.getElementById('editNome').value.trim(),
        matricula: document.getElementById('editMatricula').value.trim(),
        cpf: document.getElementById('editCpf').value.trim(),
        curso: document.getElementById('editCurso').value,
        turma: document.getElementById('editTurma').value,
        status: document.getElementById('editStatus').value,
        email: document.getElementById('editEmail').value.trim(),
        telefone: document.getElementById('editTelefone').value.trim()
    };

    for (var i = 0; i < alunos.length; i++) {
        if (alunos[i].id === id) {
            alunos[i] = dados;
            break;
        }
    }

    alunoAtual = dados;
    preencherDados(dados);
    fecharModalEditar();
    showToast('Aluno atualizado com sucesso!', 'success');
}

function showToast(message, type) {
    var container = document.getElementById('toast-container');
    if (!container) return;
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'info');
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;font-size:18px;cursor:pointer;color:#999;">×</button>
    `;
    container.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 4000);
}

document.addEventListener('DOMContentLoaded', function () {
    carregarAluno();
});