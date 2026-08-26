import ulid 

from sqlalchemy.types import TypeDecorator

from sqlalchemy.dialects.mysql import CHAR

class TipoULID(TypeDecorator):
    #é um tipo customizado que salva ULID como CHAR(26) no MySQL

    impl = CHAR(26) 
    cache_ok = True 
    def process_bind_param(self, valor, dialeto): 

        if valor is None: 
            return valor
        return str(valor)

     #essa função é chamada automaticamente depois de ler o banco    
    def process_result_value(self, valor, dialeto):
        
        if valor is None:
            return valor
        return valor

def gerar_ulid():

    return ulid.ulid()
