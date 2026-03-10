## ADDED Requirements

### Requirement: Admin can log in
The system MUST provide an OAuth2 Password Bearer flow to authenticate administrators and return a JWT.

#### Scenario: Admin submits valid credentials
- **WHEN** an administrator submits a valid email and password
- **THEN** the system returns a valid JWT access token

### Requirement: Admin routes are protected
The system MUST restrict access to all administrative endpoints, requiring a valid JWT in the Authorization header.

#### Scenario: Unauthenticated user accesses an admin route
- **WHEN** an unauthenticated request is made to an admin endpoint
- **THEN** the system returns a 401 Unauthorized error
