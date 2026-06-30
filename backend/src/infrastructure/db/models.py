from sqlalchemy import Column, Float, Integer, String

from src.infrastructure.db.database import Base


class PlanoModel(Base):
    __tablename__ = "planos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    preco = Column(Float)
    velocidade_mbps = Column(Integer)


class ClienteModel(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    email = Column(String, unique=True, index=True)
    documento = Column(String, unique=True, index=True)
    documento_url = Column(String, nullable=True)  # Caminho do arquivo enviado (Upload)
    senha_hash = Column(String, nullable=True)
    telefone = Column(String, nullable=True)
    cep = Column(String, nullable=True)
    logradouro = Column(String, nullable=True)
    numero = Column(String, nullable=True)
    complemento = Column(String, nullable=True)
    bairro = Column(String, nullable=True)
    cidade = Column(String, nullable=True)
    estado = Column(String, nullable=True)
