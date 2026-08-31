let dados = [
    { id: 1, nome: '3° A', curso: 'Engenharia de Software', periodo: 'Matutino', alunos: 42, status: 'Ativa', ano: 2026, vagas: 45 },
    { id: 2, nome: '2° B', curso: 'Ciência da Computação', periodo: 'Vespertino', alunos: 38, status: 'Ativa', ano: 2026, vagas: 40 },
    { id: 3, nome: '1° A', curso: 'Sistemas de Informação', periodo: 'Noturno', alunos: 35, status: 'Ativa', ano: 2026, vagas: 40 },
    { id: 4, nome: '3° B', curso: 'Engenharia de Software', periodo: 'Matutino', alunos: 28, status: 'Concluída', ano: 2025, vagas: 40 },
    { id: 5, nome: '2° A', curso: 'Análise de Sistemas', periodo: 'Vespertino', alunos: 30, status: 'Inativa', ano: 2026, vagas: 35 }
];
let nextId = 6;

function renderizar(lista) {
    const tbody = document.getElementById('tableBody');
    const dadosFiltrados = lista || dados;

    if (dadosFiltrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state"><i class="fas fa-door-open"></i><p>Nenhuma turma encontrada</p><button class="btn-primary" onclick="abrirModal()"><i class="fas fa-plus"></i> Adicionar</button></td></tr>`;
        document.getElementById('totalRegistros').textContent = '0 turmas';
        return;
    }

    tbody.innerHTML = dadosFiltrados.map(item => {
        const statusClass = item.status === 'Ativa' ? 'ativa' : item.status === 'Concluída' ? 'concluida' : 'inativa';
        return `<tr>
            <td>${item.id}</td>
            <td><strong>${item.nome}</strong></td>
            <td>${item.curso}</td>
            <td>${item.periodo}</td>
            <td>${item.alunos}/${item.vagas}</td>
            <td><span class="status-badge ${statusClass}">${item.status}</span></td>
            <td>
                <button class="action-btn view" onclick="visualizar(${item.id})"><i class="fas fa-eye"></i></button>
                <button class="action-btn edit" onclick="editar(${item.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="excluir(${item.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;
    }).join('');

    document.getElementById('totalRegistros').textContent = dadosFiltrados.length + ' turmas';
}

function filtrar() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const curso = document.getElementById('filterCurso').value;
    const periodo = document.getElementById('filterPeriodo').value;
    const filtrados = dados.filter(item => {
        const matchSearch = item.nome.toLowerCase().includes(search) || item.curso.toLowerCase().includes(search);
        const matchCurso = curso === '' || item.curso === curso;
        const matchPeriodo = periodo === '' || item.periodo === periodo;
        return matchSearch && matchCurso && matchPeriodo;
    });
    renderizar(filtrados);
}

function limparFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCurso').value = '';
    document.getElementById('filterPeriodo').value = '';
    renderizar(dados);
}

function visualizar(id) {
    window.location.href = '/Coordenador/Turma/' + id;
}

function abrirModal(item) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modalTitle');
    const btn = document.getElementById('btnSalvar');

    if (item) {
        title.innerHTML = '<i class="fas fa-edit"></i> Editar Turma';
        btn.textContent = 'Atualizar';
        document.getElementById('itemId').value = item.id;
        document.getElementById('nome').value = item.nome;
        document.getElementById('curso').value = item.curso;
        document.getElementById('periodo').value = item.periodo;
        document.getElementById('status').value = item.status;
        document.getElementById('ano').value = item.ano;
        document.getElementById('vagas').value = item.vagas;
    } else {
        title.innerHTML = '<i class="fas fa-door-open"></i> Nova Turma';
        btn.textContent = 'Salvar';
        document.getElementById('form').reset();
        document.getElementById('itemId').value = '';
        document.getElementById('status').value = 'Ativa';
        document.getElementById('ano').value = 2026;
        document.getElementById('vagas').value = 40;
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
    const dadosItem = {
        nome: document.getElementById('nome').value.trim(),
        curso: document.getElementById('curso').value,
        periodo: document.getElementById('periodo').value,
        status: document.getElementById('status').value,
        ano: parseInt(document.getElementById('ano').value),
        vagas: parseInt(document.getElementById('vagas').value),
        alunos: 0
    };

    if (id) {
        const index = dados.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            dados[index] = { ...dados[index], ...dadosItem };
            showToast('Turma atualizada com sucesso!', 'success');
        }
    } else {
        dadosItem.id = nextId++;
        dados.push(dadosItem);
        showToast('Turma cadastrada com sucesso!', 'success');
    }

    fecharModal();
    renderizar(dados);
}

function excluir(id) {
    const item = dados.find(item => item.id === id);
    if (!item) return;
    if (confirm('Tem certeza que deseja excluir a turma "' + item.nome + '"?')) {
        dados = dados.filter(item => item.id !== id);
        renderizar(dados);
        showToast('Turma "' + item.nome + '" excluída', 'error');
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