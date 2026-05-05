import pytest
from src.infrastructure.security.auth import get_password_hash

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_listar_planos(client):
    response = client.get("/planos/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["nome"] == "Plano Teste"

def test_autenticacao_jwt(client):
    # Usando o banco ficticio de admin (admin:secret123)
    response = client.post("/auth/token", data={"username": "admin", "password": "secret123"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def helper_autenticacao(client):
    response = client.post("/auth/token", data={"username": "admin", "password": "secret123"})
    return response.json()["access_token"]

def test_solicitar_contratacao_sem_token(client):
    payload = {
        "plano_id": 1,
        "cliente": {
            "nome": "João Ninguém",
            "email": "joao@exemplo.com",
            "documento": "123456789"
        }
    }
    response = client.post("/contratacao/", json=payload)
    assert response.status_code == 401 # Rota protegida, sem credentials

def test_solicitar_contratacao_com_token(client):
    token = helper_autenticacao(client)
    payload = {
        "plano_id": 1,
        "cliente": {
            "nome": "João da Silva",
            "email": "joao@email.com",
            "documento": "987654321"
        }
    }
    response = client.post(
        "/contratacao/", 
        json=payload, 
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "sucesso"

def test_upload_arquivo(client):
    arquivo_test = ("teste.txt", b"Conteudo de teste fake")
    response = client.post(
        "/upload/", 
        files={"file": arquivo_test}
    )
    assert response.status_code == 200
    assert "salvo com sucesso" in response.json()["info"]
