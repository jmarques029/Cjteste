from typing import List, Optional
from sqlalchemy.orm import Session
from src.domain.entities import Plan
from src.domain.repositories import PlanRepository
from src.infrastructure.database.models import PlanModel

class SQLAlchemyPlanRepository(PlanRepository):
    def __init__(self, db: Session):
        self.db = db

    def create(self, plan: Plan) -> Plan:
        db_plan = PlanModel(
            id=plan.id,
            name=plan.name,
            speed_down=plan.speed_down,
            speed_up=plan.speed_up,
            price=plan.price,
            is_active=plan.is_active
        )
        self.db.add(db_plan)
        self.db.commit()
        self.db.refresh(db_plan)
        return plan

    def get_by_id(self, plan_id: str) -> Optional[Plan]:
        db_plan = self.db.query(PlanModel).filter(PlanModel.id == plan_id).first()
        if not db_plan:
            return None
        return Plan(
            id=db_plan.id,
            name=db_plan.name,
            speed_down=db_plan.speed_down,
            speed_up=db_plan.speed_up,
            price=db_plan.price,
            is_active=db_plan.is_active
        )

    def list_all(self, active_only: bool = False) -> List[Plan]:
        query = self.db.query(PlanModel)
        if active_only:
            query = query.filter(PlanModel.is_active == True)
        
        db_plans = query.all()
        return [
            Plan(
                id=p.id,
                name=p.name,
                speed_down=p.speed_down,
                speed_up=p.speed_up,
                price=p.price,
                is_active=p.is_active
            ) for p in db_plans
        ]

    def update(self, plan: Plan) -> Plan:
        db_plan = self.db.query(PlanModel).filter(PlanModel.id == plan.id).first()
        if db_plan:
            db_plan.name = plan.name
            db_plan.speed_down = plan.speed_down
            db_plan.speed_up = plan.speed_up
            db_plan.price = plan.price
            db_plan.is_active = plan.is_active
            self.db.commit()
            self.db.refresh(db_plan)
        return plan
