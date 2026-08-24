from sqlalchemy import Column, String, ForeignKey
from database.database_conection import classe_base
from database.models.Usuario import Usuario
from .ulid_Generator import TipoULID, gerar_ulid

class Aluno(classe_base):

    __tablename__ = "alunos"

    id         = Column(TipoULID, ForeignKey("usuarios.id"), primary_key=True, default=gerar_ulid)
    matricula       = Column(String(13), nullable=False)

    __mapper_args__ = {
        "polymorphic_identity" : "Aluno"
    }
