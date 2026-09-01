from database.database_conection import sessao_local
from database.models.Disciplina import Disciplina
from sqlalchemy.orm import make_transient
from .Erros import ErroExcluir, ErroNaoEncontrado, ErroRegistrar, ErroAtualizar

def criar_Disciplina(nome):
    
    sessao = sessao_local()
    try:
        novo = Disciplina(
            nome= nome
        )
        sessao.add(novo)
        sessao.commit()
        sessao.refresh(novo)
        sessao.expunge(novo)
        return novo
    except Exception as erro:
        sessao.rollback()
        raise ErroRegistrar(f"Erro ao registrar Disciplina (id={Disciplina.id})") from erro
    finally:
        sessao.close()

def buscar_todos_Disciplinas():
    sessao = sessao_local()
    try:
        resultados = sessao.query(Disciplina).all()
        for r in resultados:
            sessao.expunge(r)
        return resultados
    finally:
        sessao.close()

def contar_Disciplinas():
    sessao = sessao_local()
    try:
        resultado = sessao.query(Disciplina).count()
        return resultado
    finally:
        sessao.close()


def buscar_Disciplina_por_nome(nome):
    sessao = sessao_local()
    try:
        resultado = sessao.query(Disciplina).filter(Disciplina.nome == nome).first()
        if resultado is None:
            raise ErroNaoEncontrado(f"Disciplina nao encontrado (nome={nome})")

        sessao.refresh(resultado)
        resultado.id
        resultado.nome

        sessao.expunge(resultado)
        make_transient(resultado)
        return resultado
    except ErroNaoEncontrado:
        raise
    finally:
        sessao.close()

def atualizar_Disciplina(id_Disciplina, nova_Disciplina):
    sessao = sessao_local()
    try:
        Disciplina = sessao.query(Disciplina).filter(Disciplina.id == id_Disciplina).first()
        if Disciplina is None:
            raise ErroNaoEncontrado(f"Disciplina nao encontrado (id={id_Disciplina})")
        if nova_Disciplina is not None:
            Disciplina.valor = nova_Disciplina
        
        sessao.commit()
        sessao.refresh(Disciplina)
        sessao.expunge(Disciplina)
        return Disciplina
    except ErroNaoEncontrado:
        raise
    except Exception as erro:
        sessao.rollback()
        raise ErroAtualizar(f"Erro ao atualizar Disciplina (id={id_Disciplina})") from erro
    finally:
        sessao.close()

def deletar_Disciplina(id_Disciplina):
    sessao = sessao_local()
    try:
        Disciplina = sessao.query(Disciplina).filter(Disciplina.id == id_Disciplina).first()
        if Disciplina is None:
            raise ErroNaoEncontrado(f"Disciplina nao encontrado (id={id_Disciplina})")
        sessao.delete(Disciplina)
        sessao.commit()
        return True
    except ErroNaoEncontrado:
        raise
    except Exception as erro:
        sessao.rollback()
        raise ErroExcluir(f"Erro ao excluir Disciplina (id={id_Disciplina})") from erro
    finally:
        sessao.close()