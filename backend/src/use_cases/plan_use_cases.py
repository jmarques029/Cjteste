from typing import List
from src.domain.entities import Plan
from src.domain.repositories import PlanRepository

class CreatePlanUseCase:
    def __init__(self, plan_repo: PlanRepository):
        self.plan_repo = plan_repo

    def execute(self, name: str, speed_down: int, speed_up: int, price: float) -> Plan:
        plan = Plan(
            name=name,
            speed_down=speed_down,
            speed_up=speed_up,
            price=price
        )
        return self.plan_repo.create(plan)

class ListPlansUseCase:
    def __init__(self, plan_repo: PlanRepository):
        self.plan_repo = plan_repo

    def execute(self, active_only: bool = False) -> List[Plan]:
        return self.plan_repo.list_all(active_only=active_only)
