from database.database_conection import motor, classe_base
from database.models.Usuario import Usuario
from database.models.Turma import Turma
from database.models.Coordenador import Coordenador
from database.models.Aluno import Aluno

def criar_tabelas():
    classe_base.metadata.create_all(bind=motor)


if __name__ == "__main__":
    criar_tabelas()