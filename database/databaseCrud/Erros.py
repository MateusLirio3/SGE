class ErroBancoDeDados(Exception):
    """Base para todos os erros de banco"""
    pass

class ErroRegistrar(ErroBancoDeDados):
    pass

class ErroExcluir(ErroBancoDeDados):
    pass

class ErroAtualizar(ErroBancoDeDados):
    pass

class ErroNaoEncontrado(ErroBancoDeDados):
    pass