from src.infrastructure.database.database import SessionLocal, Base, engine
from src.infrastructure.database.models import PlanModel, UserModel
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_data():
    db = SessionLocal()
    
    # Verifica se já temos dados para não duplicar
    if db.query(PlanModel).first() or db.query(UserModel).first():
        print("Banco de dados já contém informações. Seed ignorado.")
        db.close()
        return

    print("Populando o banco de dados com dados de teste...")

    # Criando o usuário Admin Padrão
    admin_user = UserModel(
        email="admin@admin.com",
        hashed_password=pwd_context.hash("admin"),
        is_admin=True
    )
    db.add(admin_user)

    # Criando Planos de Teste (Mock)
    plan1 = PlanModel(
        name="Plano Starter 200MB",
        speed_down=200,
        speed_up=100,
        price=79.90,
        is_active=True
    )
    plan2 = PlanModel(
        name="Plano Master 500MB",
        speed_down=500,
        speed_up=250,
        price=99.90,
        is_active=True
    )
    plan3 = PlanModel(
        name="Plano Ultra 1GB",
        speed_down=1000,
        speed_up=500,
        price=149.90,
        is_active=True
    )
    
    db.add_all([plan1, plan2, plan3])
    db.commit()
    print("Banco de dados populado com sucesso (1 Admin, 3 Planos)!")
    db.close()

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    seed_data()
