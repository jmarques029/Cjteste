from abc import ABC, abstractmethod
from typing import List, Optional

from src.domain.cliente import Cliente
from src.domain.plano import Plano


class PlanoRepository(ABC):
    @abstractmethod
    def listar_todos(self) -> List[Plano]:
        pass

    @abstractmethod
    def buscar_por_id(self, plano_id: int) -> Optional[Plano]:
        pass


class ClienteRepository(ABC):
    @abstractmethod
    def buscar_por_documento(self, documento: str) -> Optional[Cliente]:
        pass

    @abstractmethod
    def salvar(self, cliente: Cliente) -> Cliente:
        pass
