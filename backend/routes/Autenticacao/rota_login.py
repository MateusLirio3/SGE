from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.templating import Jinja2Templates

from backend.modules.Autentication.criptografia import criar_token_de_acesso
from backend.routes.CSRF.csrfRoutes import verify_csrf

from database.database_conection import pegar_sessao

# ─────────────────────────────────────────────────────────────────────────────
DURACAO_SESSAO_HORAS    = 8                             
DURACAO_SESSAO_SEGUNDOS = DURACAO_SESSAO_HORAS * 3600   # usado no max_age dos cookies

templates = Jinja2Templates(directory="frontend/pages")

router = APIRouter(dependencies=[Depends(verify_csrf)])

@router.get("/login", tags=["Autenticação","Paginas"])
async def carregarPaginaLogin(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="paginaLogin.html",
        context={"request": request}
    )

@router.post("/login/submit", tags=["Autenticação","API","Submit"])
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    sessao= Depends(pegar_sessao)
):
    from database.databaseCrud.UsuarioCrud import autenticar_usuario
    from database.databaseCrud.Erros import ErroNaoEncontrado

    try:
        usuario = autenticar_usuario(form_data.username,form_data.password, sessao)
    except ErroNaoEncontrado:
        raise HTTPException(
            status_code=401,
            detail="Usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if usuario is None:
        raise HTTPException(
            status_code=401,
            detail="Usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_de_acesso = criar_token_de_acesso(
        data={"sub": usuario.email},
        tempo_para_expirar=timedelta(hours=DURACAO_SESSAO_HORAS)
    )


    response = JSONResponse(content={
        "token_type":   "bearer",
        "usuario":      usuario.nome,
        "tipo":         usuario.tipo
    })

    response.set_cookie(
        secure=True,
        key="access_token",
        value=token_de_acesso,
        httponly=True,
        max_age=DURACAO_SESSAO_SEGUNDOS,
        path="/"
    )

    response.set_cookie(
        key="tipo_usuario",
        value=usuario.tipo,
        httponly=False,
        max_age=DURACAO_SESSAO_SEGUNDOS,
        path="/"
    )

    response.set_cookie(
        key="nome_usuario",
        value=usuario.nome,
        httponly=False,
        max_age=DURACAO_SESSAO_SEGUNDOS,
        path="/"
    )

    return response