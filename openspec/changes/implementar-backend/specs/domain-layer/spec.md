## ADDED Requirements

### Requirement: Domain Entities
O sistema DEVE possuir entidades de domínio puras, sem dependências de frameworks externos ou de infraestrutura (banco de dados, web).

#### Scenario: Entity instantiation
- **WHEN** uma entidade de negócio for instanciada com dados válidos
- **THEN** ela DEVE ser criada com sucesso e refletir as regras de negócio

### Requirement: Test-Driven Domain
As regras de negócio DEVERÃO ser implementadas estritamente após a criação de seus respectivos testes (TDD).

#### Scenario: Test validates rule
- **WHEN** os testes de domínio rodarem
- **THEN** todas as regras de negócio e validações DEVERÃO estar cobertas por testes que passam
