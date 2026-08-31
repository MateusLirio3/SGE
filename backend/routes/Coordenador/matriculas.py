from fastapi import APIRouter, HTTPException, Request
from fastapi.templating import Jinja2Templates
from backend.permissoes import tem_permissao

templates = Jinja2Templates(directory="Frontend/pages/Coordenador")

router = APIRouter()

@router.get("/Matriculas", tags=["Coordenador", "Matriculas"])
async def listarMatriculas(request: Request):
    tipo = request.cookies.get("tipo_usuario", "")
    
    # colocar pra redirecionar pra pagina de erro(tem que criar tbm)
    if not tem_permissao(tipo, "listar"):
        raise HTTPException(
            status_code=403,
            detail="Você não tem permissão para acessar esta página."
        )
    
    return templates.TemplateResponse(
        request=request,
        name="matriculas.html",
        context={"request": request}
    )

@router.get("/Matricula/{matricula_id}", tags=["Coordenador", "Matriculas"])
async def detalhesMatricula(request: Request, matricula_id: int):
    tipo = request.cookies.get("tipo_usuario", "")
    # colocar pra redirecionar pra pagina de erro(tem que criar tbm)
    if not tem_permissao(tipo, "visualizar"):
        raise HTTPException(
            status_code=403,
            detail="Você não tem permissão para acessar esta página."
        )
    
    return templates.TemplateResponse(
        request=request,
        name="matricula_detalhes.html",
        context={"request": request, "matricula_id": matricula_id}
    )