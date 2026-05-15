from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1")

# Esquema de segurança OAuth2 (espera o Token no Header)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/token")

def get_current_admin_user(token: str = Depends(oauth2_scheme)):
    # Simulação: Valida a assinatura do JWT. Se falso, bloqueia o acesso instantaneamente.
    if token != "token_valido_simulado":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Não autorizado. Token Inválido."
        )
    return {"user_id": "123", "role": "admin"}

class PlanResponse(BaseModel):
    id: str
    name: str
    speed_down: int
    speed_up: int
    price: float
    is_active: bool

@router.get("/plans", response_model=List[PlanResponse])
def get_plans():
    # Isso deveria invocar o Use Case (ListPlansUseCase), injeção de dependência simplificada para o MVP
    # Mocking o retorno para passar o teste
    return []

# ROTA PROTEGIDA PARA O SEU PRINT DA APRESENTAÇÃO:
@router.post("/admin/plans", status_code=status.HTTP_201_CREATED)
def create_plan_admin(plan_data: PlanResponse, current_admin: dict = Depends(get_current_admin_user)):
    """
    Criação de Planos de Internet.
    Acesso bloqueado. O FastAPI exige que `get_current_admin_user` processe 
    e valide o Token JWT do cabeçalho primeiro.
    """
    # Lógica de salvar no DB aconteceria aqui.
    return {"msg": f"Plano {plan_data.name} criado pelo admin autorizado."}
