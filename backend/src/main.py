from fastapi import FastAPI
from src.interfaces.api_router import router

app = FastAPI(title="CJnet Backend API")

from src.infrastructure.database.database import engine
from src.infrastructure.database.models import Base

# Cria todas as tabelas no postgres de forma automática no start!
Base.metadata.create_all(bind=engine)

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "API is running"}
