import os
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from src.infrastructure.api.dependencies import get_db
from src.infrastructure.api.schemas.schemas import ClienteRegister, Token
from src.infrastructure.db.models import ClienteModel
from src.infrastructure.security.auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    get_password_hash,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["Autenticação"])

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD_HASH = get_password_hash(os.getenv("ADMIN_PASSWORD", "secret123"))


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: ClienteRegister, db: Session = Depends(get_db)):
    # Check if client with email or document already exists
    existing_cliente = (
        db.query(ClienteModel)
        .filter(
            (ClienteModel.email == payload.email)
            | (ClienteModel.documento == payload.documento)
        )
        .first()
    )
    if existing_cliente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cliente com este e-mail ou documento já cadastrado.",
        )

    hashed_password = get_password_hash(payload.senha)

    new_cliente = ClienteModel(
        nome=payload.nome,
        email=payload.email,
        documento=payload.documento,
        senha_hash=hashed_password,
        telefone=payload.telefone,
        cep=payload.endereco.cep,
        logradouro=payload.endereco.logradouro,
        numero=payload.endereco.numero,
        complemento=payload.endereco.complemento,
        bairro=payload.endereco.bairro,
        cidade=payload.endereco.cidade,
        estado=payload.endereco.estado,
    )

    db.add(new_cliente)
    db.commit()
    db.refresh(new_cliente)

    return {
        "status": "sucesso",
        "cliente_id": new_cliente.id,
        "mensagem": "Cadastro realizado com sucesso.",
    }


@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    # Check if admin
    is_admin = form_data.username == ADMIN_USERNAME and verify_password(
        form_data.password, ADMIN_PASSWORD_HASH
    )

    if not is_admin:
        # Check if customer in DB (by email or document)
        cliente = (
            db.query(ClienteModel)
            .filter(
                (ClienteModel.email == form_data.username)
                | (ClienteModel.documento == form_data.username)
            )
            .first()
        )
        if (
            not cliente
            or not cliente.senha_hash
            or not verify_password(form_data.password, cliente.senha_hash)
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
