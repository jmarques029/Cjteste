from typing import Optional
from sqlalchemy.orm import Session
from src.domain.cliente import Cliente
from src.domain.repositories import ClienteRepository
from src.infrastructure.db.models import ClienteModel

class ClienteRepositoryImpl(ClienteRepository):
    def __init__(self, db: Session):
        self.db = db
        
    def buscar_por_documento(self, documento: str) -> Optional[Cliente]:
        model = self.db.query(ClienteModel).filter(ClienteModel.documento == documento).first()
        if model:
            return Cliente(id=model.id, nome=model.nome, email=model.email, documento=model.documento, documento_url=model.documento_url)
        return None
        
    def salvar(self, cliente: Cliente) -> Cliente:
        model = ClienteModel(
            nome=cliente.nome, 
            email=cliente.email, 
            documento=cliente.documento,
            documento_url=cliente.documento_url
        )
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return Cliente(id=model.id, nome=model.nome, email=model.email, documento=model.documento, documento_url=model.documento_url)
