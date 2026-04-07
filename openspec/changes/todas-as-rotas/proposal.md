## Why

Atualmente, temos a infraestrutura básica do FastAPI e os casos de uso de negócio (`listar_planos` e `solicitar_contratacao`) implementados no backend. No entanto, estes casos de uso ainda não foram expostos como rotas HTTP na API. Precisamos integrar o domínio e os casos de uso com os endpoints expostos no arquivo `main.py` para permitir que o frontend ou outros clientes consumam esses serviços.

## What Changes

- Serão criadas rotas no FastAPI para expor as funcionalidades da aplicação.
- Criação de modelos Pydantic no FastAPI para requisição e resposta das rotas.
- Injeção das dependências e uso dos repositórios para conectar a camada de casos de uso às rotas.
- Modificação do `main.py` (ou separação em `routers`) para registrar as seguintes rotas:
  - `GET /planos` -> Para listar os planos disponíveis.
  - `POST /contratacoes` -> Para solicitar a contratação de um plano.

## Capabilities

### New Capabilities
- `rotas-api`: Roteamento HTTP para os casos de uso na API utilizando o FastAPI (integrando `listar_planos` e `solicitar_contratacao`).

### Modified Capabilities

## Impact

Essas adições não representarão *breaking changes* a sistemas existentes, dado que a aplicação está sendo construída. O principal impacto no código será nas camadas de Interface/API (FastAPI controllers), integrando-se com os módulos que já existem nas pastas `src/use_cases/` e `src/domain/`.
