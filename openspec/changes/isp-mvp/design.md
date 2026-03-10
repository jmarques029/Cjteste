## Context

The project is an MVP (Proof of Concept) for an Internet Service Provider (ISP) self-service flow, designed to be built within a strict 60-hour timeframe. It requires demonstrating proficiency in decoupled architectures, standard CRUD operations, and external API integrations. The project is completely greenfield, with the tech stack standardized as Next.js, FastAPI, and PostgreSQL.

## Goals / Non-Goals

**Goals:**
- Deliver a functional public interface (Vitrine) and a self-service coverage checking tool.
- Provide a secure administration panel for ISP owners to manage plans and monitor captured leads.
- Establish a clear decoupled architecture using Next.js for the frontend and FastAPI for the RESTful API backend.
- Persist data using PostgreSQL running in a Docker container.

**Non-Goals:**
- Integrating a real payment gateway for automatic billing.
- Developing a real-time WebSocket chat system (a WhatsApp redirect acts as the fallback).
- Building a post-purchase portal for the end customer (Autoatendimento focuses purely on the acquisition phase).

## Decisions

- **Architecture Choice: Decoupled API:** Chosen over a Fullstack Monolith or Next.js BFF approach to maintain a strict separation of concerns. This proves the ability to design an agnostic RESTful API in FastAPI and build an independent React application consuming it.
- **API Routing:**
  - `POST /api/v1/checkout/leads`: Manages lead creation and returns a protocol number + WhatsApp redirect URL immediately.
  - `GET /api/v1/coverage/{zip_code}`: Acts as a backend proxy to ViaCEP/BrasilAPI, preventing CORS issues in the browser and hiding any potential third-party keys.
- **Authentication:** Implementation of standard OAuth2 Password Flow with JWT tokens within FastAPI solely for the administrative interfaces. The Next.js frontend will store the token (e.g., via secure HttpOnly Cookies or controlled local storage) and attach it as a Bearer token in subsequent Admin requests.
- **Data Model:**
  - `plans`: (id, name, speed_down, speed_up, price, is_active)
  - `leads`: (id, plan_id, full_name, cpf, phone_whatsapp, zip_code, address_X, status)
  - `users`: (id, email, hashed_password, is_admin)

## Risks / Trade-offs

- **Risk: Scope Creep beyond 60 hours** 
  - *Mitigation:* Explicitly freezing requirements right now. No new entities will be added to the database during the MVP phase.
- **Risk: CORS configuration difficulties between decoupled services**
  - *Mitigation:* Ensure the Docker Compose mapping and FastAPI CORS middleware are configured as the very first backend task.
