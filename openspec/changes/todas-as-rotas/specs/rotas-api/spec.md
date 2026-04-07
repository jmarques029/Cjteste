## ADDED Requirements

### Requirement: Expor rota de listagem de planos
A API SHALL expor o caso de uso `listar_planos` através de um endpoint HTTP GET `/planos`. A rota MUST retornar os planos disponíveis no formato JSON.

#### Scenario: Listagem de planos retornada com sucesso
- **WHEN** o cliente faz uma requisição HTTP GET para o endpoint `/planos`
- **THEN** o sistema retorna status HTTP 200 e a lista em formato JSON dos planos disponíveis

### Requirement: Expor rota de solicitação de contratação
A API SHALL expor o caso de uso `solicitar_contratacao` através de um endpoint HTTP POST `/contratacoes`. A rota MUST aceitar um payload JSON e retornar a confirmação ou erro de validação.

#### Scenario: Contratação solicitada com êxito
- **WHEN** o cliente faz uma requisição HTTP POST para `/contratacoes` com os dados válidos do cliente e plano
- **THEN** o sistema processa a requisição através do caso de uso apropriado, retornando um status 201 (Created) e a mensagem de confirmação

#### Scenario: Falha de validação na contratação 
- **WHEN** o cliente faz a requisição sem enviar dados obrigatórios da contratação
- **THEN** o sistema (Pydantic/FastAPI) intercepta e retorna um status 422 (Unprocessable Entity) com o detalhe do erro
