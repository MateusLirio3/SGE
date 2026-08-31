from fastapi import APIRouter, Request, HTTPException
from backend.permissoes import PERMISSOES

router = APIRouter()

@router.get("/api/permissoes")
async def get_permissoes(request: Request):
    tipo = request.cookies.get("tipo_usuario", "")
    
    if tipo not in PERMISSOES:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")
    
    return PERMISSOES[tipo]