from fastapi import APIRouter, HTTPException, Request
from database.databaseCrud.AlunoCrud import contar_Alunos, buscar_todos_Alunos

router = APIRouter(prefix="/API")

@router.get("/GetAlunosCount", tags=["API", "GET"])
async def contagemAlunos():
    return contar_Alunos()

@router.get("/GetAlunos", tags=["API", "GET"])
async def listarAlunos():
    Alunos = [ aluno for aluno in buscar_todos_Alunos()]
    return Alunos