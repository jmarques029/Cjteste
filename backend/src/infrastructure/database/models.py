from sqlalchemy import Column, String, Integer, Float, Boolean
from src.infrastructure.database.database import Base
import uuid

class PlanModel(Base):
    __tablename__ = "plans"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    speed_down = Column(Integer, nullable=False)
    speed_up = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)

class LeadModel(Base):
    __tablename__ = "leads"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    plan_id = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    cpf = Column(String, nullable=False)
    phone_whatsapp = Column(String, nullable=False)
    zip_code = Column(String, nullable=False)
    address_details = Column(String, nullable=False)
    status = Column(String, default="PENDING")

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
