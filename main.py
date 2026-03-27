from fastapi import FastAPI

app = FastAPI(title="Internet Provider API")

@app.get("/health")
def health_check():
    return {"status": "ok"}
