import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from src.infrastructure.api.routers import (
    auth_router,
    contratacao_router,
    planos_router,
    upload_router,
)
from src.infrastructure.db.database import Base, engine

# Caso seja rodado diretamente sem alembic/container (ex: sqlite para testes), isso recria as tabelas.
Base.metadata.create_all(bind=engine)

from seed import seed as seed_data

seed_data()

app = FastAPI(
    title="Internet Provider API",
    description="API com Clean Architecture contemplando rotas, automação ORM, Autenticação JWT e Upload(FastAPI/Pydantic).",
    version="1.0.0",
)

origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(planos_router.router)
app.include_router(contratacao_router.router)
app.include_router(auth_router.router)
app.include_router(upload_router.router)


@app.get("/health", tags=["Health Check"])
def health_check():
    return {"status": "ok"}


# Servindo o Frontend estático Vanilla JS e HTML (apenas quando o diretório existir)
_frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")
if os.path.isdir(_frontend_dir):
    app.mount("/app", StaticFiles(directory=_frontend_dir, html=True), name="frontend")
