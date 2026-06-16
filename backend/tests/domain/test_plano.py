import pytest

from src.domain.plano import Plano


def test_plano_criacao_valida():
    plano = Plano(id=1, nome="Fibra 500 Mega", preco=99.90, velocidade_mbps=500)
    assert plano.id == 1
    assert plano.nome == "Fibra 500 Mega"
    assert plano.preco == 99.90
    assert plano.velocidade_mbps == 500


def test_plano_preco_negativo():
    with pytest.raises(ValueError, match="Preço não pode ser negativo"):
        Plano(id=2, nome="Plano Grátis", preco=-10.0, velocidade_mbps=100)
