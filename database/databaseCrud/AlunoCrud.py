from database.database_conection import sessao_local
from database.models.Aluno import Aluno
from database.models.Usuario import Usuario
from sqlalchemy.orm import make_transient
from .Erros import ErroExcluir, ErroNaoEncontrado, ErroRegistrar, ErroAtualizar

def criar_Aluno(nome, email, senha, matricula):
    
    sessao = sessao_local()
    try:
        novo = Aluno(
            matricula=matricula,
            nome=nome,
            email=email,
            email_hash=Usuario.hash_email(email)
        )
        novo.definir_senha(senha)
        sessao.add(novo)
        sessao.commit()
        sessao.refresh(novo)
        sessao.expunge(novo)
        return novo
    except Exception as erro:
        sessao.rollback()
        raise ErroRegistrar(f"Erro ao registrar Aluno (matricula={matricula})") from erro
    finally:
        sessao.close()

def buscar_todos_Alunos():
    sessao = sessao_local()
    try:
        resultados = sessao.query(Aluno).all()
        for r in resultados:
            sessao.expunge(r)
        return resultados
    finally:
        sessao.close()

def contar_Alunos():
    sessao = sessao_local()
    try:
        resultado = sessao.query(Aluno).count()
        return resultado
    finally:
        sessao.close()


def autenticar_Aluno(matricula, senha):

    sessao = sessao_local()
    try:
        Aluno = sessao.query(Aluno).filter(
            Aluno.matricula == matricula
        ).first()

        if Aluno is None:
            raise ErroNaoEncontrado(f"Aluno nao encontrado (matricula={matricula})")
        if not Aluno.verificar_senha(senha):
            return None

        _ = Aluno.id, Aluno.matricula,

        sessao.expunge(Aluno)
        return Aluno
    except ErroNaoEncontrado:
        raise
    finally:
        sessao.close()

def buscar_Aluno_por_matricula(matricula):
    sessao = sessao_local()
    try:
        resultado = sessao.query(Aluno).filter(Aluno.matricula == matricula).first()
        if resultado is None:
            raise ErroNaoEncontrado(f"Aluno nao encontrado (matricula={matricula})")

        sessao.refresh(resultado)
        resultado.id
        resultado.matricula


        sessao.expunge(resultado)
        make_transient(resultado)
        return resultado
    except ErroNaoEncontrado:
        raise
    finally:
        sessao.close()

def atualizar_Aluno(matricula, nova_matricula):
    sessao = sessao_local()
    try:
        Aluno = sessao.query(Aluno).filter(Aluno.matricula == matricula).first()
        if Aluno is None:
            raise ErroNaoEncontrado(f"Aluno nao encontrado (matricula={matricula})")
        if nova_matricula is not None:
            Aluno.matricula = nova_matricula
        
        sessao.commit()
        sessao.refresh(Aluno)
        sessao.expunge(Aluno)
        return Aluno
    except ErroNaoEncontrado:
        raise
    except Exception as erro:
        sessao.rollback()
        raise ErroAtualizar(f"Erro ao atualizar Aluno (matricula={matricula})") from erro
    finally:
        sessao.close()


def deletar_Aluno(matricula):
    sessao = sessao_local()
    try:
        Aluno = sessao.query(Aluno).filter(Aluno.matricula == matricula).first()
        if Aluno is None:
            raise ErroNaoEncontrado(f"Aluno nao encontrado (matricula={matricula})")
        sessao.delete(Aluno)
        sessao.commit()
        return True
    except ErroNaoEncontrado:
        raise
    except Exception as erro:
        sessao.rollback()
        raise ErroExcluir(f"Erro ao excluir Aluno (matricula={matricula})") from erro
    finally:
        sessao.close()