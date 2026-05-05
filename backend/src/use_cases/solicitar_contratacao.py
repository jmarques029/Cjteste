from src.domain.repositories import PlanoRepository, ClienteRepository
from src.domain.cliente import Cliente

class SolicitarContratacaoUseCase:
    def __init__(self, repo_plano: PlanoRepository, repo_cliente: ClienteRepository):
        self.repo_plano = repo_plano
        self.repo_cliente = repo_cliente
        
    def executar(self, plano_id: int, cliente_dados: dict) -> dict:
        plano = self.repo_plano.buscar_por_id(plano_id)
        if not plano:
            raise ValueError("Plano não encontrado")
            
        cliente = Cliente(id=0, **cliente_dados)
        cliente_salvo = self.repo_cliente.salvar(cliente)
        
        return {
            "status": "sucesso",
            "cliente_id": cliente_salvo.id,
            "mensagem": f"Plano {plano.nome} contratado com sucesso."
        }
