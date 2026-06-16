import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Uso do postgres no container por padrão, ou sqlite em testes locais.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# Ajuste condicional dependendo se é sqlite ou postgres (para args do sqlite)
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
