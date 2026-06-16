from typing import Optional

from pydantic import BaseModel, EmailStr


class PlanoResponse(BaseModel):
    id: int
    nome: str
    preco: float
    velocidade_mbps: int

    model_config = {"from_attributes": True}


class ClienteCreate(BaseModel):
    nome: str
    email: EmailStr
    documento: str
    documento_url: Optional[str] = None


class ContratacaoRequest(BaseModel):
    plano_id: int
    cliente: ClienteCreate


class ContratacaoResponse(BaseModel):
    status: str
    cliente_id: int
    mensagem: str


class Token(BaseModel):
    access_token: str
    token_type: str
