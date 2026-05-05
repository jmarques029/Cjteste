import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.infrastructure.db.database import Base
from src.infrastructure.api.dependencies import get_db
from main import app
from src.infrastructure.db.models import PlanoModel, ClienteModel

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

from sqlalchemy.pool import StaticPool

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    
    # Criar registro base de plano para usar nos testes
    plano_teste = PlanoModel(nome="Plano Teste", preco=50.0, velocidade_mbps=100)
    session.add(plano_teste)
    session.commit()
    
    yield session
    
    session.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
            
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
