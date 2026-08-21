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
        if isinstance(valor, ulid.ULID): 
            return str(valor)
        return str(ulid.ULID.from_str(valor)) #Se o valor for uma string isso converte pra objeto ULID e depois de volta pra string.

     #essa função é chamada automaticamente depois de ler o banco    
    def process_result_value(self, valor, dialeto):
        
        if valor is None:
            return valor
        return ulid.ULID.from_str(valor)


def gerar_ulid():

    return ulid.ULID()
