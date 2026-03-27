## 1. Setup Infraestrutura Docker e FastAPI

- [x] 1.1 Criar `Dockerfile` focado em Python 3.11+ para FastAPI
- [x] 1.2 Criar `docker-compose.yml` mapeando volumes para desenvolvimento local
- [x] 1.3 Arquivo `requirements.txt` ou `pyproject.toml` com dependências iniciais (fastapi, uvicorn, pytest)
- [x] 1.4 Estruturar pastas base: `src/domain`, `src/use_cases`, `src/infrastructure`, `tests/`
- [x] 1.5 Criar um endpoint de health check `main.py` para validar o setup via Docker

## 2. Camada de Domínio (TDD)

- [x] 2.1 Escrever testes unitários em `tests/domain/` para entidades core do provedor (ex: Plano, Cliente)
- [x] 2.2 Executar testes via Docker (`docker compose run backend pytest`) e garantir que falhem
- [x] 2.3 Implementar as entidades em `src/domain/` para satisfazer os testes
- [x] 2.4 Executar testes via Docker e garantir que passem

## 3. Camada de Casos de Uso (TDD)

- [ ] 3.1 Escrever testes unitários em `tests/use_cases/` mockando contratos de repositórios (ex: ListarPlanos, SolicitarContratacao)
- [ ] 3.2 Executar testes via Docker e garantir que falhem
- [ ] 3.3 Implementar os casos de uso em `src/use_cases/`
- [ ] 3.4 Executar testes via Docker e garantir que passem
