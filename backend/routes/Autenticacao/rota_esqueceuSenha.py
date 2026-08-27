from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="frontend/pages")

router = APIRouter()
@router.get("/Esqueceu-Senha", tags=["Autenticação","Paginas"])
async def carregarPaginaEsqueceuSenha(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="paginaEsqueceuSenha.html",
        context={"request": request}
    )

@router.post("/Esqueceu-Senha/Submit", tags=["Autenticação","Paginas","Submit"])
async def enviarEmailRecuperarSenha(request: Request, email: str):

    pass