from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from database.databaseCrud.UsuarioCrud import buscar_usuario_por_email
from database.databaseCrud.Erros import ErroNaoEncontrado
from backend.modules.Autentication.criptografia import criar_token_recuperacao_senha
from backend.modules.Email.emailHandler import enviar_email_recuperacao_senha
from backend.modules.Autentication.criptografia import decodificar_token_recuperacao_senha
from database.databaseCrud.UsuarioCrud import atualizar_usuario

templates = Jinja2Templates(directory="frontend/pages")

router = APIRouter()
@router.get("/Esqueceu-Senha", tags=["Autenticação","Paginas"])
async def carregarPaginaEsqueceuSenha(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="paginaEsqueceuSenha.html",
        context={"request": request}
    )

@router.post("/Esqueceu-Senha/Submit", tags=["Autenticação","Paginas","Submit"])
async def enviarEmailRecuperarSenha(request: Request):

    form_data = await request.form()
    email = form_data.get("email", "").strip()

    try:
        usuario = buscar_usuario_por_email(email)
    except ErroNaoEncontrado:
        return {"enviado": False, "message": "E-mail não encontrado."}
    except Exception as e:
        print(f"Erro inesperado ao buscar usuário: {e}")
        return {"enviado": False, "message": "Erro ao processar a solicitação."}

    try:
        token_recuperacao = criar_token_recuperacao_senha(
            data={
                "id_usuario": str(usuario.id),
                "email": usuario.email
            }
        )
        await enviar_email_recuperacao_senha(email, token_recuperacao, usuario.nome)
    except Exception as e:
        print(f"Erro ao enviar e-mail de recuperação: {e}")
        return {"enviado": False, "message": "Erro ao enviar o e-mail. Tente novamente."}

    return {"enviado": True, "message": "E-mail enviado com sucesso!"}

# @router.get("/Redefinir-Senha/", tags=["Autenticação","Paginas"])
# async def redefinirSenha(request: Request, token: str):
#     return templates.TemplateResponse(
#         "redefinirSenha.html",
#         {"request": request, "token": token}
#     )

@router.post("/Redefinir-Senha/Submit/", tags=["Post"])
async def processar_formulario_resetar_senha(request: Request):

    form_data = await request.form()
    nova_senha = form_data.get("password")
    token = form_data.get("token")

    # Decodifica o token para obter o email do usuário e verificar a validade do token
    dados_token = decodificar_token_recuperacao_senha(token)
    if not token or not dados_token:
        # Se o token não for fornecido, retorna um erro. Ou caso esteja vazio ou seja inválido, retorna um erro.
        print(f"TOKEN RECEBIDO: {token}")
        print(f"DADOS TOKEN: {dados_token}")
        raise HTTPException(status_code=400, detail="Token invalido ou expirado.")
    
    # Busca o usuario que será atualizado a senha, caso o email do token não exista, retorna um erro.
    try:
        usuario = buscar_usuario_por_email(dados_token["email"])
    except Exception as e:
        print(f"Erro ao buscar usuário: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar usuário.")
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    
    # A coisa que mais irrita quando voce esquece uma senha. Se a nova senha for igual a antiga, retorna um erro.
    if usuario.senha == nova_senha:
        raise HTTPException(status_code=400, detail="A nova senha deve ser diferente da senha atual.")
    
    # Atualiza o usuario com a nova senha, utilizando o email do token para identificar qual usuario deve ser atualizado
    try:
        atualizar_usuario(email=dados_token["email"], nova_senha=nova_senha)
    except Exception as e:
        print(f"Erro ao atualizar a senha: {e}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar a senha.")

    # Retorna uma resposta ou redireciona para outra página após o processamento
    return {"message": "Senha atualizada com sucesso."}