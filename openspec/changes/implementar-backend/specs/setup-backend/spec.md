## ADDED Requirements

### Requirement: Docker Environment for FastAPI
O sistema DEVE rodar em um ambiente isolado via Docker contendo Python e as dependências (FastAPI, uvicorn, pytest).

#### Scenario: Running the application
- **WHEN** o comando `docker compose up` for executado
- **THEN** o container do backend DEVE iniciar e expor a API na porta configurada

#### Scenario: Running tests
- **WHEN** o comando para rodar testes no container for executado
- **THEN** o pytest DEVE rodar com sucesso dentro do ambiente Docker
