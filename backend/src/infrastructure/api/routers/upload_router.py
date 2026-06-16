import os
import shutil

from fastapi import APIRouter, File, HTTPException, UploadFile

router = APIRouter(prefix="/upload", tags=["Upload de Arquivos"])

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

os.makedirs("uploads", exist_ok=True)


@router.post("/")
def upload_arquivo(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de arquivo '{file.content_type}' não permitido. Use PDF, JPEG, PNG ou WebP.",
        )

    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400, detail="Arquivo muito grande. O tamanho máximo é 5 MB."
        )

    file_location = f"uploads/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    return {
        "info": f"Arquivo '{file.filename}' salvo com sucesso.",
        "path": file_location,
    }
