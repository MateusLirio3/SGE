from sqlalchemy import Column, String, ForeignKey
from database.database_config import classe_base
from .ulid_Generator import TipoULID, gerar_ulid

class Coordenador(classe_base):

    __tablename__ = "coordenadores"

    id         = Column(TipoULID, ForeignKey("usuarios.id"), default=gerar_ulid)
    matricula       = Column(String(20), nullable=False)
    setor           = Column(String(100), nullable=True)
