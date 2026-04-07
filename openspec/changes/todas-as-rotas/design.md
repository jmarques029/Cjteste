## Context

Temos implementados dois casos de uso no backend de nossa aplicação: `listar_planos` e `solicitar_contratacao`. Para que o sistema seja utilizável, precisamos expor as rotas associadas através do framework FastAPI.

## Goals / Non-Goals

**Goals:**
- Configurar endpoints no FastAPI para os casos de uso já criados.
- Criar esquemas Pydantic correspondentes aos inputs/outputs da API.
- Garantir a injeção de dependências para chamar os casos de uso adequadamente.

**Non-Goals:**
- Não iremos refatorar a infraestrutura de banco de dados neste momento.
- Não iremos introduzir autenticação/autorização nesses endpoints ainda.

## Decisions

- **Localização das rotas**: Para o momento, as rotas poderão ser registradas diretamente no arquivo `main.py` com o decorator `app`. Se futuramente existirem muitas rotas, deverão ser movidas para a pasta `routers`.
- **Validação de Entrada e Saída**: O Pydantic será usado para validar automaticamente a requisição (`POST /contratacoes`) e também definir a estrutura de retorno para os planos (`GET /planos`).
- **Instanciação de Repositórios**: Como ainda estamos dependendo de instâncias de repositórios possivelmente mockados ou que precisem de setup do banco, faremos a instância deles no endpoint ou injetaremos via *Depends* do FastAPI.

## Risks / Trade-offs

- **Risk**: As dependências dos casos de uso (como Repositories) precisam ser instanciadas.
- **Trade-off**: Usar persistência em memória (ou SQLite simples) até a configuração final do banco Postgres com SQLAlchemy ou similar.
