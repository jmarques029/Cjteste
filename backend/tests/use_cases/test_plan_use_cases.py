import pytest
from unittest.mock import Mock
from src.domain.entities import Plan
from src.domain.repositories import PlanRepository
from src.use_cases.plan_use_cases import CreatePlanUseCase, ListPlansUseCase

@pytest.fixture
def mock_plan_repo():
    return Mock(spec=PlanRepository)

def test_create_plan_use_case(mock_plan_repo):
    use_case = CreatePlanUseCase(mock_plan_repo)
    
    # Simula o retorno do repositório
    mock_plan_repo.create.side_effect = lambda plan: plan
    
    created = use_case.execute(
        name="Plano Novo",
        speed_down=100,
        speed_up=50,
        price=49.90
    )
    
    assert created.name == "Plano Novo"
    assert created.speed_down == 100
    mock_plan_repo.create.assert_called_once()

def test_list_plans_use_case(mock_plan_repo):
    use_case = ListPlansUseCase(mock_plan_repo)
    
    mock_plan_repo.list_all.return_value = [
        Plan(name="Plan 1", speed_down=100, speed_up=50, price=50.0),
        Plan(name="Plan 2", speed_down=200, speed_up=100, price=80.0)
    ]
    
    plans = use_case.execute(active_only=True)
    assert len(plans) == 2
    mock_plan_repo.list_all.assert_called_with(active_only=True)
