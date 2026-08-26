from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from database.database_config import DATABASE_URL

"""
Conexão com o banco de dados.
"""

db_url = os.getenv('URL_BD') or DATABASE_URL
motor = create_engine(db_url)


classe_base = declarative_base()

sessao_local = sessionmaker(bind=motor, expire_on_commit=False)

def pegar_sessao():
        print("------------------------")
        print("------------------------")
        print("------------------------")
        print(db_url)
        print("------------------------")
        print("------------------------")
        print("------------------------")

        sessao = sessao_local()
        try:
                yield sessao
        finally:
                sessao.close()