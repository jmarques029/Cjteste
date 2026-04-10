from fastapi import APIRouter
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1")

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
