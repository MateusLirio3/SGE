from sqlalchemy import Column, String, ForeignKey
from database.database_config import classe_base
from .ulid_Generator import TipoULID, gerar_ulid

class Aluno(classe_base):

    __tablename__ = "alunos"

    id         = Column(TipoULID, ForeignKey("usuarios.id"), default=gerar_ulid)
    matricula       = Column(String(13), nullable=False)
