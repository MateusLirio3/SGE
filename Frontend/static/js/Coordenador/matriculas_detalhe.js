let matriculaAtual = null;
let todasMatriculas = [
    { id: 1, aluno: 'Ana Silva', turma: '3° A - Eng. Software', matricula: '2024001', data: '25/08/2026', status: 'Ativa' },
    { id: 2, aluno: 'Carlos Santos', turma: '2° B - Ciência Comp.', matricula: '2024002', data: '24/08/2026', status: 'Ativa' },
    { id: 3, aluno: 'Mariana Costa', turma: '1° A - Sist. Informação', matricula: '2024003', data: '23/08/2026', status: 'Pendente' },
    { id: 4, aluno: 'João Pereira', turma: '3° B - Eng. Software', matricula: '2024004', data: '22/08/2026', status: 'Ativa' },
    { id: 5, aluno: 'Fernanda Lima', turma: '2° A - Sist. Informação', matricula: '2024005', data: '21/08/2026', status: 'Cancelada' }
];

document.addEventListener('DOMContentLoaded', function () {
    const id = window.location.pathname.split('/').pop();
    matriculaAtual = todasMatriculas.find(m => m.id === parseInt(id));
    if (!matriculaAtual) {
        document.querySelector('.perfil-topo').innerHTML = '<p style="padding:40px;color:#f44336;">Matrícula não encontrada</p>';
        return;
    }
    preencherDados(matriculaAtual);
});

function preencherDados(m) {
    document.getElementById('aluno').textContent = m.aluno;
    document.getElementById('turma').textContent = m.turma;
    document.getElementById('matricula').textContent = m.matricula;
    document.getElementById('data').textContent = m.data;
    document.getElementById('alunoInfo').textContent = m.aluno;
    document.getElementById('turmaInfo').textContent = m.turma;
    const statusEl = document.getElementById('status');
    statusEl.textContent = m.status;
    statusEl.className = 'status-badge ' + (m.status === 'Ativa' ? 'ativa' : m.status === 'Pendente' ? 'pendente' : m.status === 'Cancelada' ? 'cancelada' : 'concluida');
    document.querySelector('.perfil-titulo h1').textContent = m.aluno;
}

function abrirModalEditar() {
    if (!matriculaAtual) return;
    document.getElementById('editId').value = matriculaAtual.id;
    document.getElementById('editAluno').value = matriculaAtual.aluno;
    document.getElementById('editTurma').value = matriculaAtual.turma;
    document.getElementById('editStatus').value = matriculaAtual.status;
    // Converte data para formato ISO para input date
    const dataParts = matriculaAtual.data.split('/');
    if (dataParts.length === 3) {
        document.getElementById('editData').value = dataParts[2] + '-' + dataParts[1] + '-' + dataParts[0];
    }
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
    const dataInput = document.getElementById('editData').value;
    const dataFormatada = dataInput ? new Date(dataInput).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR');

    const dados = {
        id: id,
        aluno: document.getElementById('editAluno').value,
        turma: document.getElementById('editTurma').value,
        matricula: matriculaAtual.matricula,
        data: dataFormatada,
        status: document.getElementById('editStatus').value
    };
    const index = todasMatriculas.findIndex(m => m.id === id);
    if (index !== -1) todasMatriculas[index] = dados;
    matriculaAtual = dados;
    preencherDados(dados);
    fecharModalEditar();
    showToast('Matrícula atualizada com sucesso!', 'success');
}

function showToast(message, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'info');
    toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;font-size:18px;cursor:pointer;color:#999;">×</button>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}