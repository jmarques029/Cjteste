from unittest.mock import Mock

from src.domain.plano import Plano
from src.use_cases.listar_planos import ListarPlanosUseCase


def test_listar_planos_retorna_lista_com_sucesso():
    repo_mock = Mock()
    planos_mock = [Plano(id=1, nome="Fibra", preco=100.0, velocidade_mbps=200)]
    repo_mock.listar_todos.return_value = planos_mock

    use_case = ListarPlanosUseCase(repo_mock)
    resultado = use_case.executar()

    assert len(resultado) == 1
    assert resultado[0].nome == "Fibra"
    repo_mock.listar_todos.assert_called_once()
