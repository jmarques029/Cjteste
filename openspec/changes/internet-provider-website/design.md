# Documento de Design

## 1. Arquitetura do Sistema e Clean Architecture

O sistema adota estritamente a **Clean Architecture** no backend (FastAPI) para isolar regras de negócio da estrutura de entrega HTTP e de banco de dados. O fluxo é unilateral (Apresentação -> Casos de Uso -> Domínio):

*   **Domain (Domínio)**: Contém exclusivamente os modelos de dados e regras de negócio puras (representadas por classes `SQLModel`). Não possui nenhuma dependência de infraestrutura externa ou controle de rotas REST.
*   **Use Cases (Serviços / Casos de Uso)**: Camada de orquestração (ex: lógica que decide se a transação do usuário pode ou não ser feita). Conecta-se às camadas vizinhas sem acoplar-se às ferramentas.
*   **Infrastructure (Infraestrutura)**: Camada mais externa responsável pela comunicação concreta. Contém os adaptadores reais, repositórios de contato com banco local e configuração da engine de banco (`sessionmaker` / drivers PostgreSQL).
*   **Interface (API / Presenters)**: A camada de entrega (Routers FastAPI e Models Pydantic estritos). Recebe chamadas HTTP, sanitiza via JSON Schema, chama Use Cases e os traduz em falhas/retornos HTTP. Não invoca o DB diretamente salvo por injeção controlada de ports.

---

## 2. Banco de Dados (PostgreSQL)

A modelagem é definida explicitamente baseada no padrão relacional.

### 2.1 Tabela `plans`
Armazena o catálogo de planos de internet.
*   `id`: `UUID` (Primary Key, geração automática padrão)
*   `name`: `VARCHAR(100)` (Not Null, Constraint Único)
*   `speed_mbps`: `INTEGER` (Not Null, maior que 0)
*   `price`: `NUMERIC(10, 2)` (Not Null, maior ou igual a zero)
*   `description`: `TEXT` (Nullable)
*   `is_active`: `BOOLEAN` (Default `true`, Not Null)
*   **Relacionamento**: Um `plan` possui muitos `subscription_requests` (Foreign Key em 1:N).

### 2.2 Tabela `subscription_requests`
Armazena os leads e solicitações de contratações feitas por clientes.
*   `id`: `UUID` (Primary Key, padrão `uuid4()`)
*   `plan_id`: `UUID` (Foreign Key referenciando nativamente `plans.id`, restrição On Delete: CASCADE)
*   `customer_name`: `VARCHAR(150)` (Not Null)
*   `customer_email`: `VARCHAR(255)` (Not Null)
*   `customer_phone`: `VARCHAR(20)` (Not Null)
*   `customer_address`: `TEXT` (Not Null)
*   `status`: `VARCHAR(50)` (Default: `'pending'`, Not Null)
*   `created_at`: `TIMESTAMP` (Default transacional server time `NOW()`, Not Null)

---

## 3. Contratos de API (SQLModel & Pydantic)

As instâncias base do projeto atuarão por definição do **SQLModel** atuando como schemas da ORM. O mapeamento de interface para Entrada (Input) e Saída (Output) será estritamente controlado não vazando segredos através do **Pydantic**. 

### 3.1 Contratos de Interface (Schemas REST)

*   **`PlanPublic` (Output)**: Contrato de saída de planos. Exclui a exposição de booleans ocultos, devolvendo primariamente a validação contendo `id`, `name`, `speed_mbps`, `price` e `description` via payload `GET`.
*   **`SubscriptionCreate` (Input)**: Contrato de entrada (Payload submetido num método POST). Exige validação de recebimento estrita via Pydantic:
    *   `plan_id`: Forçada verificação por typagem `UUID`.
    *   `customer_name`: Trava de string `min_length=3` a `max_length=150`.
    *   `customer_email`: Submetido a validação sintática forçada usando `EmailStr`.
    *   `customer_phone`: Verificação limitrofe do escopo de 20 caracteres.
    *   `customer_address`: String superior a `min_length=10`.
*   **`SubscriptionPublic` (Output)**: Contrato de sucesso devolvido do Backend para o Frontend listando chaves seguras limitadas `id`, `plan_id` e estado de `status: "pending"`.

---

## 4. Estrutura e Interface do Frontend (Next.js App Router)

### 4.1 Server Components vs Client Components

*   **Server Components** (Arquivos de renderização na Edge/Servidor, omitindo tags cliente):
    *   `app/page.tsx`, `app/layout.tsx`: Arquitetura global Server-Side, injetando otimização primária.
    *   `PlansGrid`: Componente estático isolado e assíncrono projetado a rodar fetch HTTP sem estado global diretamente na API inicial.
    *   `PlanCard`: Componente burro isolado para exibir texto serializado entregue no processo do Grid.

*   **Client Components** (Arquivos usando diretiva de encabeçamento **`"use client"`** com rigor explícito):
    *   `InstallationForm`: Invólucro de UI controlando Hooks (`useState`, `useForm`). Intercepta submissões no envio com eventos (ex: `e.preventDefault()`). Transita visualmente loadings.
    *   Notificações Toasters visuais controladas dinamicamente com base nas respostas HTTP do `fetch()` em erro `422` ou `500`.

### 4.2 Mapeamento de UI (shadcn/ui)

**REGRA CRÍTICA**: A inicialização ou concepção de componentes de interface fora da biblioteca oficial designada é estritamente proibida. Todo o design system será ditado e implementado restritamente pelos componentes catalogados nativos no `shadcn/ui`.

O uso dos componentes será segmentado da seguinte maneira estrutural:

*   **Header Global**
    *   `NavigationMenu`: Para agrupamento estrutural dos links de navegação globais.
    *   `Button`: Ações genéricas do cabeçalho.
    *   `Separator`: Demarcação visual do Header para o restante da página.

*   **Página de Listagem de Planos**
    *   `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`: Container responsável pelo empacotamento das listagens dos produtos da API.
    *   `Button`: Alocado dentro de cada Card para engatilhar a escolha do plano.
    *   `Badge`: Usado como destaque gráfico de velocidade ou tags ativas.

*   **Página de Contratação (Installation/Lead Form)**
    *   `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`: Esqueleto integrado e validado do formulário.
    *   `Input`: Campos estritos para `customer_name`, `customer_email`, `customer_phone`.
    *   `Textarea`: Campo robusto atrelado ao `customer_address`.
    *   `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`: Para confirmação de vinculação de Plano na tela.
    *   `Button`: Input de submit validando UI State (animação e bloqueio inativo).
    *   `Toast` e `useToast`: Micro-Notificações ativadas perante erro 500 originados da API ou validação de formulário (Sucesso).

---

## 5. Orquestração e Infraestrutura (Docker)

O sistema opera sobre uma única `network` customizada estanque unindo isoladamente os três contêineres e controlando seus escapes.

### 5.1 Redes Docker (`networks`)
- O projeto assina a estrutura com a rede declarativa no modelo `bridge`, travando as chamadas até que portas exponham saídas ou entradas ao Host, impedindo o web server de ver diretamente o `db`.

### 5.2 Topologia de 3 Serviços

*   **1. `db` (Banco PostgreSQL)**
    *   **Portas Locais**: `5432` da network. Não expõe o banco diretamente na web via máquina Host.
    *   **Variáveis**: `POSTGRES_USER=appuser`, `POSTGRES_PASSWORD=apppass`, `POSTGRES_DB=providerdb`.
    *   **Volumes**: Mapeamento nomeado em persistence path root do linux local.

*   **2. `api` (Backend FastAPI HTTP)**
    *   **Dependência (`depends_on`)**: Ligado com o readiness e boot originários do `db`.
    *   **Portas**: Exposto na porta `8000:8000` (portando permissão via Host local para o navegador bater).
    *   **Variáveis**: `DATABASE_URL=postgresql+psycopg2://appuser:apppass@db:5432/providerdb`.

*   **3. `web` (Frontend Next.js Node)**
    *   **Dependência (`depends_on`)**: Espera a `api`.
    *   **Portas**: Trava a porta Node SSR em `3000:3000` exposta na interface do Host final.
    *   **Variáveis**: `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1` (rota liberada ao Client Web), `API_INTERNAL_URL=http://api:8000/api/v1` (acesso isolado do contêiner para o container `api` via bridge em Server Components).
