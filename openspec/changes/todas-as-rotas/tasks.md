## 1. Pydantic Models

- [ ] 1.1 Criar schemas para a requisição de `/contratacoes` (`ContratacaoRequest`)
- [ ] 1.2 Criar schemas para a resposta de `/planos` e `/contratacoes` (`PlanoResponse`, `ContratacaoResponse`)

## 2. Dependências e Instanciação

- [ ] 2.1 Configurar funções `get_repositorio` para injeção de dependência na API
- [ ] 2.2 Configurar injeção de dependência para a criação das instâncias dos use cases (`listar_planos` e `solicitar_contratacao`)

## 3. Roteamento FastAPI

- [ ] 3.1 Implementar a rota `GET /planos` em `main.py`
- [ ] 3.2 Implementar a rota `POST /contratacoes` em `main.py`

## 4. Testes e Ajustes Finais

- [ ] 4.1 Fazer chamadas manuais (cURL ou REST Client) para a rota `/planos`
- [ ] 4.2 Fazer chamadas manuais para a rota `/contratacoes`
- [ ] 4.3 Ajustar tratamento de exceções (Domain Exceptions -> HTTP 422/400)
