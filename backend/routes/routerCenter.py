import importlib
import pkgutil
from fastapi import APIRouter, Depends, Request
from fastapi_csrf_protect import CsrfProtect

async def verify_csrf(request: Request, csrf_protect: CsrfProtect = Depends()):
    if request.method not in ["GET", "HEAD", "OPTIONS"]:
        await csrf_protect.validate_csrf(request)

api_router = APIRouter(dependencies=[Depends(verify_csrf)])

def _incluir_routers_do_pacote(pacote_nome: str):
    pacote = importlib.import_module(pacote_nome)
    prefixo = pacote.__name__ + "."

    for _, nome_modulo, _ in pkgutil.walk_packages(pacote.__path__,prefixo):
        modulo = importlib.import_module(nome_modulo)
        if hasattr(modulo, "router"):
            print(f"[ROUTER] Incluindo router do módulo: {nome_modulo}")
            api_router.include_router(modulo.router)

_incluir_routers_do_pacote("backend.routes")