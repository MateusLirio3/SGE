import importlib
import pkgutil
from fastapi import APIRouter, Depends, Request
from fastapi_csrf_protect import CsrfProtect

ROTAS_SEM_CSRF = [
    "/logout",
    "/login",
    "/esqueceu-senha",
    "/api/permissoes"
]

async def verify_csrf(request: Request, csrf_protect: CsrfProtect = Depends()):
    if request.url.path in ROTAS_SEM_CSRF:
        return
    
    if request.method not in ["GET", "HEAD", "OPTIONS"]:
        await csrf_protect.validate_csrf(request)

api_router = APIRouter(dependencies=[Depends(verify_csrf)])

# tava importando outras rotas antes, esta deve ser a primeira
import backend.routes.rota_dashboard
api_router.include_router(backend.routes.rota_dashboard.router)

def _incluir_routers_do_pacote(pacote_nome: str):
    pacote = importlib.import_module(pacote_nome)
    prefixo = pacote.__name__ + "."

    for _, nome_modulo, _ in pkgutil.walk_packages(pacote.__path__, prefixo):
        if nome_modulo == "backend.routes.rota_dashboard":
            continue
        modulo = importlib.import_module(nome_modulo)
        if hasattr(modulo, "router"):
            print(f"[ROUTER] Incluindo router do módulo: {nome_modulo}")
            api_router.include_router(modulo.router)

_incluir_routers_do_pacote("backend.routes")