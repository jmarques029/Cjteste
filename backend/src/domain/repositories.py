from abc import ABC, abstractmethod
from typing import List, Optional
from src.domain.entities import Plan, Lead, User

class PlanRepository(ABC):
    @abstractmethod
    def create(self, plan: Plan) -> Plan:
        pass

    @abstractmethod
    def get_by_id(self, plan_id: str) -> Optional[Plan]:
        pass

    @abstractmethod
    def list_all(self, active_only: bool = False) -> List[Plan]:
        pass

    @abstractmethod
    def update(self, plan: Plan) -> Plan:
        pass

class LeadRepository(ABC):
    @abstractmethod
    def create(self, lead: Lead) -> Lead:
        pass
    
    @abstractmethod
    def list_all(self) -> List[Lead]:
        pass

    @abstractmethod
    def update_status(self, lead_id: str, new_status: str) -> Optional[Lead]:
        pass

class UserRepository(ABC):
    @abstractmethod
    def get_by_email(self, email: str) -> Optional[User]:
        pass
