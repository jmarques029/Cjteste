from src.infrastructure.db.database import Base, SessionLocal, engine
from src.infrastructure.db.models import PlanoModel

PLANOS = [
    {"id": 1, "nome": "Essencial 100", "preco": 79.9, "velocidade_mbps": 100},
    {"id": 2, "nome": "Turbo 300", "preco": 109.9, "velocidade_mbps": 300},
    {"id": 3, "nome": "Ultra 600", "preco": 149.9, "velocidade_mbps": 600},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    existing = db.query(PlanoModel).count()
    if existing > 0:
        print("Banco já possui dados. Pulando seed.")
        db.close()
        return
    for p in PLANOS:
        db.add(PlanoModel(**p))
    db.commit()
    db.close()
    print(f"Seed concluído: {len(PLANOS)} planos inseridos.")


if __name__ == "__main__":
    seed()
