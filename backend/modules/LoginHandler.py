from database.databaseCrud.UsuarioCrud import buscar_usuario_por_email
from database.databaseCrud.AlunoCrud import (
    criar_Aluno,
    buscar_Aluno_por_matricula,
)
from database.databaseCrud.CoordenadorCrud import (
    criar_Coordenador, buscar_Coordenador_por_matricula
)
from database.databaseCrud.Erros import ErroNaoEncontrado


def validar_usuario(email, senha):
    """Valida o login usando bcrypt. Retorna o usuário autenticado ou mensagem de erro."""
    try:
        usuario = buscar_usuario_por_email(email)
    except ErroNaoEncontrado:
        return 'Usuario ou senha incorretos!'

    if usuario.verificar_senha(senha):
        return [usuario, "Usuário autenticado com sucesso!"]
    else:
        return 'Usuario ou senha incorretos!'


def criar_Aluno(email, senha, matricula, nome):
    try:
        buscar_usuario_por_email(email)
        return 'Usuário já existe!'
    except ErroNaoEncontrado:
        pass

    try:
        buscar_Aluno_por_matricula(matricula)
        return 'Matrícula já cadastrada!'
    except ErroNaoEncontrado:
        pass

    return criar_Aluno(email, senha, matricula, nome)

def criar_Coordenador(email, senha, nome, matricula):

    try:
        buscar_usuario_por_email(email)
        return 'Usuário já existe!'
    except ErroNaoEncontrado:
        pass

    try:
        buscar_Coordenador_por_matricula(matricula)
        return 'Matrícula já cadastrada!'
    except ErroNaoEncontrado:
        pass

    return criar_Coordenador(email, senha, nome, matricula)