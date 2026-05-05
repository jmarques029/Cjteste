from pydantic import BaseModel, field_validator
from typing import Optional

class Cliente(BaseModel):
    id: int
    nome: str
    email: str
    documento: str
    documento_url: Optional[str] = None

    @field_validator("email")
    def email_valido(cls, v):
        if "@" not in v:
            raise ValueError("Email inválido")
        return v
