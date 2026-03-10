## 1. Project Setup & Infrastructure

- [ ] 1.1 Scaffold Next.js frontend with TailwindCSS and Shadcn/UI
- [ ] 1.2 Scaffold FastAPI backend project structure
- [ ] 1.3 Setup Docker Compose with PostgreSQL and FastAPI services
- [ ] 1.4 Configure CORS in FastAPI for Next.js local development

## 2. Database & Data Modeling

- [ ] 2.1 Setup SQLAlchemy or SQLModel for database connection
- [ ] 2.2 Create User model and migration (Alembic)
- [ ] 2.3 Create Plan model and migration
- [ ] 2.4 Create Lead model and migration

## 3. Backend: Auth & Plan Management API

- [ ] 3.1 Implement OAuth2 password bearer flow for admin login
- [ ] 3.2 Create POST /api/v1/admin/plans endpoint
- [ ] 3.3 Create GET /api/v1/admin/plans endpoint with pagination
- [ ] 3.4 Create PUT and PATCH endpoints for updating plans
- [ ] 3.5 Create GET /api/v1/plans public endpoint for vitrine

## 4. Backend: Lead Capture API

- [ ] 4.1 Create GET /api/v1/coverage/{zip_code} proxy endpoint mapping ViaCEP/BrasilAPI
- [ ] 4.2 Create POST /api/v1/checkout/leads endpoint returning WhatsApp URL
- [ ] 4.3 Create GET and PATCH endpoints for admin lead management

## 5. Frontend: Admin Panel

- [ ] 5.1 Implement login page and JWT session management
- [ ] 5.2 Implement admin layout and navigation
- [ ] 5.3 Implement Plans management list and create/edit forms
- [ ] 5.4 Implement Leads management list and status toggle

## 6. Frontend: Public Vitrine & Autoatendimento

- [ ] 6.1 Implement public landing page fetching active plans
- [ ] 6.2 Implement lead capture form with CEP auto-complete
- [ ] 6.3 Implement WhatsApp redirect upon successful lead submission
