## ADDED Requirements

### Requirement: Public users can list active plans
The system MUST allow unauthenticated users to view all active internet plans dynamically.

#### Scenario: User views the vitrine
- **WHEN** an unauthenticated user accesses the public plans list
- **THEN** only active plans are returned

### Requirement: Public users can check coverage and capture lead
The system MUST proxy external CEP service to retrieve address details without exposing third-party API keys on the client side, then capture the user's details as a new pending lead and return a WhatsApp redirect URL.

#### Scenario: User submits a valid CEP and lead information
- **WHEN** the user submits a valid CEP, full name, phone number, and selected plan
- **THEN** the system creates a new lead with a PENDING status, resolves the address server-side, and returns a WhatsApp URL linking to the provider

### Requirement: Admin can list leads
The system MUST allow an administrator to view all captured leads and filter them (e.g. by status).

#### Scenario: Admin views all pending leads
- **WHEN** the admin requests the list of leads with a filter for PENDING status
- **THEN** the system returns only leads marked as PENDING

### Requirement: Admin can update lead status
The system MUST allow an administrator to update the status of a lead (e.g., to CONTACTED or INSTALLED).

#### Scenario: Admin updates lead status
- **WHEN** the admin submits a new status for an existing lead
- **THEN** the system updates the lead's status in the database
