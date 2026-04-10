import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.infrastructure.database.models import Base, PlanModel
from src.infrastructure.repositories.plan_repository import SQLAlchemyPlanRepository
from src.domain.entities import Plan

# Para testes, usaremos um banco em memória SQLITE
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture()
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

def test_plan_repository_integration(db_session):
    repo = SQLAlchemyPlanRepository(db_session)
    
    # Testa a criação real no DB
    plan = Plan(name="Plano Integration", speed_down=100, speed_up=50, price=89.9)
    created = repo.create(plan)
    
    assert created.name == "Plano Integration"
    
    # Testa o resgate (get)
    fetched = repo.get_by_id(created.id)
    assert fetched is not None
    assert fetched.name == "Plano Integration"
    
    # Testa a listagem
    plans = repo.list_all()
    assert len(plans) == 1
