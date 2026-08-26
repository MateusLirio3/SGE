from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from backend.routes.routerCenter import api_router

app = FastAPI(
    title="Sistema de Gerenciamento Escolar"
)

app.include_router(api_router)

app.mount("/static", StaticFiles(directory="Frontend/static"), name="static")
app.mount("/Frontend", StaticFiles(directory="Frontend"), name="frontend")