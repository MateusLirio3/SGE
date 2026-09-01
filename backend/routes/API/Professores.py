from fastapi import APIRouter, HTTPException, Request
from database.databaseCrud.ProfessorCrud import contar_Professores, buscar_todos_Professores

router = APIRouter(prefix="/API")

@router.get("/GetProfessoresCount", tags=["API", "GET"])
async def contagemProfessores():
    return contar_Professores()

@router.get("/GetProfessores", tags=["API", "GET"])
async def listarProfessores():
    Professores = [ professor for professor in buscar_todos_Professores()]
    return Professores