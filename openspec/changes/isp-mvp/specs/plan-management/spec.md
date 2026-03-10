## ADDED Requirements

### Requirement: Admin can list plans
The system MUST allow an administrator to view all internet plans, including inactive ones, with optional pagination.

#### Scenario: Admin views all plans
- **WHEN** the admin requests the list of plans with a valid JWT
- **THEN** the system returns a paginated list of all plans

### Requirement: Admin can create a plan
The system MUST allow an administrator to create a new internet plan with name, download speed, upload speed, and price.

#### Scenario: Admin creates a new plan
- **WHEN** the admin submits valid plan details
- **THEN** the system creates the plan and sets it as active by default

### Requirement: Admin can update a plan
The system MUST allow an administrator to update the details of an existing internet plan.

#### Scenario: Admin updates plan price
- **WHEN** the admin submits a new price for an existing plan
- **THEN** the system updates the plan's price in the database

### Requirement: Admin can toggle plan status
The system MUST provide a specific endpoint to quickly toggle a plan's active status without sending the full payload.

#### Scenario: Admin deactivates a plan
- **WHEN** the admin sends a PATCH request to deactivate a plan
- **THEN** the plan is marked as inactive and is no longer visible on the public vitrine
