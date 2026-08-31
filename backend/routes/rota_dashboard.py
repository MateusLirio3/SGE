from fastapi import APIRouter, HTTPException, Request
from fastapi.templating import Jinja2Templates
from backend.permissoes import tem_permissao

templates = Jinja2Templates(directory="Frontend/pages")

router = APIRouter()

@router.get("/Pagina-Inicial", tags=["Dashboard"])
async def carregarDashboard(request: Request):
    tipo = request.cookies.get("tipo_usuario", "")
        
    # colocar pra redirecionar pra pagina de erro(tem que criar tbm)
    # todos os usuarios devem ter permissao pra cá, mas é bom ter

    if not tem_permissao(tipo, "dashboard"):
        raise HTTPException(
            status_code=401,
            detail="Usuario não tem permissão para visualizar esta pagina."
        )
    
    return templates.TemplateResponse(
        request=request,
        name="dashboard.html",
        context={
            "request": request,
            "tipo_usuario": tipo
        }
    )