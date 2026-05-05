from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.infrastructure.api.dependencies import get_db
from src.infrastructure.api.schemas.schemas import PlanoResponse
from src.infrastructure.db.repositories.plano_repository import PlanoRepositoryImpl
from src.use_cases.listar_planos import ListarPlanosUseCase

router = APIRouter(prefix="/planos", tags=["Planos"])

@router.get("/", response_model=List[PlanoResponse])
def listar_todos_planos(db: Session = Depends(get_db)):
    repo = PlanoRepositoryImpl(db)
    use_case = ListarPlanosUseCase(repo)
    planos = use_case.executar()
    return planos
