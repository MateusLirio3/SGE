let turmas = [];
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
        renderizarTurmas(turmas);
        return turmas;
    } catch (erro) {
        console.error('Falha ao carregar turmas!', erro);
        turmas = [];
        renderizarTurmas(turmas);
        return [];
    }
}

function renderizarTurmas(lista) {
    const tbody = document.getElementById('tableBody');
    const dadosFiltrados = Array.isArray(lista) ? lista : turmas;

    if (!tbody) {
        console.error('❌ tableBody não encontrado!');
        return;
    }

    if (!Array.isArray(dadosFiltrados) || dadosFiltrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state"><i class="fas fa-door-open"></i><p>Nenhuma turma encontrada</p><button class="btn-primary" onclick="abrirModal()"><i class="fas fa-plus"></i> Adicionar</button></td></tr>`;
        const totalEl = document.getElementById('totalRegistros');
        if (totalEl) totalEl.textContent = '0 turmas';
        return;
    }

    tbody.innerHTML = dadosFiltrados.map(item => {
        const statusClass = item.status === 'Ativa' ? 'ativa' : item.status === 'Concluída' ? 'concluida' : 'inativa';
        return `<tr>
            <td>${item.id}</td>
            <td><strong>${item.nome}</strong></td>
            <td>${item.descricao}</td>
            <td>${item.periodo}</td>
            <td>${item.alunos}/${item.vagas}</td>
            <td><span class="status-badge ${statusClass}">${item.status}</span></td>
            <td>
                <button class="action-btn view" onclick="visualizar('${item.id}')"><i class="fas fa-eye"></i></button>
                <button class="action-btn edit" onclick="editar('${item.id}')"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="excluir('${item.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;
    }).join('');

    const totalEl = document.getElementById('totalRegistros');
    if (totalEl) totalEl.textContent = dadosFiltrados.length + ' turmas';
}

function filtrar() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const curso = document.getElementById('filterCurso').value;
    const periodo = document.getElementById('filterPeriodo').value;

    const filtrados = turmas.filter(item => {
        const nome = (item.nome || '').toLowerCase();
        const cursoItem = (item.curso || '').toLowerCase();
        const matchSearch = nome.includes(search) || cursoItem.includes(search);
        const matchCurso = curso === '' || item.curso === curso;
        const matchPeriodo = periodo === '' || item.periodo === periodo;
        return matchSearch && matchCurso && matchPeriodo;
    });

    renderizarTurmas(filtrados);
}

function limparFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCurso').value = '';
    document.getElementById('filterPeriodo').value = '';
    renderizarTurmas(turmas);
}

function visualizar(id) {
    var turma = turmas.find(t => String(t.id) === String(id));
    if (!turma) {
        alert('Turma não encontrada!');
        return;
    }
    window.location.href = '/Turma/' + String(turma.id);
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
        document.getElementById('curso').value = item.descricao;
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
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('ativo');
    document.body.style.overflow = '';
}

function editar(id) {
    const item = turmas.find(item => String(item.id) === String(id));
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
        const index = turmas.findIndex(item => String(item.id) === String(id));
        if (index !== -1) {
            turmas[index] = { ...turmas[index], ...dadosItem };
            showToast('Turma atualizada com sucesso!', 'success');
        }
    } else {
        dadosItem.id = String(nextId++);
        turmas.push(dadosItem);
        showToast('Turma cadastrada com sucesso!', 'success');
    }

    fecharModal();
    renderizarTurmas(turmas);
}

function excluir(id) {
    const item = turmas.find(item => String(item.id) === String(id));
    if (!item) return;
    if (confirm('Tem certeza que deseja excluir a turma "' + item.nome + '"?')) {
        turmas = turmas.filter(item => String(item.id) !== String(id));
        renderizarTurmas(turmas);
        showToast('Turma "' + item.nome + '" excluída', 'error');
    }
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
    carregarTurmas();
});