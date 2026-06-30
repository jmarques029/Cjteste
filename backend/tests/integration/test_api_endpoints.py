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
    response = client.post(
        "/auth/token", data={"username": "admin", "password": "secret123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def helper_autenticacao(client):
    response = client.post(
        "/auth/token", data={"username": "admin", "password": "secret123"}
    )
    return response.json()["access_token"]


def test_solicitar_contratacao_sem_token(client):
    payload = {
        "plano_id": 1,
        "cliente": {
            "nome": "João Ninguém",
            "email": "joao@exemplo.com",
            "documento": "123456789",
        },
    }
    response = client.post("/contratacao/", json=payload)
    assert response.status_code == 401  # Rota protegida, sem credentials


def test_solicitar_contratacao_com_token(client):
    token = helper_autenticacao(client)
    payload = {
        "plano_id": 1,
        "cliente": {
            "nome": "João da Silva",
            "email": "joao@email.com",
            "documento": "987654321",
        },
    }
    response = client.post(
        "/contratacao/", json=payload, headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "sucesso"


def test_upload_arquivo(client):
    arquivo_test = ("teste.pdf", b"%PDF-1.4 conteudo fake", "application/pdf")
    response = client.post("/upload/", files={"file": arquivo_test})
    assert response.status_code == 200
    assert "salvo com sucesso" in response.json()["info"]


def test_cliente_cadastro_e_login(client):
    payload = {
        "nome": "Cliente Teste",
        "email": "cliente@teste.com",
        "documento": "12345678901",
        "telefone": "11999999999",
        "senha": "password123",
        "endereco": {
            "cep": "12345-678",
            "logradouro": "Rua das Flores",
            "numero": "123",
            "complemento": "Apto 42",
            "bairro": "Centro",
            "cidade": "São Paulo",
            "estado": "SP",
        },
    }

    # Register client
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 201
    assert response.json()["status"] == "sucesso"

    # Login with email
    response_login = client.post(
        "/auth/token", data={"username": "cliente@teste.com", "password": "password123"}
    )
    assert response_login.status_code == 200
    assert "access_token" in response_login.json()

    # Login with document
    response_login2 = client.post(
        "/auth/token", data={"username": "12345678901", "password": "password123"}
    )
    assert response_login2.status_code == 200
    assert "access_token" in response_login2.json()

    # Duplicate registration should fail
    response_dup = client.post("/auth/register", json=payload)
    assert response_dup.status_code == 400
