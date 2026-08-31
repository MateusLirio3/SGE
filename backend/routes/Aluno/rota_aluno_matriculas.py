from fastapi import APIRouter, HTTPException, Request
from fastapi.templating import Jinja2Templates
from backend.permissoes import tem_permissao

templates = Jinja2Templates(directory="Frontend/pages/Aluno")

router = APIRouter()

@router.get("/Minhas-Matriculas", tags=["Aluno", "Matriculas"])
async def minhasMatriculas(request: Request):
    tipo = request.cookies.get("tipo_usuario", "")
    # colocar pra redirecionar pra pagina de erro(tem que criar tbm)
    if not tem_permissao(tipo, "minhas_matriculas"):
        raise HTTPException(
            status_code=403,
            detail="Você não tem permissão para acessar esta página."
        )
    
    return templates.TemplateResponse(
        request=request,
        name="minhas_matriculas.html",
        context={"request": request}
    )