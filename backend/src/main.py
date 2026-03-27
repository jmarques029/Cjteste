from fastapi import FastAPI

app = FastAPI(title="CJnet Backend API")

@app.get("/")
def read_root():
    return {"message": "API is running"}
