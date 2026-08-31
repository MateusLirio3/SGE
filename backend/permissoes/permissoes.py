PERMISSOES = {
    "Coordenador": {
        # visualizar paginas (sempre que adicionar uma pagina tem que adicionar aqui)
        "dashboard": True,
        "alunos": True,
        "professores": True,
        "turmas": True,
        "matriculas": True,
        "calendario": True,
        "configuracoes": True,
        "perfil": True,
        "minhas_matriculas": False,
        
        # ações (provavelmente nao precisa mudar)
        "criar": True,
        "editar": True,
        "excluir": True,
        "visualizar": True,
        "listar": True,
        
        # relatórios (sla, acho q tbm nao precisa mudar)
        "gerar_relatorios": True,
        "exportar_dados": True,
    },
    "Aluno": {
        "dashboard": True,
        "alunos": False,
        "professores": False,
        "turmas": False,
        "matriculas": False,
        "calendario": True,
        "configuracoes": False,
        "perfil": True,
        "minhas_matriculas": True,
        "criar": False,
        "editar": False,
        "excluir": False,
        "visualizar": True,
        "listar": False,        
        "gerar_relatorios": False,
        "exportar_dados": False,  
    }, 
}

def tem_permissao(tipo_usuario: str, permissao: str) -> bool:
    if tipo_usuario not in PERMISSOES:
        return False
    return PERMISSOES[tipo_usuario].get(permissao, False)

def paginas_permitidas(tipo_usuario: str) -> list:
    if tipo_usuario not in PERMISSOES:
        return []
    
    paginas = []
    paginas_lista = ["dashboard", "alunos", "professores", "turmas", "matriculas", "calendario", "configuracoes", "perfil", "minhas_matriculas"]
    for chave, valor in PERMISSOES[tipo_usuario].items():
        if valor and chave in paginas_lista:
            paginas.append(chave)
    return paginas

def acoes_permitidas(tipo_usuario: str) -> list:
    if tipo_usuario not in PERMISSOES:
        return []
    
    acoes = []
    acoes_lista = ["criar", "editar", "excluir", "visualizar", "listar", "gerar_relatorios", "exportar_dados"]
    for chave, valor in PERMISSOES[tipo_usuario].items():
        if valor and chave in acoes_lista:
            acoes.append(chave)
    return acoes