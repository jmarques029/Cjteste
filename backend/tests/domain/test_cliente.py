import pytest

from src.domain.cliente import Cliente


def test_cliente_criacao_valida():
    cliente = Cliente(
        id=1, nome="João Silva", email="joao@example.com", documento="12345678901"
    )
    assert cliente.id == 1
    assert cliente.nome == "João Silva"
    assert cliente.email == "joao@example.com"
    assert cliente.documento == "12345678901"


def test_cliente_email_invalido():
    with pytest.raises(ValueError, match="Email inválido"):
        Cliente(id=2, nome="Maria", email="maria-sem-arroba", documento="11122233344")
