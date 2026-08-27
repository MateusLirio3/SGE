from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="frontend/pages/Aluno")

router = APIRouter()
@router.get("/Aluno/Pagina-Inicial", tags=["Aluno","Paginas"])
async def carregarPaginaLogin(request: Request):
    tipo = request.cookies.get("tipo_usuario","")
    if tipo != "Aluno":
        return HTTPException(
            status_code=401,
            detail="Usuario não tem permissão para visualizar está pagina."
        )
    
    return templates.TemplateResponse(
        request=request,
        name="paginaInicial.html",
        context={"request": request}
    )