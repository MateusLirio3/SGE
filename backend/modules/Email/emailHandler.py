from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
import os
from fastapi import BackgroundTasks
from pathlib import Path

# Configurações para envio de email utilizando o FastAPI Mail
# Lembrar de colocar as informações corretas do email e senha, e de habilitar o acesso a apps menos seguros no Gmail para que funcione
# NAO USAR MEU EMAIL AQUI QUANDO FOR PRA PRODUÇÂO PFV

conf = ConnectionConfig(
    MAIL_USERNAME= "mateuslirio.escola@gmail.com", # Email de quem vai enviar o email
    MAIL_PASSWORD= os.getenv('MAIL_PASSWORD'), # App password do email, tem que gerar um app password no Gmail pra usar aqui
    MAIL_FROM= "mateuslirio.escola@gmail.com", # Email de quem vai enviar o email, geralmente é o mesmo do MAIL_USERNAME, mas pode ser diferente se quiser
    MAIL_PORT=587, # Porta do servidor de email, 587 é a porta padrão para TLS
    MAIL_SERVER="smtp.gmail.com", # Servidor de email, smtp.gmail.com é o servidor do Gmail, mas se for usar outro serviço de email tem que colocar o servidor correspondente
    MAIL_STARTTLS=True, 
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True # Indica que é necessário usar autenticação para enviar o email, geralmente é True, mas pode ser False se o servidor de email permitir envio sem autenticação
)


# Enviar email de forma assíncrona
async def enviar_email_assyncrono(assunto: str, email_para: str, corpo: str):

    mensagem = MessageSchema(
        subject=assunto,
        recipients=[email_para],
        body=corpo,
        subtype=MessageType.plain
    )

    fm = FastMail(conf) # Configuração do email
    await fm.send_message(mensagem) # Enviar email de forma assíncrona

# Como o nome sugere, essa é so pra testar
async def enviar_email_teste(background_tasks: BackgroundTasks):
    # Enviar um email usando a função enviar_email_assyncrono, passando o assunto, destinatário e corpo do email
    background_tasks.add_task(enviar_email_assyncrono, "Teste", "mateuslirio3@gmail.com", "Este é um email de teste enviado em background usando FastAPI!")
    return {"message": "Email enviado em background"}

# Essa é a pra recuperar a senha
# Tem que ajeitar o corpo do email pra ficar mais bonitinho, mas a ideia é essa
# Você passa o email do destinatario e o token de recuperação de senha, e ele envia um email com essas informações
async def enviar_email_recuperacao_senha(email_para: str, token: str, nome_usuario: str):
    from datetime import datetime
    
    # Lê o template HTML
    template_path = Path(__file__).parent / "templateEmail.html"
    corpo = template_path.read_text(encoding="utf-8")
    
    # Substitui as variáveis
    corpo = corpo.replace("{{ nome_usuario }}", nome_usuario)
    corpo = corpo.replace("{{ link_redefinir }}", f"http://localhost:8000/redefinir-senha/?token={token}")
    corpo = corpo.replace("{{ ano }}", str(datetime.now().year))

    mensagem = MessageSchema(
        subject="Recuperação de Senha — Sistema Interno de Gerenciamento Academico",
        recipients=[email_para],
        body=corpo,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(mensagem)
    """
    Envia email de boas-vindas ao aluno recém-cadastrado pelo bibliotecário,
    com a senha temporária e link para o sistema.
    """
    from datetime import datetime

    corpo = f"""Olá, {nome_usuario}!

Seu cadastro na Sistema Interno de Gerenciamento Academico foi realizado com sucesso.

Acesse o sistema com as seguintes credenciais:
  E-mail: {email_para}
  Senha:  {senha_temporaria}

Link de acesso: http://localhost:8000/login

Por segurança, recomendamos que você troque sua senha assim que fizer o primeiro acesso.
Para isso, acesse: Configurações → Segurança → Trocar Senha.

Atenciosamente,
Sistema Interno de Gerenciamento Academico — ISEPAM
{datetime.now().year}
"""

    mensagem = MessageSchema(
        subject="Bem-vindo(a) à Sistema Interno de Gerenciamento Academico — Suas credenciais de acesso",
        recipients=[email_para],
        body=corpo,
        subtype=MessageType.plain
    )

    fm = FastMail(conf)
    await fm.send_message(mensagem)