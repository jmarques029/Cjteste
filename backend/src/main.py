from fastapi import FastAPI
from src.interfaces.api_router import router

app = FastAPI(title="CJnet Backend API")

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "API is running"}
