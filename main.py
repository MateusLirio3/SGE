from fastapi import FastAPI, Request, status
from fastapi.staticfiles import StaticFiles
from fastapi_csrf_protect.exceptions import CsrfProtectError
from fastapi.responses import JSONResponse

from backend.routes.routerCenter import api_router
from config import settings

app = FastAPI(
    title="Sistema de Gerenciamento Escolar"
)

app.include_router(api_router)

app.mount("/static", StaticFiles(directory="Frontend/static"), name="static")
app.mount("/Frontend", StaticFiles(directory="Frontend"), name="frontend")

@app.exception_handler(CsrfProtectError)
def csrf_protect_exception_handler(request: Request, exc: CsrfProtectError):
    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN,
        content={"detail": exc.message}
    )