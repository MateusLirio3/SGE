from fastapi import Depends, HTTPException, Cookie
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from .criptografia import decodificar_token_de_acesso
from database.databaseCrud.UsuarioCrud import buscar_usuario_por_email
from database.models.Usuario import Usuario
from database.databaseCrud.Erros import ErroNaoEncontrado

esquema_oauth2 = OAuth2PasswordBearer(tokenUrl="/login/submit")

# Tipos considerados bibliotecários no sistema

class RedirecionarParaLogin(Exception):
    """
    Sinaliza que uma rota de PÁGINA deve redirecionar para /login.

    Querido(a) dev: NÃO faça `return RedirectResponse(...)` dentro de uma
    dependência (Depends). Como dependência, o valor de retorno vira o
    parâmetro da função da rota — não a resposta HTTP. O redirecionamento
    só acontece de verdade porque main.py registra um
    @app.exception_handler(RedirecionarParaLogin) que converte esta
    exceção na resposta de redirect.
    """
    pass


# ── Lógica central ────────────────────────────────────────────────────────────

def _autenticar_token(access_token: str | None) -> dict:
    """
    Valida o token e retorna o dicionário do usuário.
    Lança HTTPException 401 se inválido, 403 se termo pendente.
    """
    if access_token is None:
        raise HTTPException(status_code=401, detail="Não autenticado")

    dados_usuario = decodificar_token_de_acesso(access_token)
    if not dados_usuario or "sub" not in dados_usuario:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    try:
        usuario = buscar_usuario_por_email(dados_usuario["sub"])
    except ErroNaoEncontrado:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")

    matricula = usuario.matricula

    usuario_dict = {
        "id":        str(usuario.id),
        "nome":      usuario.nome,
        "email":     usuario.email,
        "matricula": matricula,
        "tipo": usuario.tipo
    }

    return usuario_dict

# ── Dependência para rotas de API ─────────────────────────────────────────────

async def get_usuario_atual(
    access_token: Annotated[str | None, Cookie()] = None
) -> dict:
    """Retorna JSON 401 se não autenticado."""
    return _autenticar_token(access_token)


# ── Dependência para rotas de página HTML ─────────────────────────────────────

async def get_usuario_atual_pagina(
    access_token: Annotated[str | None, Cookie()] = None
):
    """Redireciona para /login se não autenticado."""
    try:
        return _autenticar_token(access_token)
    except HTTPException:
        raise RedirecionarParaLogin()

# ── Dependência para rotas exclusivas de Coordenadores ──────────────────────

async def verificar_Coordenador(
    usuario: Annotated[dict, Depends(get_usuario_atual)]
) -> dict:

    if usuario.get("tipo") != "Coordenador":
        raise HTTPException(
            status_code=403,
            detail="Acesso restrito a Coordenadores."
        )
    return usuario

# ── Dependência para rotas exclusivas de Admins ──────────────────────

async def verificar_Admin(
    usuario: Annotated[dict, Depends(get_usuario_atual)]
) -> dict:

    if usuario.get("tipo") != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Acesso restrito a Administradores do sistema."
        )
    return usuario