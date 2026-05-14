# 15 Testing Strategy

## 1. Unit Testing
- **Scope**: Individual business logic in Services and Design Pattern components (Factories, Builders).
- **Tools**: JUnit 5, Mockito.
- **Goal**: >80% code coverage for core business logic.

## 2. Integration Testing
- **Scope**: API layer to Database layer interaction.
- **Tools**: `@SpringBootTest`, Testcontainers (for PostgreSQL/MySQL) or H2.
- **Focus**: Repository queries and Security filters.

## 3. API Testing
- **Scope**: End-to-end verification of REST endpoints.
- **Tools**: Postman, RestAssured.
- **Focus**: Validation of JSON payloads and HTTP status codes.

## 4. Security Testing
- **Scope**: Verifying Role-Based Access Control.
- **Focus**: Ensuring a Patient cannot access Doctor-restricted endpoints.
