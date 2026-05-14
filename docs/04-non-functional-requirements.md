# 04 Non-Functional Requirements

## 1. Security
- **Role-Based Access Control (RBAC)**: Strict separation of data access between Admin, Doctor, and Patient.
- **Data Integrity**: Ensure patient medical records cannot be altered without authorization.
- **Encryption**: Sensitive patient information and passwords must be encrypted (e.g., using BCrypt for passwords).

## 2. Performance
- **Scalability**: System should handle an increasing number of medical records and users without degradation.
- **Response Time**: UI dashboard and search queries should return results in < 2 seconds.

## 3. Reliability & Availability
- **High Availability**: The HMS should be accessible 24/7 for emergency and clinical use.
- **Error Handling**: Graceful failure modes and clear logging for troubleshooting.

## 4. Maintainability
- **SOLID Principles**: Codebase must follow object-oriented best practices for modularity.
- **Layered Architecture**: Clean separation between API, Business Logic, and Data Access layers.

## 5. Usability
- **Intuitive UI**: Easy-to-use interfaces for both medical staff and patients.
- **Responsiveness**: Web application must be accessible on various screen sizes (tablet, desktop).
