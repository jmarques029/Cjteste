# CJnet - Documentação do Projeto

## Visão Geral

Aplicação full-stack de um provedor de internet (ISP) chamado **CJnet**, permitindo visualização de planos, cadastro de clientes e solicitação de instalação via fibra óptica.

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Backend** | Python 3.11 + FastAPI + SQLAlchemy |
| **Frontend** | Next.js 16.2 (App Router) + React 19 + TypeScript |
| **ORM** | SQLAlchemy 2.0 + Alembic |
| **Validação** | Pydantic 2 (backend) / Value Objects (frontend) |
| **Auth** | JWT (PyJWT) + bcrypt (passlib) |
| **Banco** | PostgreSQL 15 (Docker) / SQLite (dev local) |
| **Estilos** | Tailwind CSS v4 |
| **Testes** | pytest (backend) / Vitest + Testing Library (frontend) |
| **Container** | Docker + docker-compose |
| **Deploy** | Render |

---

## Arquitetura

### Backend — Clean Architecture

```
backend/
├── main.py                         # Entrypoint FastAPI
├── src/
│   ├── domain/                     # Entidades e interfaces de repositório
│   │   ├── cliente.py              #   Cliente (Pydantic)
│   │   ├── plano.py                #   Plano (Pydantic)
│   │   └── repositories.py         #   Interfaces abstratas (ABC)
│   ├── use_cases/                  # Casos de uso
│   │   ├── listar_planos.py        #   Listar planos
│   │   └── solicitar_contratacao.py # Solicitar contratação
│   └── infrastructure/
│       ├── api/
│       │   ├── routers/            #   Rotas FastAPI
│       │   ├── schemas/schemas.py  #   Schemas Pydantic de request/response
│       │   └── dependencies.py     #   DB session + auth JWT
│       ├── db/
│       │   ├── database.py         #   Engine SQLAlchemy
│       │   ├── models.py           #   Modelos ORM
│       │   └── repositories/       #   Implementações dos repositórios
│       └── security/auth.py        #   JWT + password hashing
└── tests/
    ├── domain/                     # Testes de entidades
    ├── use_cases/                  # Testes de casos de uso
    └── integration/                # Testes de integração da API
```

### Frontend — Clean Architecture + DDD

```
frontend/src/
├── app/                            # Next.js App Router (pages)
│   ├── layout.tsx                  # Root layout com QueryProvider
│   ├── page.tsx                    # Home page
│   ├── cadastro/page.tsx           # Página de cadastro
│   └── components/                 # Componentes de página
├── domain/                         # Camada de domínio
│   ├── entities/                   #   Cliente, Contratacao
│   ├── value-objects/              #   Nome, Email, Documento
│   ├── repositories/               #   Interfaces de repositório
│   └── errors/                     #   Hierarquia de erros
├── application/                    # Casos de uso
│   └── use-cases/                  #   SolicitarContratacao, Login
├── infrastructure/                 # Infraestrutura
│   ├── http/HttpClient.ts          #   Cliente HTTP genérico
│   ├── repositories/               #   Implementações dos repositórios
│   ├── storage/BrowserStorage.ts   #   localStorage para JWT
│   └── di/container.ts             #   Injeção de dependência
└── presentation/                   # Camada de apresentação
    ├── hooks/                      #   React Query hooks (usePlanos, useAuth, useContratacao)
    ├── components/                 #   QueryProvider
```

---

## Como Rodar

### Local (desenvolvimento)

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Docker
```bash
docker-compose up --build
```

### Variáveis de Ambiente

| Variável | Obrigatório | Padrão | Descrição |
|---|---|---|---|
| `DATABASE_URL` | Não | `sqlite:///./test.db` | URL de conexão do banco |
| `JWT_SECRET` | Não | `sua-chave-secreta-de-desenvolvimento` | Chave secreta para assinar JWT |
| `NEXT_PUBLIC_API_URL` | Não | `http://localhost:8000` | URL da API para o frontend |

---

## API Endpoints

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/health` | Não | Health check |
| `GET` | `/planos/` | Não | Listar todos os planos |
| `POST` | `/auth/token` | Não | Login (body: `username` + `password`) |
| `POST` | `/contratacao/` | JWT | Solicitar contratação de plano |
| `POST` | `/upload/` | Não | Upload de arquivo |

### Credenciais de Desenvolvimento
- **Usuário:** `admin`
- **Senha:** `secret123`

---

## Scripts Independentes

A raiz do projeto contém scripts auxiliares não relacionados ao app principal:

| Script | Finalidade |
|---|---|
| `fetch_pdfs.py` | Baixa PDFs de deliberações do CEFET-MG |
| `search.py` | Scrape da página SISU da UNIFAL-MG |
| `check_pdfs.py` | Verifica se PDFs são texto ou imagem |
| `extract_all.py` | Extrai texto de PDFs |
| `create_exam.py` | Gera prova de Estrutura de Dados (.docx) |
| `search_ig.py` | Busca perfis no Instagram via DuckDuckGo |
| `search_ufla.py` | Busca pessoas no site da UFLA |

---

## Testes

### Backend (pytest)
```bash
cd backend
pytest -v --cov=src
```

### Frontend (Vitest)
```bash
cd frontend
npm test
```

---

## Estrutura do Banco

### `planos`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | Integer (PK) | ID do plano |
| `nome` | String | Nome do plano |
| `preco` | Float | Preço mensal |
| `velocidade_mbps` | Integer | Velocidade em Mbps |

### `clientes`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | Integer (PK) | ID do cliente |
| `nome` | String | Nome completo |
| `email` | String (unique) | E-mail |
| `documento` | String (unique) | CPF/CNPJ |
| `documento_url` | String (nullable) | Caminho do upload |

---

## Pontos de Atenção

- **CORS** configurado com `allow_origins=["*"]` — restringir em produção
- **Alembic** configurado mas sem migrations — `main.py` usa `create_all` diretamente
- **JWT** com fallback fraco no código — usar apenas via variável de ambiente em produção
- **Upload** sem validação de tipo/tamanho de arquivo
- **Scripts de PDF** desabilitam verificação SSL (`verify=False`)
