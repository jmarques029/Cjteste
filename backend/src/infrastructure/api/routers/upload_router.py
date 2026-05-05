from fastapi import APIRouter, UploadFile, File
import shutil
import os

router = APIRouter(prefix="/upload", tags=["Upload de Arquivos"])

# Garante que o diretório de uploads exista
os.makedirs("uploads", exist_ok=True)

@router.post("/")
def upload_arquivo(file: UploadFile = File(...)):
    """Rota simples para o envio de documentos (testando feature de Uploads da FastAPI)."""
    file_location = f"uploads/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    return {"info": f"Arquivo '{file.filename}' salvo com sucesso.", "path": file_location}
