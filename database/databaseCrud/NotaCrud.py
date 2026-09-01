from database.database_conection import sessao_local
from database.models.Nota import Nota
from sqlalchemy.orm import make_transient
from .Erros import ErroExcluir, ErroNaoEncontrado, ErroRegistrar, ErroAtualizar

def criar_Nota(id_disciplinaTurma, id_aluno, instrumentoAvaliativo, valor):
    
    sessao = sessao_local()
    try:
        novo = Nota(
            id_disciplinaTurma=id_disciplinaTurma,
            id_aluno = id_aluno,
            instrumento_Avaliativo=instrumentoAvaliativo,
            valor=valor,
        )
        sessao.add(novo)
        sessao.commit()
        sessao.refresh(novo)
        sessao.expunge(novo)
        return novo
    except Exception as erro:
        sessao.rollback()
        raise ErroRegistrar(f"Erro ao registrar Nota (id={Nota.id})") from erro
    finally:
        sessao.close()

def buscar_todos_Notas():
    sessao = sessao_local()
    try:
        resultados = sessao.query(Nota).all()
        for r in resultados:
            sessao.expunge(r)
        return resultados
    finally:
        sessao.close()

def contar_Notas():
    sessao = sessao_local()
    try:
        resultado = sessao.query(Nota).count()
        return resultado
    finally:
        sessao.close()


def buscar_nota_por_id(id_nota):

    sessao = sessao_local()

    try:
        resultado = (
            sessao.query(Nota)
            .filter(Nota.id == id_nota)
            .first()
        )

        if resultado is None:
            raise ErroNaoEncontrado(
                f"Nota não encontrada (id={id_nota})"
            )

        return {
            "id": resultado.id,
            "instrumento_Avaliativo": resultado.instrumento_Avaliativo,
            "valor": resultado.valor,
            "disciplina": resultado.Disciplinaturma.disciplina.nome
        }

    except ErroNaoEncontrado:
        raise

    finally:
        sessao.close()

def atualizar_Nota(id_nota, nova_nota):
    sessao = sessao_local()
    try:
        Nota = sessao.query(Nota).filter(Nota.id == id_nota).first()
        if Nota is None:
            raise ErroNaoEncontrado(f"Nota nao encontrado (id={id_nota})")
        if nova_nota is not None:
            Nota.valor = nova_nota
        
        sessao.commit()
        sessao.refresh(Nota)
        sessao.expunge(Nota)
        return Nota
    except ErroNaoEncontrado:
        raise
    except Exception as erro:
        sessao.rollback()
        raise ErroAtualizar(f"Erro ao atualizar Nota (id={id_nota})") from erro
    finally:
        sessao.close()

def deletar_Nota(id_nota):
    sessao = sessao_local()
    try:
        Nota = sessao.query(Nota).filter(Nota.id == id_nota).first()
        if Nota is None:
            raise ErroNaoEncontrado(f"Nota nao encontrado (id={id_nota})")
        sessao.delete(Nota)
        sessao.commit()
        return True
    except ErroNaoEncontrado:
        raise
    except Exception as erro:
        sessao.rollback()
        raise ErroExcluir(f"Erro ao excluir Nota (id={id_nota})") from erro
    finally:
        sessao.close()