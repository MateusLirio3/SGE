var todosAlunos = [
    { id: 1, nome: 'Ana Silva', matricula: '2024001', cpf: '123.456.789-00', curso: 'Engenharia de Software', turma: '3° A', status: 'Ativo', email: 'ana@email.com', telefone: '(11) 99999-9999', endereco: 'Rua das Flores, 123', data_nascimento: '2000-05-15' },
    { id: 2, nome: 'Carlos Santos', matricula: '2024002', cpf: '987.654.321-00', curso: 'Ciência da Computação', turma: '2° B', status: 'Ativo', email: 'carlos@email.com', telefone: '(11) 98888-8888', endereco: 'Av. Principal, 456', data_nascimento: '2001-08-20' },
    { id: 3, nome: 'Mariana Costa', matricula: '2024003', cpf: '456.789.123-00', curso: 'Sistemas de Informação', turma: '1° A', status: 'Pendente', email: 'mariana@email.com', telefone: '(11) 97777-7777', endereco: 'Rua das Palmeiras, 789', data_nascimento: '2000-11-10' },
    { id: 4, nome: 'João Pereira', matricula: '2024004', cpf: '789.123.456-00', curso: 'Engenharia de Software', turma: '3° B', status: 'Ativo', email: 'joao@email.com', telefone: '(11) 96666-6666', endereco: 'Av. Brasil, 1010', data_nascimento: '1999-03-25' },
    { id: 5, nome: 'Fernanda Lima', matricula: '2024005', cpf: '321.654.987-00', curso: 'Ciência da Computação', turma: '2° A', status: 'Inativo', email: 'fernanda@email.com', telefone: '(11) 95555-5555', endereco: 'Rua dos Pinheiros, 202', data_nascimento: '2001-07-30' }
];

var alunoAtual = null;

function carregarAluno() {
    var path = window.location.pathname;
    var partes = path.split('/');
    var id = parseInt(partes[partes.length - 1]);

    for (var i = 0; i < todosAlunos.length; i++) {
        if (todosAlunos[i].id === id) {
            alunoAtual = todosAlunos[i];
            break;
        }
    }

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

    for (var i = 0; i < todosAlunos.length; i++) {
        if (todosAlunos[i].id === id) {
            todosAlunos[i] = dados;
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