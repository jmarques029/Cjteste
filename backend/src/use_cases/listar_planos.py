from typing import List
from src.domain.plano import Plano
from src.domain.repositories import PlanoRepository

class ListarPlanosUseCase:
    def __init__(self, repo: PlanoRepository):
        self.repo = repo
        
    def executar(self) -> List[Plano]:
        return self.repo.listar_todos()
