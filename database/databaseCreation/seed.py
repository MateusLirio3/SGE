from database.database_conection import motor, sessao_local, classe_base
from database.models.Aluno import Aluno
from database.models.Coordenador import Coordenador
from database.models.Usuario import Usuario


ALUNO = {
    "nome": "Aluno Seed",
    "email": "aluno.seed@sge.local",
    "senha": "Aluno@123",
    "matricula": "2026000000001",
}

COORDENADOR = {
    "nome": "Coordenador Seed",
    "email": "coordenador.seed@sge.local",
    "senha": "Coordenador@123",
    "matricula": "COORD-2026-001",
}

def criar_usuario_se_nao_existir(modelo, dados):
    sessao = sessao_local()
    try:
        usuario = sessao.query(Usuario).filter(
            Usuario.email_hash == Usuario.hash_email(dados["email"])
        ).first()

        if usuario is None:
            usuario = modelo(
                nome=dados["nome"],
                email=dados["email"],
                email_hash=Usuario.hash_email(dados["email"]),
                matricula=dados["matricula"],
            )
            usuario.definir_senha(dados["senha"])
            sessao.add(usuario)
            sessao.commit()
            sessao.refresh(usuario)
        sessao.expunge(usuario)
        return usuario
    finally:
        sessao.close()


def executar_seed():
    classe_base.metadata.create_all(bind=motor)
    aluno = criar_usuario_se_nao_existir(Aluno, ALUNO)
    coordenador = criar_usuario_se_nao_existir(Coordenador, COORDENADOR)
    print(f"Aluno seed: {aluno.email} / matricula {aluno.matricula}")
    print(
        f"Coordenador seed: {coordenador.email} / matricula "
        f"{coordenador.matricula}"
    )


if __name__ == "__main__":
    executar_seed()