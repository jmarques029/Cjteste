import uuid
from typing import Optional
from dataclasses import dataclass, field

@dataclass
class Plan:
    name: str
    speed_down: int
    speed_up: int
    price: float
    is_active: bool = True
    id: str = field(default_factory=lambda: str(uuid.uuid4()))

@dataclass
class Lead:
    plan_id: str
    full_name: str
    cpf: str
    phone_whatsapp: str
    zip_code: str
    address_details: str
    status: str = "PENDING"
    id: str = field(default_factory=lambda: str(uuid.uuid4()))

@dataclass
class User:
    email: str
    hashed_password: str
    is_admin: bool = False
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
