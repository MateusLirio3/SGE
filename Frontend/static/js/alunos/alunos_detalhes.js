let alunoAtual = null;

document.addEventListener('DOMContentLoaded', function () {
    const alunoId = window.location.pathname.split('/').pop();

    const alunos = [
        { id: 1, nome: 'Ana Silva', matricula: '2024001', cpf: '123.456.789-00', curso: 'Engenharia de Software', turma: '3° A', status: 'Ativo', email: 'ana@email.com', telefone: '(11) 99999-9999', endereco: 'Rua das Flores, 123', data_nascimento: '2000-05-15' },
        { id: 2, nome: 'Carlos Santos', matricula: '2024002', cpf: '987.654.321-00', curso: 'Ciência da Computação', turma: '2° B', status: 'Ativo', email: 'carlos@email.com', telefone: '(11) 98888-8888', endereco: 'Av. Principal, 456', data_nascimento: '2001-08-20' },
        { id: 3, nome: 'Mariana Costa', matricula: '2024003', cpf: '456.789.123-00', curso: 'Sistemas de Informação', turma: '1° A', status: 'Pendente', email: 'mariana@email.com', telefone: '(11) 97777-7777', endereco: 'Rua das Palmeiras, 789', data_nascimento: '2000-11-10' },
        { id: 4, nome: 'João Pereira', matricula: '2024004', cpf: '789.123.456-00', curso: 'Engenharia de Software', turma: '3° B', status: 'Ativo', email: 'joao@email.com', telefone: '(11) 96666-6666', endereco: 'Av. Brasil, 1010', data_nascimento: '1999-03-25' },
        { id: 5, nome: 'Fernanda Lima', matricula: '2024005', cpf: '321.654.987-00', curso: 'Ciência da Computação', turma: '2° A', status: 'Inativo', email: 'fernanda@email.com', telefone: '(11) 95555-5555', endereco: 'Rua dos Pinheiros, 202', data_nascimento: '2001-07-30' }
    ];

    alunoAtual = alunos.find(a => a.id === parseInt(alunoId));

    if (!alunoAtual) {
        document.querySelector('.aluno-card').innerHTML = '<p style="text-align:center;padding:40px;color:#f44336;">Aluno não encontrado</p>';
        return;
    }

    preencherDados(alunoAtual);
});

function preencherDados(aluno) {
    document.getElementById('alunoNome').textContent = aluno.nome;
    document.getElementById('alunoMatricula').textContent = aluno.matricula;
    document.getElementById('alunoCpf').textContent = aluno.cpf;
    document.getElementById('alunoCurso').textContent = aluno.curso;
    document.getElementById('alunoTurma').textContent = aluno.turma || 'Não definida';
    document.getElementById('alunoEmail').textContent = aluno.email || 'Não informado';
    document.getElementById('alunoTelefone').textContent = aluno.telefone || 'Não informado';
    document.getElementById('alunoEndereco').textContent = aluno.endereco || 'Não informado';
    document.getElementById('alunoNascimento').textContent = aluno.data_nascimento || 'Não informado';

    const statusEl = document.getElementById('alunoStatus');
    const statusClass = aluno.status === 'Ativo' ? 'ativo' : aluno.status === 'Pendente' ? 'pendente' : 'inativo';
    statusEl.textContent = aluno.status;
    statusEl.className = 'status-badge ' + statusClass;

    document.querySelector('.page-header h1').innerHTML = '<i class="fas fa-user-graduate"></i> ' + aluno.nome;
}

function abrirModalEditar() {
    if (!alunoAtual) return;

    document.getElementById('editAlunoId').value = alunoAtual.id;
    document.getElementById('editAlunoNome').value = alunoAtual.nome;
    document.getElementById('editAlunoMatricula').value = alunoAtual.matricula;
    document.getElementById('editAlunoCpf').value = alunoAtual.cpf;
    document.getElementById('editAlunoCurso').value = alunoAtual.curso;
    document.getElementById('editAlunoTurma').value = alunoAtual.turma || '';
    document.getElementById('editAlunoStatus').value = alunoAtual.status;
    document.getElementById('editAlunoEmail').value = alunoAtual.email || '';
    document.getElementById('editAlunoTelefone').value = alunoAtual.telefone || '';
    document.getElementById('editAlunoEndereco').value = alunoAtual.endereco || '';
    document.getElementById('editAlunoNascimento').value = alunoAtual.data_nascimento || '';

    document.getElementById('modalEditar').classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function fecharModalEditar() {
    document.getElementById('modalEditar').classList.remove('ativo');
    document.body.style.overflow = '';
}

function salvarEdicao(event) {
    event.preventDefault();

    const id = parseInt(document.getElementById('editAlunoId').value);
    const dados = {
        id: id,
        nome: document.getElementById('editAlunoNome').value.trim(),
        matricula: document.getElementById('editAlunoMatricula').value.trim(),
        cpf: document.getElementById('editAlunoCpf').value.trim(),
        curso: document.getElementById('editAlunoCurso').value,
        turma: document.getElementById('editAlunoTurma').value,
        status: document.getElementById('editAlunoStatus').value,
        email: document.getElementById('editAlunoEmail').value.trim(),
        telefone: document.getElementById('editAlunoTelefone').value.trim(),
        endereco: document.getElementById('editAlunoEndereco').value.trim(),
        data_nascimento: document.getElementById('editAlunoNascimento').value
    };

    // Atualiza o objeto global
    alunoAtual = dados;

    // Aqui depois vai fazer fetch PUT para a API
    console.log('Dados atualizados:', dados);

    // Atualiza a tela
    preencherDados(dados);
    fecharModalEditar();
    showToast('Aluno atualizado com sucesso!', 'success');
}

function showToast(message, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'info');
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;font-size:18px;cursor:pointer;color:#999;">×</button>
    `;
    container.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 4000);
}