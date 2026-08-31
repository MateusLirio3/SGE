from fastapi import APIRouter, HTTPException, Request
from fastapi.templating import Jinja2Templates
from backend.permissoes import tem_permissao

templates = Jinja2Templates(directory="Frontend/pages/Coordenador")

router = APIRouter()

@router.get("/Turmas", tags=["Coordenador", "Turmas"])
async def listarTurmas(request: Request):
    tipo = request.cookies.get("tipo_usuario", "")
    
    if not tem_permissao(tipo, "listar"):
        raise HTTPException(
            status_code=403,
            detail="Você não tem permissão para acessar esta página."
        )
    
    return templates.TemplateResponse(
        request=request,
        name="turmas.html",
        context={"request": request}
    )

@router.get("/Turma/{turma_id}", tags=["Coordenador", "Turmas"])
async def detalhesTurma(request: Request, turma_id: str):
    tipo = request.cookies.get("tipo_usuario", "")
        
    # colocar pra redirecionar pra pagina de erro(tem que criar tbm)

    if not tem_permissao(tipo, "visualizar"):
        raise HTTPException(
            status_code=403,
            detail="Você não tem permissão para acessar esta página."
        )
    
    return templates.TemplateResponse(
        request=request,
        name="turma_detalhe.html",
        context={"request": request, "turma_id": turma_id}
    )