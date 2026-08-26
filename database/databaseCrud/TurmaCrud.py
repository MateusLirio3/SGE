from database.database_conection import sessao_local
from database.models.Turma import Turma
from .Erros import ErroExcluir, ErroNaoEncontrado, ErroRegistrar, ErroAtualizar
from sqlalchemy.orm import make_transient

def criar_Turma(nome, periodo, descricao):
    
    sessao = sessao_local()
    try:
        novo = Turma(
            nome=nome,
            periodo=periodo,
            descricao=descricao

        )
        sessao.add(novo)
        sessao.commit()
        sessao.refresh(novo)
        sessao.expunge(novo)
        return novo
    except Exception as erro:
        sessao.rollback()
        raise ErroRegistrar(f"Erro ao registrar Turma (nome={nome})") from erro
    finally:
        sessao.close()


def buscar_Turma_por_id(id):
    sessao = sessao_local()
    try:
        resultado = sessao.query(Turma).filter(Turma.id == id).first()
        if resultado is None:
            raise ErroNaoEncontrado(f"Turma nao encontrado (id={id})")
        sessao.expunge(resultado)
        return resultado
    except ErroNaoEncontrado:
        raise
    finally:
        sessao.close()


def buscar_Turma_por_nome(nome):
    sessao = sessao_local()
    try:
        resultado = sessao.query(Turma).filter(Turma.nome == nome).first()
        if resultado is None:
            raise ErroNaoEncontrado(f"Turma nao encontrado (nome={nome})")

        sessao.refresh(resultado)
        resultado.id
        resultado.nome
        resultado.periodo
        resultado.descricao


        sessao.expunge(resultado)
        make_transient(resultado)
        return resultado
    except ErroNaoEncontrado:
        raise
    finally:
        sessao.close()


def buscar_todos_Turmas():
    sessao = sessao_local()
    try:
        resultados = sessao.query(Turma).all()
        for r in resultados:
            sessao.expunge(r)
        return resultados
    finally:
        sessao.close()

def atualizar_Turma(nome, novo_nome=None, novo_periodo=None, nova_descricao=None):
    sessao = sessao_local()
    try:
        Turma = sessao.query(Turma).filter(Turma.nome == nome).first()
        if Turma is None:
            raise ErroNaoEncontrado(f"Turma nao encontrado (nome={nome})")
        if novo_nome is not None:
            Turma.nome = novo_nome
        if novo_periodo is not None:
            Turma.periodo = novo_periodo
        if nova_descricao is not None:
            Turma.descricao = nova_descricao
        sessao.commit()
        sessao.refresh(Turma)
        sessao.expunge(Turma)
        return Turma
    except ErroNaoEncontrado:
        raise
    except Exception as erro:
        sessao.rollback()
        raise ErroAtualizar(f"Erro ao atualizar Turma (nome={nome})") from erro
    finally:
        sessao.close()


def deletar_turma(nome):
    sessao = sessao_local()
    try:
        Turma = sessao.query(Turma).filter(Turma.nome == nome).first()
        if Turma is None:
            raise ErroNaoEncontrado(f"Turma nao encontrado (nome={nome})")
        sessao.delete(Turma)
        sessao.commit()
        return True
    except ErroNaoEncontrado:
        raise
    except Exception as erro:
        sessao.rollback()
        raise ErroExcluir(f"Erro ao excluir Turma (nome={nome})") from erro
    finally:
        sessao.close()