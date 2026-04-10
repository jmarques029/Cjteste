import pytest
from src.domain.entities import Plan, Lead, User
from typing import Optional

def test_create_plan_valid():
    plan = Plan(
        name="Plano Fibra 500MB",
        speed_down=500,
        speed_up=250,
        price=99.90,
        is_active=True
    )
    assert plan.name == "Plano Fibra 500MB"
    assert plan.speed_down == 500
    assert plan.is_active is True
    assert plan.id is not None

def test_create_lead_valid():
    lead = Lead(
        plan_id="123e4567-e89b-12d3-a456-426614174000",
        full_name="João da Silva",
        cpf="12345678909",
        phone_whatsapp="11999999999",
        zip_code="01001-000",
        address_details="Praça da Sé, lado ímpar"
    )
    assert lead.full_name == "João da Silva"
    assert lead.status == "PENDING"
    assert lead.id is not None

def test_create_user_admin():
    user = User(
        email="admin@provedor.com.br",
        hashed_password="securehash",
        is_admin=True
    )
    assert user.email == "admin@provedor.com.br"
    assert user.is_admin is True
    assert user.id is not None
