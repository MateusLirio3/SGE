from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="frontend/pages")

router = APIRouter()

@router.get("/login", tags=["Autenticação","Paginas"])
async def carregarPaginaLogin(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="paginaLogin.html",
        context={"request": request}
    )

@router.post("/login/submit", tags=["Autenticação","API","Submit"])
async def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):
    pass