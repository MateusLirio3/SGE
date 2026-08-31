let professorAtual = null;
let todosProfessores = [
    { id: 1, nome: 'Carlos Oliveira', matricula: 'P2024001', cpf: '111.222.333-44', disciplina: 'Matemática', status: 'Ativo', email: 'carlos@email.com', telefone: '(11) 99999-9999' },
    { id: 2, nome: 'Mariana Souza', matricula: 'P2024002', cpf: '222.333.444-55', disciplina: 'Português', status: 'Ativo', email: 'mariana@email.com', telefone: '(11) 98888-8888' },
    { id: 3, nome: 'Roberto Lima', matricula: 'P2024003', cpf: '333.444.555-66', disciplina: 'Física', status: 'Afastado', email: 'roberto@email.com', telefone: '(11) 97777-7777' },
    { id: 4, nome: 'Patrícia Santos', matricula: 'P2024004', cpf: '444.555.666-77', disciplina: 'Química', status: 'Inativo', email: 'patricia@email.com', telefone: '(11) 96666-6666' },
    { id: 5, nome: 'Fernanda Costa', matricula: 'P2024005', cpf: '555.666.777-88', disciplina: 'Biologia', status: 'Ativo', email: 'fernanda@email.com', telefone: '(11) 95555-5555' }
];

document.addEventListener('DOMContentLoaded', function () {
    const id = window.location.pathname.split('/').pop();
    professorAtual = todosProfessores.find(p => p.id === parseInt(id));
    if (!professorAtual) {
        document.querySelector('.perfil-topo').innerHTML = '<p style="padding:40px;color:#f44336;">Professor não encontrado</p>';
        return;
    }
    preencherDados(professorAtual);
});

function preencherDados(p) {
    document.getElementById('nome').textContent = p.nome;
    document.getElementById('matricula').textContent = p.matricula;
    document.getElementById('disciplina').textContent = p.disciplina;
    document.getElementById('cpf').textContent = p.cpf;
    document.getElementById('email').textContent = p.email || 'Não informado';
    document.getElementById('telefone').textContent = p.telefone || 'Não informado';
    const statusEl = document.getElementById('status');
    statusEl.textContent = p.status;
    statusEl.className = 'status-badge ' + (p.status === 'Ativo' ? 'ativo' : p.status === 'Afastado' ? 'afastado' : 'inativo');
    document.querySelector('.perfil-titulo h1').textContent = p.nome;
}

function abrirModalEditar() {
    if (!professorAtual) return;
    document.getElementById('editId').value = professorAtual.id;
    document.getElementById('editNome').value = professorAtual.nome;
    document.getElementById('editMatricula').value = professorAtual.matricula;
    document.getElementById('editCpf').value = professorAtual.cpf;
    document.getElementById('editDisciplina').value = professorAtual.disciplina;
    document.getElementById('editStatus').value = professorAtual.status;
    document.getElementById('editEmail').value = professorAtual.email || '';
    document.getElementById('editTelefone').value = professorAtual.telefone || '';
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
        matricula: document.getElementById('editMatricula').value.trim(),
        cpf: document.getElementById('editCpf').value.trim(),
        disciplina: document.getElementById('editDisciplina').value.trim(),
        status: document.getElementById('editStatus').value,
        email: document.getElementById('editEmail').value.trim(),
        telefone: document.getElementById('editTelefone').value.trim()
    };
    const index = todosProfessores.findIndex(p => p.id === id);
    if (index !== -1) todosProfessores[index] = dados;
    professorAtual = dados;
    preencherDados(dados);
    fecharModalEditar();
    showToast('Professor atualizado com sucesso!', 'success');
}

function showToast(message, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'info');
    toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;font-size:18px;cursor:pointer;color:#999;">×</button>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}