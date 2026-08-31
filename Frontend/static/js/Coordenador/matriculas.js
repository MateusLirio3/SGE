let dados = [
    { id: 1, aluno: 'Ana Silva', turma: '3° A - Eng. Software', matricula: '2024001', data: '25/08/2026', status: 'Ativa' },
    { id: 2, aluno: 'Carlos Santos', turma: '2° B - Ciência Comp.', matricula: '2024002', data: '24/08/2026', status: 'Ativa' },
    { id: 3, aluno: 'Mariana Costa', turma: '1° A - Sist. Informação', matricula: '2024003', data: '23/08/2026', status: 'Pendente' },
    { id: 4, aluno: 'João Pereira', turma: '3° B - Eng. Software', matricula: '2024004', data: '22/08/2026', status: 'Ativa' },
    { id: 5, aluno: 'Fernanda Lima', turma: '2° A - Sist. Informação', matricula: '2024005', data: '21/08/2026', status: 'Cancelada' }
];
let nextId = 6;

function renderizar(lista) {
    const tbody = document.getElementById('tableBody');
    const dadosFiltrados = lista || dados;

    if (dadosFiltrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state"><i class="fas fa-file-signature"></i><p>Nenhuma matrícula encontrada</p><button class="btn-primary" onclick="abrirModal()"><i class="fas fa-plus"></i> Adicionar</button></td></tr>`;
        document.getElementById('totalRegistros').textContent = '0 matrículas';
        return;
    }

    tbody.innerHTML = dadosFiltrados.map(item => {
        const statusClass = item.status === 'Ativa' ? 'ativa' : item.status === 'Pendente' ? 'pendente' : item.status === 'Cancelada' ? 'cancelada' : 'concluida';
        return `<tr>
            <td>${item.id}</td>
            <td><strong>${item.aluno}</strong></td>
            <td>${item.turma}</td>
            <td>${item.matricula}</td>
            <td>${item.data}</td>
            <td><span class="status-badge ${statusClass}">${item.status}</span></td>
            <td>
                <button class="action-btn view" onclick="visualizar(${item.id})"><i class="fas fa-eye"></i></button>
                <button class="action-btn edit" onclick="editar(${item.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="excluir(${item.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;
    }).join('');

    document.getElementById('totalRegistros').textContent = dadosFiltrados.length + ' matrículas';
}

function filtrar() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const status = document.getElementById('filterStatus').value;
    const filtrados = dados.filter(item => {
        const matchSearch = item.aluno.toLowerCase().includes(search) ||
            item.turma.toLowerCase().includes(search) ||
            item.matricula.includes(search);
        const matchStatus = status === '' || item.status === status;
        return matchSearch && matchStatus;
    });
    renderizar(filtrados);
}

function limparFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterStatus').value = '';
    renderizar(dados);
}

function visualizar(id) {
    window.location.href = '/Coordenador/Matricula/' + id;
}

function abrirModal(item) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modalTitle');
    const btn = document.getElementById('btnSalvar');

    if (item) {
        title.innerHTML = '<i class="fas fa-edit"></i> Editar Matrícula';
        btn.textContent = 'Atualizar';
        document.getElementById('itemId').value = item.id;
        document.getElementById('aluno').value = item.aluno;
        document.getElementById('turma').value = item.turma;
        document.getElementById('data').value = item.data;
        document.getElementById('status').value = item.status;
    } else {
        title.innerHTML = '<i class="fas fa-file-signature"></i> Nova Matrícula';
        btn.textContent = 'Salvar';
        document.getElementById('form').reset();
        document.getElementById('itemId').value = '';
        document.getElementById('status').value = 'Ativa';
        document.getElementById('data').value = new Date().toISOString().split('T')[0];
    }

    modal.classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function fecharModal() {
    document.getElementById('modal').classList.remove('ativo');
    document.body.style.overflow = '';
}

function editar(id) {
    const item = dados.find(item => item.id === id);
    if (item) abrirModal(item);
}

function salvar(event) {
    event.preventDefault();
    const id = document.getElementById('itemId').value;
    const dataInput = document.getElementById('data').value;
    const dataFormatada = dataInput ? new Date(dataInput).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR');

    const dadosItem = {
        aluno: document.getElementById('aluno').value,
        turma: document.getElementById('turma').value,
        matricula: 'M' + String(nextId).padStart(4, '0'),
        data: dataFormatada,
        status: document.getElementById('status').value
    };

    if (id) {
        const index = dados.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            dados[index] = { ...dados[index], ...dadosItem };
            showToast('Matrícula atualizada com sucesso!', 'success');
        }
    } else {
        dadosItem.id = nextId++;
        dados.push(dadosItem);
        showToast('Matrícula cadastrada com sucesso!', 'success');
    }

    fecharModal();
    renderizar(dados);
}

function excluir(id) {
    const item = dados.find(item => item.id === id);
    if (!item) return;
    if (confirm('Tem certeza que deseja excluir a matrícula de "' + item.aluno + '"?')) {
        dados = dados.filter(item => item.id !== id);
        renderizar(dados);
        showToast('Matrícula de "' + item.aluno + '" excluída', 'error');
    }
}

function showToast(message, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'info');
    toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;font-size:18px;cursor:pointer;color:#999;">×</button>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

document.addEventListener('DOMContentLoaded', function () {
    renderizar(dados);
});