# backend/modulos/autenticacao/criptografia.py

"""
Módulo central de autenticação.

Responsável por todas as operações criptográficas e de identidade:
hashing de senhas, geração e decodificação de tokens JWT.

Variáveis de ambiente obrigatórias:
    SECRET_KEY : Chave secreta para assinar tokens JWT.
                 Gere com: python -c "import secrets; print(secrets.token_hex(64))"
    ALGORITHM  : Algoritmo JWT (padrão: HS256)
"""

from datetime import datetime, timedelta, timezone
import jwt
from passlib.context import CryptContext
import os

# Querido(a) dev: SECRET_KEY DEVE estar no .env com pelo menos 64 caracteres.
# Se não estiver definida, o sistema falha imediatamente no startup —
# isso é intencional. Tokens JWT sem chave segura são trivialmente forjáveis.
SECRET_KEY = os.environ["SECRET_KEY"]  # KeyError no startup se não definida — correto
ALGORITHM  = os.getenv("ALGORITHM", "HS256")

ENCRIPTADOR_PWD = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verificar_senha(senha_do_formulario: str, senha_salva_no_bd: str) -> bool:
    return ENCRIPTADOR_PWD.verify(senha_do_formulario, senha_salva_no_bd)


def criar_token_de_acesso(data: dict, tempo_para_expirar: timedelta | None = None) -> str:
    para_encodar = data.copy()
    expirar = datetime.now(timezone.utc) + (tempo_para_expirar or timedelta(minutes=15))
    para_encodar.update({"exp": expirar, "iat": datetime.now(timezone.utc)})
    return jwt.encode(para_encodar, SECRET_KEY, algorithm=ALGORITHM)


def decodificar_token_de_acesso(token: str) -> dict | None:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        return None


def criar_token_recuperacao_senha(data: dict) -> str:
    para_encodar = data.copy()
    expirar = datetime.now(timezone.utc) + timedelta(hours=24)
    para_encodar.update({"exp": expirar, "iat": datetime.now(timezone.utc)})
    return jwt.encode(para_encodar, SECRET_KEY, algorithm=ALGORITHM)


def decodificar_token_recuperacao_senha(token: str) -> dict | None:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        return None