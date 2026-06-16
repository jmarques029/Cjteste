from unittest.mock import Mock

import pytest

from src.domain.cliente import Cliente
from src.domain.plano import Plano
from src.use_cases.solicitar_contratacao import SolicitarContratacaoUseCase


def test_solicitar_contratacao_plano_inexistente():
    repo_plano = Mock()
    repo_cliente = Mock()
    repo_plano.buscar_por_id.return_value = None

    use_case = SolicitarContratacaoUseCase(repo_plano, repo_cliente)

    with pytest.raises(ValueError, match="Plano não encontrado"):
        use_case.executar(
            plano_id=99,
            cliente_dados={"nome": "A", "email": "a@a.com", "documento": "123"},
        )


def test_solicitar_contratacao_sucesso():
    repo_plano = Mock()
    repo_cliente = Mock()

    plano_mock = Plano(id=1, nome="Fibra", preco=100.0, velocidade_mbps=200)
    repo_plano.buscar_por_id.return_value = plano_mock
    repo_cliente.salvar.return_value = Cliente(
        id=1, nome="A", email="a@a.com", documento="123"
    )

    use_case = SolicitarContratacaoUseCase(repo_plano, repo_cliente)

    resultado = use_case.executar(
        plano_id=1, cliente_dados={"nome": "A", "email": "a@a.com", "documento": "123"}
    )

    assert resultado["status"] == "sucesso"
    assert resultado["cliente_id"] == 1
    repo_plano.buscar_por_id.assert_called_once_with(1)
