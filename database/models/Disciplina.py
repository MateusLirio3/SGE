from sqlalchemy import Column, String
from database.database_conection import classe_base
from .ulid_Generator import TipoULID, gerar_ulid

class Disciplina(classe_base):

    __tablename__ = "disciplinas"

    id         = Column(TipoULID, primary_key=True, default=gerar_ulid)
    nome       = Column(String(256), nullable=False)