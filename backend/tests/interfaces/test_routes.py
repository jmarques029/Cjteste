import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "API is running"}

def test_get_plans():
    response = client.get("/api/v1/plans")
    assert response.status_code == 200
    # Como não temos DB mockado no nível do FastAPI aqui ainda (depende de injeção),
    # verificaremos apenas se retorna uma lista.
    assert isinstance(response.json(), list)
