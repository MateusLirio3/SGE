from sqlalchemy import Column, String
from database.database_config import classe_base
from .ulid_Generator import TipoULID, gerar_ulid

class Turma(classe_base):

    __tablename__ = "turmas"

    id         = Column(TipoULID, primary_key=True, default=gerar_ulid)
    nome       = Column(String(256), nullable=False)
    periodo      = Column(String(256), nullable=False)
    descricao = Column(String(256), nullable=False)