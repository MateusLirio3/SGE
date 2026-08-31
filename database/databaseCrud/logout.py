from database.database_conection import sessao_local
from database.models.Usuario import Usuario
from .Erros import ErroNaoEncontrado

def registrar_logout(email: str):
    """
    Registra o logout do usuário no banco de dados.
    Pode ser usado para logs de auditoria(se quiser, nao recomendo).
    """
    sessao = sessao_local()
    try:
        h = Usuario.hash_email(email)
        usuario = sessao.query(Usuario).filter(Usuario.email_hash == h).first()
        
        if usuario is None:
            raise ErroNaoEncontrado(f"Usuario nao encontrado (email={email})")
        sessao.commit()
        sessao.expunge(usuario)
        return usuario
    
    except ErroNaoEncontrado:
        raise
    except Exception as erro:
        sessao.rollback()
        raise Exception(f"Erro ao registrar logout: {erro}")
    finally:
        sessao.close()