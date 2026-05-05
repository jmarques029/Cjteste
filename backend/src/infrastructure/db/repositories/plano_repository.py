from typing import List, Optional
from sqlalchemy.orm import Session
from src.domain.plano import Plano
from src.domain.repositories import PlanoRepository
from src.infrastructure.db.models import PlanoModel

class PlanoRepositoryImpl(PlanoRepository):
    def __init__(self, db: Session):
        self.db = db
        
    def listar_todos(self) -> List[Plano]:
        models = self.db.query(PlanoModel).all()
        return [
            Plano(id=m.id, nome=m.nome, preco=m.preco, velocidade_mbps=m.velocidade_mbps) 
            for m in models
        ]
        
    def buscar_por_id(self, plano_id: int) -> Optional[Plano]:
        model = self.db.query(PlanoModel).filter(PlanoModel.id == plano_id).first()
        if model:
            return Plano(id=model.id, nome=model.nome, preco=model.preco, velocidade_mbps=model.velocidade_mbps)
        return None
