from fastapi import APIRouter, HTTPException, Request
from fastapi.templating import Jinja2Templates
from backend.permissoes import tem_permissao

templates = Jinja2Templates(directory="Frontend/pages")

router = APIRouter()

@router.get("/Configuracoes", tags=["Coordenador", "Configuracoes"])
async def carregarConfiguracoes(request: Request):
    tipo = request.cookies.get("tipo_usuario", "")
    
    # colocar pra redirecionar pra pagina de erro(tem que criar tbm)
    # todos os usuarios devem ter permissao pra cá, mas é bom ter
    if not tem_permissao(tipo, "configuracoes"):
        raise HTTPException(
            status_code=403,
            detail="Você não tem permissão para acessar esta página."
        )
    
    return templates.TemplateResponse(
        request=request,
        name="configuracoes.html",
        context={"request": request}
    )