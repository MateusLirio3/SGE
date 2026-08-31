from fastapi import APIRouter, Request, Response, HTTPException
from database.databaseCrud.logout import registrar_logout
from database.databaseCrud.Erros import ErroNaoEncontrado

router = APIRouter()

@router.post("/logout")
async def logout(request: Request, response: Response):
    email = request.cookies.get("email_usuario")
    
     # colocar pra redirecionar pra pagina de erro(tem que criar tbm)
    if not email:
        raise HTTPException(status_code=400, detail="Email não encontrado nos cookies")
    
    try:
        usuario = registrar_logout(email)
        print(f"✅ Logout registrado: {usuario.nome} ({email})")
    except ErroNaoEncontrado:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao registrar logout: {str(e)}")
    
    response.delete_cookie("tipo_usuario", path="/")
    response.delete_cookie("email_usuario", path="/")
    response.delete_cookie("nome_usuario", path="/")
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("token", path="/")
    response.delete_cookie("session_id", path="/")
    
    return {"message": "Logout realizado com sucesso", "success": True}