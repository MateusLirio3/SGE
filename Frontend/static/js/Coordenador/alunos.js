var alunos = [
    { id: 1, nome: 'Ana Silva', matricula: '2024001', cpf: '123.456.789-00', curso: 'Engenharia de Software', turma: '3° A', status: 'Ativo', email: 'ana@email.com', telefone: '(11) 99999-9999', endereco: 'Rua das Flores, 123', data_nascimento: '2000-05-15' },
    { id: 2, nome: 'Carlos Santos', matricula: '2024002', cpf: '987.654.321-00', curso: 'Ciência da Computação', turma: '2° B', status: 'Ativo', email: 'carlos@email.com', telefone: '(11) 98888-8888', endereco: 'Av. Principal, 456', data_nascimento: '2001-08-20' },
    { id: 3, nome: 'Mariana Costa', matricula: '2024003', cpf: '456.789.123-00', curso: 'Sistemas de Informação', turma: '1° A', status: 'Pendente', email: 'mariana@email.com', telefone: '(11) 97777-7777', endereco: 'Rua das Palmeiras, 789', data_nascimento: '2000-11-10' },
    { id: 4, nome: 'João Pereira', matricula: '2024004', cpf: '789.123.456-00', curso: 'Engenharia de Software', turma: '3° B', status: 'Ativo', email: 'joao@email.com', telefone: '(11) 96666-6666', endereco: 'Av. Brasil, 1010', data_nascimento: '1999-03-25' },
    { id: 5, nome: 'Fernanda Lima', matricula: '2024005', cpf: '321.654.987-00', curso: 'Ciência da Computação', turma: '2° A', status: 'Inativo', email: 'fernanda@email.com', telefone: '(11) 95555-5555', endereco: 'Rua dos Pinheiros, 202', data_nascimento: '2001-07-30' }
];

var nextId = 6;

function renderizarAlunos(lista) {
    var tbody = document.getElementById('tableBody');
    if (!tbody) {
        console.error('❌ tableBody não encontrado!');
        return;
    }

    var dados = lista || alunos;

    if (dados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-user-slash"></i>
                    <p>Nenhum aluno encontrado</p>
                    <button class="btn-primary" onclick="abrirModal()">
                        <i class="fas fa-plus"></i> Adicionar
                    </button>
                </td>
            </tr>
        `;
        var totalEl = document.getElementById('totalRegistros');
        if (totalEl) totalEl.textContent = '0 alunos';
        return;
    }

    var html = '';
    for (var i = 0; i < dados.length; i++) {
        var a = dados[i];
        var statusClass = a.status === 'Ativo' ? 'ativo' : a.status === 'Pendente' ? 'pendente' : 'inativo';
        html += `
            <tr>
                <td>${a.id}</td>
                <td><strong>${a.nome}</strong></td>
                <td>${a.matricula}</td>
                <td>${a.cpf}</td>
                <td>${a.curso}</td>
                <td>${a.turma || '-'}</td>
                <td><span class="status-badge ${statusClass}">${a.status}</span></td>
                <td>
                    <button class="action-btn view" onclick="visualizarAluno(${a.id})" title="Visualizar"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit" onclick="editarAluno(${a.id})" title="Editar"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="excluirAluno(${a.id})" title="Excluir"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }
    tbody.innerHTML = html;

    var totalEl = document.getElementById('totalRegistros');
    if (totalEl) totalEl.textContent = dados.length + ' alunos';
}

function filtrar() {
    var search = document.getElementById('searchInput').value.toLowerCase();
    var curso = document.getElementById('filterCurso').value;
    var status = document.getElementById('filterStatus').value;

    var filtrados = [];
    for (var i = 0; i < alunos.length; i++) {
        var a = alunos[i];
        var matchSearch = a.nome.toLowerCase().includes(search) || a.matricula.includes(search) || a.cpf.includes(search);
        var matchCurso = curso === '' || a.curso === curso;
        var matchStatus = status === '' || a.status === status;
        if (matchSearch && matchCurso && matchStatus) {
            filtrados.push(a);
        }
    }

    renderizarAlunos(filtrados);
}

function limparFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCurso').value = '';
    document.getElementById('filterStatus').value = '';
    renderizarAlunos(alunos);
}

function visualizarAluno(id) {
    window.location.href = '/Aluno/' + id;
}

function editarAluno(id) {
    var aluno = null;
    for (var i = 0; i < alunos.length; i++) {
        if (alunos[i].id === id) {
            aluno = alunos[i];
            break;
        }
    }
    if (!aluno) return;

    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-user-edit"></i> Editar Aluno';
    document.getElementById('btnSalvar').textContent = 'Atualizar';
    document.getElementById('itemId').value = aluno.id;
    document.getElementById('nome').value = aluno.nome;
    document.getElementById('matricula').value = aluno.matricula;
    document.getElementById('cpf').value = aluno.cpf;
    document.getElementById('curso').value = aluno.curso;
    document.getElementById('turma').value = aluno.turma || '';
    document.getElementById('status').value = aluno.status;
    document.getElementById('email').value = aluno.email || '';
    document.getElementById('telefone').value = aluno.telefone || '';

    document.getElementById('modal').classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function abrirModal() {
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-user-plus"></i> Novo Aluno';
    document.getElementById('btnSalvar').textContent = 'Salvar';
    document.getElementById('form').reset();
    document.getElementById('itemId').value = '';
    document.getElementById('status').value = 'Ativo';

    document.getElementById('modal').classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function fecharModal() {
    document.getElementById('modal').classList.remove('ativo');
    document.body.style.overflow = '';
}

function salvar(event) {
    event.preventDefault();

    var id = document.getElementById('itemId').value;
    var dados = {
        nome: document.getElementById('nome').value.trim(),
        matricula: document.getElementById('matricula').value.trim(),
        cpf: document.getElementById('cpf').value.trim(),
        curso: document.getElementById('curso').value,
        turma: document.getElementById('turma').value,
        status: document.getElementById('status').value,
        email: document.getElementById('email').value.trim(),
        telefone: document.getElementById('telefone').value.trim()
    };

    if (id) {
        var index = -1;
        for (var i = 0; i < alunos.length; i++) {
            if (alunos[i].id === parseInt(id)) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            alunos[index] = { ...alunos[index], ...dados };
            showToast('Aluno atualizado com sucesso!', 'success');
        }
    } else {
        dados.id = nextId++;
        alunos.push(dados);
        showToast('Aluno cadastrado com sucesso!', 'success');
    }

    fecharModal();
    renderizarAlunos(alunos);
}

function excluirAluno(id) {
    var aluno = null;
    for (var i = 0; i < alunos.length; i++) {
        if (alunos[i].id === id) {
            aluno = alunos[i];
            break;
        }
    }
    if (!aluno) return;
    if (confirm('Tem certeza que deseja excluir "' + aluno.nome + '"?')) {
        var novosAlunos = [];
        for (var i = 0; i < alunos.length; i++) {
            if (alunos[i].id !== id) {
                novosAlunos.push(alunos[i]);
            }
        }
        alunos = novosAlunos;
        renderizarAlunos(alunos);
        showToast('Aluno "' + aluno.nome + '" excluído', 'error');
    }
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
    var checkInterval = setInterval(function () {
        var tbody = document.getElementById('tableBody');
        if (tbody) {
            clearInterval(checkInterval);
            renderizarAlunos(alunos);
        }
    }, 50);

    setTimeout(function () {
        clearInterval(checkInterval);
        renderizarAlunos(alunos);
    }, 3000);
});