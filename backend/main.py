from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from src.infrastructure.db.database import Base, engine
from src.infrastructure.api.routers import planos_router, contratacao_router, auth_router, upload_router
import os

# Caso seja rodado diretamente sem alembic/container (ex: sqlite para testes), isso recria as tabelas.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Internet Provider API",
    description="API com Clean Architecture contemplando rotas, automação ORM, Autenticação JWT e Upload(FastAPI/Pydantic).",
    version="1.0.0"
)

# CORS para que o frontend rode sem entraves no navegador
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
