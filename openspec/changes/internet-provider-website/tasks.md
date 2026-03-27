# Tarefas de Implementação

## 1. Docker-compose
- [ ] 1.1. Criar arquivo `docker-compose.yml` base na raiz do projeto.
- [ ] 1.2. Configurar container `db` usando imagem oficial do PostgreSQL 15, expondo porta local 5432.
- [ ] 1.3. Configurar container `api` (FastAPI) mapeando porta 8000.
- [ ] 1.4. Configurar container `web` (Next.js) mapeando porta 3000.
- [ ] 1.5. Configurar variáveis de ambiente de conexão do banco (`POSTGRES_USER`, etc.) no Compose.
- [ ] **Validação:** Subir a orquestração (`docker-compose up -d`) e rodar comando `docker ps` para garantir que `db`, `api` e `web` estão `Up`.

## 2. Banco de Dados
- [ ] 2.1. Criar o diretório `backend/app/infrastructure` para abrigar a conexão de dados.
- [ ] 2.2. Configurar a engine do banco de dados (SQLAlchemy `create_engine`) utilizando `DATABASE_URL` repassada pelo compose.
- [ ] 2.3. Configurar a Session base local para manusear as queries.
- [ ] 2.4. Inicializar uma migration base ou criar as tabelas explicitamente via script em tempo de execução.
- [ ] **Validação:** Rodar script de health-check local efetuando `SELECT 1` no banco via script Python conectado à infraestrutura.

## 3. Domínio (TDD)
- [ ] 3.1. Escrever caso de teste unitário verificando contratos da Entidade de Domínio `Plan`.
- [ ] 3.2. Criar tabela SQLModel/Classe `Plan` em `backend/app/domain/models.py` contendo atributos (`id`, `name`, `speed_mbps`, `price`, `is_active`).
- [ ] 3.3. Escrever caso de teste unitário para validar relacionamentos e chaves da Entidade `SubscriptionRequest`.
- [ ] 3.4. Criar tabela SQLModel/Classe `SubscriptionRequest` com Foreign Key referenciando `plans.id`.
- [ ] **Validação:** Rodar suíte de testes unitários testando se as instâncias do domínio carregam sem falhas com dados mockados.

## 4. Casos de Uso (TDD)
- [ ] 4.1. Escrever teste unitário para Use Case de "Listar Planos" (Testar se inativos são omitidos).
- [ ] 4.2. Implementar `ListPlansUseCase` acessando a interface do repositório de BD para devolver planos ativos.
- [ ] 4.3. Escrever teste unitário para Use Case de "Solicitar Contratação" aferindo bloqueios por formatos estritos.
- [ ] 4.4. Implementar `CreateSubscriptionUseCase` validando inputs primários e despachando ao repositório.
- [ ] **Validação:** Confirmar que os cenários mapeiam 100% de passagem nos testes unitários das regras de negócio limpas rodando Pytest isolado.

## 5. Componentes da API - Schemas (TDD)
- [ ] 5.1. Escrever testes validando as restrições (`min_length`, formato `EmailStr`) injetadas via Pydantic instanciando objetos inválidos.
- [ ] 5.2. Criar os Schemas Pydantic de entrada `SubscriptionCreate` (Input).
- [ ] 5.3. Criar os Schemas Pydantic de saída `PlanPublic` e `SubscriptionPublic` (Output).
- [ ] **Validação:** Confirmar no Pytest que instanciar o schema falha devolvendo erro formatado `ValidationError` nativo para dados incorretos e passa com dados corretos.

## 6. Rotas (TDD)
- [ ] 6.1. Escrever testes de API usando FastAPI `TestClient` para o roteador `GET /api/v1/plans`.
- [ ] 6.2. Implementar a rota mapeando o serviço de injeção de dependência do `ListPlansUseCase`.
- [ ] 6.3. Escrever testes de API testando retornos HTTP 200, HTTP 422 em submits quebrados e HTTP 500 para falha de banco no endpoint `POST /api/v1/subscriptions`.
- [ ] 6.4. Implementar a rota correspondente traduzindo a lógica de validação do Pydantic aos códigos de Status.
- [ ] 6.5. Adicionar middleware de CORS para permitir acessos HTTP vindos do Frontend Node.js.
- [ ] **Validação:** Acessar localhost na rota `/docs` do Swagger UI nativo e rodar submits via navegador, confirmando recebimento pela API real.

## 7. Testes de Integração
- [ ] 7.1. Desenvolver uma `fixture` no Pytest para mockar um DB transacional paralelo antes de chamar Endpoints.
- [ ] 7.2. Criar pipeline de teste integrado submetendo um `POST` com E-mail via `TestClient` e certificando se o banco real gerou um registro na tabela.
- [ ] 7.3. Escrever teste validando uma listagem completa conectada ao DB povoado simulando a chamada local.
- [ ] **Validação:** Obter Passed em todo o diretório local via `pytest` sem acoplar a execução no banco transnacional em Produção.
