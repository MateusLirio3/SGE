from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from fastapi_csrf_protect import CsrfProtect

async def verify_csrf(request: Request, csrf_protect: CsrfProtect = Depends()):
    if request.method not in ["GET", "HEAD", "OPTIONS"]:
        await csrf_protect.validate_csrf(request)

router = APIRouter()

@router.get("/get-token", response_class=JSONResponse)
def get_csrf_token(csrf_protect: CsrfProtect = Depends()):
    token_csrf, token_assinado = csrf_protect.generate_csrf_tokens()
    response = JSONResponse(content={"detail": "CSRF cookie criado"})

    csrf_protect.set_csrf_cookie(token_assinado, response)
    response.headers["X-CSRF-Token"] = token_csrf
    response.headers["Cache-Control"] = "no-store"
    return response

@router.post("/submit-data")
async def protected_route(request: Request, csrf_protect: CsrfProtect = Depends()):
    await csrf_protect.validate_csrf(request)
    
    return {"message": "Dados confirmados, Validação CSRF aprovada."}