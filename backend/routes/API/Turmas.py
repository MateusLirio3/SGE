from fastapi import APIRouter, HTTPException, Request
from database.databaseCrud.TurmaCrud import contar_Turmas, buscar_todos_Turmas

router = APIRouter(prefix="/API")

@router.get("/GetTurmasCount", tags=["API", "GET"])
async def contagemTurmas():
    return contar_Turmas()

@router.get("/GetTurmas", tags=["API", "GET"])
async def listarTurmas():
    Turmas = [ Turma for Turma in buscar_todos_Turmas()]
    return Turmas