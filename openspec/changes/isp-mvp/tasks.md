## 1. Configuração do Projeto, Infraestrutura e Ferramentas de Teste

- [ ] 1.1 Configurar frontend Next.js com TailwindCSS, Shadcn/UI e framework de testes (Jest/Vitest)
- [ ] 1.2 Configurar estrutura do projeto backend FastAPI e configurar Pytest
- [ ] 1.3 Configurar Docker Compose com PostgreSQL e serviços FastAPI
- [ ] 1.4 Configurar CORS no FastAPI para desenvolvimento local com Next.js

## 2. Banco de Dados e Modelagem de Dados (TDD)

- [ ] 2.1 Configurar SQLAlchemy ou SQLModel para conexão com o banco de dados
- [ ] 2.2 [RED] Escrever testes unitários para o esquema e validação do modelo User (Usuário)
- [ ] 2.3 [GREEN/REFACTOR] Criar modelo User e migração (Alembic)
- [ ] 2.4 [RED] Escrever testes unitários para o esquema e validação do modelo Plan (Plano)
- [ ] 2.5 [GREEN/REFACTOR] Criar modelo Plan e migração
- [ ] 2.6 [RED] Escrever testes unitários para o esquema e validação do modelo Lead
- [ ] 2.7 [GREEN/REFACTOR] Criar modelo Lead e migração

## 3. Backend: API de Autenticação e Gerenciamento de Planos (TDD)

- [ ] 3.1 [RED] Escrever testes para o fluxo OAuth2 password bearer de login do administrador
- [ ] 3.2 [GREEN/REFACTOR] Implementar fluxo OAuth2 password bearer para login do administrador
- [ ] 3.3 [RED] Escrever testes para o endpoint POST /api/v1/admin/plans
- [ ] 3.4 [GREEN/REFACTOR] Criar endpoint POST /api/v1/admin/plans
- [ ] 3.5 [RED] Escrever testes para o endpoint GET /api/v1/admin/plans com paginação
- [ ] 3.6 [GREEN/REFACTOR] Criar endpoint GET /api/v1/admin/plans com paginação
- [ ] 3.7 [RED] Escrever testes para os endpoints PUT e PATCH de atualização de planos
- [ ] 3.8 [GREEN/REFACTOR] Criar endpoints PUT e PATCH para atualização de planos
- [ ] 3.9 [RED] Escrever testes para o endpoint público GET /api/v1/plans da vitrine
- [ ] 3.10 [GREEN/REFACTOR] Criar endpoint público GET /api/v1/plans para a vitrine

## 4. Backend: API de Captura de Leads (TDD)

- [ ] 4.1 [RED] Escrever testes para o endpoint de proxy GET /api/v1/coverage/{zip_code}
- [ ] 4.2 [GREEN/REFACTOR] Criar endpoint de proxy GET /api/v1/coverage/{zip_code} mapeando ViaCEP/BrasilAPI
- [ ] 4.3 [RED] Escrever testes para o endpoint POST /api/v1/checkout/leads
- [ ] 4.4 [GREEN/REFACTOR] Criar endpoint POST /api/v1/checkout/leads retornando a URL do WhatsApp
- [ ] 4.5 [RED] Escrever testes para os endpoints GET e PATCH de gerenciamento de leads pelo administrador
- [ ] 4.6 [GREEN/REFACTOR] Criar endpoints GET e PATCH para gerenciamento de leads pelo administrador

## 5. Frontend: Painel Administrativo (TDD)

- [ ] 5.1 [RED] Escrever testes para a página de login e gerenciamento de sessão JWT
- [ ] 5.2 [GREEN/REFACTOR] Implementar página de login e gerenciamento de sessão JWT
- [ ] 5.3 [RED] Escrever testes para o layout e navegação do administrador
- [ ] 5.4 [GREEN/REFACTOR] Implementar layout e navegação do administrador
- [ ] 5.5 [RED] Escrever testes para a lista de gerenciamento de Planos e formulários de criação/edição
- [ ] 5.6 [GREEN/REFACTOR] Implementar lista de gerenciamento de Planos e formulários de criação/edição
- [ ] 5.7 [RED] Escrever testes para a lista de gerenciamento de Leads e alternância de status (toggle)
- [ ] 5.8 [GREEN/REFACTOR] Implementar lista de gerenciamento de Leads e alternância de status

## 6. Frontend: Vitrine Pública e Autoatendimento (TDD)

- [ ] 6.1 [RED] Escrever testes para a landing page pública que busca os planos ativos
- [ ] 6.2 [GREEN/REFACTOR] Implementar landing page pública que busca os planos ativos
- [ ] 6.3 [RED] Escrever testes para o formulário de captura de leads com preenchimento automático de CEP
- [ ] 6.4 [GREEN/REFACTOR] Implementar formulário de captura de leads com preenchimento automático de CEP
- [ ] 6.5 [RED] Escrever testes para o redirecionamento ao WhatsApp após envio de lead com sucesso
- [ ] 6.6 [GREEN/REFACTOR] Implementar redirecionamento ao WhatsApp após envio de lead com sucesso
