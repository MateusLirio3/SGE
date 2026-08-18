from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="frontend/pages/Coordenador")

router = APIRouter()
@router.get("/Coordenador/Pagina-Inicial", tags=["Coordenador","Paginas"])
async def carregarPaginaLogin(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="paginaInicial.html",
        context={"request": request}
    )