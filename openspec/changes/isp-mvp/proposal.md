## Why

The purpose is to build an MVP (Proof of Concept) for an Internet Service Provider (ISP) self-service flow within a strict 60-hour timeframe, validating CRUD capabilities and external API consumption skills. This solves the need for a realistic portfolio/MVP project that demonstrates full-stack architecture decoupling, relational database modeling, and third-party integrations (CEP).

## What Changes

- Create a public self-service flow for customers to check internet coverage using external APIs (ViaCEP/BrasilAPI) and choose a plan.
- Implement an administration panel for the ISP owner to manage internet plans (full CRUD) and view registered customer leads.
- Develop a decoupled RESTful API using FastAPI (Python) and PostgreSQL, focusing on standard REST practices (pagination, PATCH for partial updates, OAuth2).
- Setup a Next.js (React) frontend with TypeScript, TailwindCSS, and Shadcn/UI to consume the decoupled API.
- Establish Docker orchestration for the database.

## Capabilities

### New Capabilities
- `plan-management`: CRUD operations for internet plans, including listing with dynamic filtering, creating, updating, and toggling active status.
- `lead-capture`: Capturing customer leads with validated addresses via CEP, and moving them to a "PENDING" state, culminating in a WhatsApp redirect.
- `admin-auth`: Basic OAuth2 password flow for administrator login using JWT.

### Modified Capabilities

## Impact

- Introduces a new full-stack decoupled architecture using Next.js and FastAPI.
- Requires PostgreSQL for relational data storage and Docker for consistent deployment.
- Integrates with external APIs (ViaCEP or BrasilAPI) for address resolution.
