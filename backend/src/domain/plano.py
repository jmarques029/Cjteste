from pydantic import BaseModel, field_validator

class Plano(BaseModel):
    id: int
    nome: str
    preco: float
    velocidade_mbps: int

    @field_validator("preco")
    def preco_positivo(cls, v):
        if v < 0:
            raise ValueError("Preço não pode ser negativo")
        return v
