from fastapi import APIRouter, HTTPException, Request
from database.databaseCrud.CoordenadorCrud import contar_Coordenador

router = APIRouter(prefix="/API")

@router.get("/GetCoordenadoresCount", tags=["API", "GET"])
async def contagemCoordenadores(request: Request):
    return contar_Coordenador()
