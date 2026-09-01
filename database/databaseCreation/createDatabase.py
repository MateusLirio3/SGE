from database.database_conection import motor, classe_base

# Import order matters: the base entities must be defined before the dependent
from database.models.Usuario import Usuario
from database.models.Aluno import Aluno
from database.models.Coordenador import Coordenador
from database.models.Professor import Professor
from database.models.Curso import Curso
from database.models.Turma import Turma
from database.models.Disciplina import Disciplina
from database.models.DisciplinaTurma import DisciplinaTurma
from database.models.MatriculaTurma import MatriculaTurma
from database.models.Nota import Nota

def criar_tabelas():
    classe_base.metadata.create_all(bind=motor)


if __name__ == "__main__":
    criar_tabelas()