# 13 Security Planning

## 1. Authentication
- **Mechanism**: JWT-based stateless authentication or Session-based (depending on client needs).
- **Service**: `AuthService` handles validation against the `users` table.
- **Provider**: Spring Security `DaoAuthenticationProvider`.

## 2. Authorization (RBAC)
- **Roles**:
    - `ROLE_ADMIN`: Full access to all modules.
    - `ROLE_DOCTOR`: Access to patient records, prescriptions, and own schedule.
    - `ROLE_PATIENT`: Access to personal data, bills, and own appointments.
- **Implementation**: `@PreAuthorize` annotations on service/controller methods.

## 3. Data Protection
- **Encryption**: sensitive data (e.g., social security numbers if any) encrypted at rest.
- **Input Validation**: JSR-303 (Hibernate Validator) for all DTOs.
- **CSRF**: Enabled for session-based flows, disabled for JWT flows.
- **CORS**: Configured to allow only trusted frontend origins.

## 4. Audit & Logging
- **Logging Module**: Interceptors or Aspects (@Aspect) to log every non-GET request with user ID and timestamp for compliance.
