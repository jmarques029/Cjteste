# MVP Provedor de Internet - Projeto 60 Horas

## Resumo do Entendimento (Understanding Summary)
* **Objetivo:** Construir um MVP (Prova de Conceito) focado no Autoatendimento de um Provedor de Internet.
* **Escopo Temporal:** Máximo de 60 horas.
* **Requisitos Core:** Demonstração de CRUD (Painel Administrativo para Planos/Leads) e Consumo de API Externa (Busca de Endereço via CEP).
* **Público-Alvo:** Clientes finais interessados (B2C) e o Administrador (dono do provedor).
* **Restrições Acordadas:**
  * Sem gateway de pagamento transacional nesta versão.
  * O "Chat" de atendimento será um redirecionamento inteligente final para a API do WhatsApp.
  * Autenticação e painel focados apenas no administrador (os clientes finais se convertem como 'Leads', sem painel próprio de auto-gestão pós-compra no MVP).

## Premissas (Assumptions)
* **Stack Front-end:** Next.js (React), TypeScript, TailwindCSS, Shadcn/UI.
* **Stack Back-end:** Python, FastAPI, Documentação nativa do Swagger/OpenAPI.
* **Infraestrutura:** PostgreSQL rodando sobre orquestração do Docker.
* **Testes:** Vitest para o Frontend e Pytest para a API.
* **Desempenho/Escala:** O foco atual é a corretude arquitetural, integração e padronização visual.

## Decision Log
1. **Arquitetura Desacoplada:** Rejeitadas as abordagens Fullstack monolítica e Next.js com BFF em favor de uma API Restful purista no FastAPI atuando de forma totalmente independente e desacoplada do Next.js.
2. **Escopo do CRUD:** A entidade principal "Plano de Internet" será a mola mestre gerida pelo Front-end (Admin) e consumida estaticamente pela Vitrine.
3. **Escopo do Consumo de API:** A consulta do ViaCEP/BrasilAPI será intermediada pelo back-end no FastAPI por questões de consistência, evitando exposição direta do lado do cliente.

## Final Design (Arquitetura e Contrato)

### 1. Modelagem de Dados Relacional
O schema inicial base contará com 3 entidades:
* **`plans` (Planos de Internet):**
  * Campos: `id` (UUID), `name` (String), `speed_down` (Int), `speed_up` (Int), `price` (Decimal), `is_active` (Bool).
* **`leads` (Oportunidades ou Solicitações):**
  * Campos: `id` (UUID), `plan_id` (FK), `full_name` (String), `cpf` (String), `phone_whatsapp` (String), `zip_code` (String), endereço em texto validado (Rua, Número, Bairro, Cidade), e o status do lead (`PENDING`, `CONTACTED`, `INSTALLED`, `CANCELED`).
* **`users` (Administração):**
  * Campos: `id` (UUID), `email` (String único), `hashed_password` (String), `is_admin` (Bool).

### 2. Endpoints (Principais)
**Serviços Públicos:**
* `GET /api/v1/plans`: Retorna os planos. Suporta filtros dinâmicos via query params (`min_speed`, `sort`).
* `GET /api/v1/plans/{id}`: Detalhes de um plano único.
* `GET /api/v1/coverage/{zip_code}`: Endereço validado a partir do CEP consumindo API de terceiro internamente via Proxy.
* `POST /api/v1/checkout/leads`: Finaliza o fluxo do cliente enviando a intenção de cadastro. Cria o Lead no Postgre e retorna o protocolo e a URL mapeada do WhatsApp.

**Serviços Administrativos (Exigem JWT Bearer):**
* `POST /api/v1/auth/token`: Padrão OAuth2, devolvendo Token JWT.
* `GET /api/v1/auth/me`: Quem sou eu (Sessão do Admin).
* `POST /api/v1/admin/plans`: Criação.
* `GET /api/v1/admin/plans`: Lista absoluta (com inativos, habilitando paginação `skip/limit`).
* `PUT /api/v1/admin/plans/{id}`: Edita propriedades plenas.
* `PATCH /api/v1/admin/plans/{id}/status`: Toggle para ativar/inativar rapidamente da vitrine.
* `GET /api/v1/admin/leads`: Visualização e filtro de interessados.
* `PATCH /api/v1/admin/leads/{id}/status`: Movimentação do funil de atendimento do cliente.
