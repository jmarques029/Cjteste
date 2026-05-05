from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.infrastructure.api.dependencies import get_db, get_current_user
from src.infrastructure.api.schemas.schemas import ContratacaoRequest, ContratacaoResponse
from src.infrastructure.db.repositories.plano_repository import PlanoRepositoryImpl
from src.infrastructure.db.repositories.cliente_repository import ClienteRepositoryImpl
from src.use_cases.solicitar_contratacao import SolicitarContratacaoUseCase

router = APIRouter(prefix="/contratacao", tags=["Contratação"])

@router.post("/", response_model=ContratacaoResponse)
def contratar_plano(
    payload: ContratacaoRequest, 
    db: Session = Depends(get_db), 
    current_user: str = Depends(get_current_user) # Rota protegida
):
    repo_plano = PlanoRepositoryImpl(db)
    repo_cliente = ClienteRepositoryImpl(db)
    
    use_case = SolicitarContratacaoUseCase(repo_plano, repo_cliente)
    
    try:
        resultado = use_case.executar(
            plano_id=payload.plano_id, 
            cliente_dados=payload.cliente.model_dump()
        )
        return resultado
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
