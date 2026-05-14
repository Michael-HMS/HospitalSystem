# 12 API Planning

## Authentication APIs
- `POST /api/auth/login`: Authenticate and return JWT/Session.
- `POST /api/auth/register`: Public registration for Patients.

## Admin APIs
- `GET /api/admin/dashboard/stats`: Summary statistics.
- `GET /api/admin/users`: List all users with filtering.
- `POST /api/admin/doctors`: Add a new doctor account.

## Patient APIs
- `GET /api/patient/profile`: Retrieve personal data.
- `POST /api/patient/appointments`: Book a new slot.
- `GET /api/patient/bills`: View payment history.

## Doctor APIs
- `GET /api/doctor/appointments`: View daily schedule.
- `POST /api/doctor/consultations/{id}`: Record diagnosis and treatment.
- `POST /api/doctor/prescriptions`: Issue medication.

## Standards
- **RESTful**: Proper use of HTTP verbs (GET, POST, PUT, DELETE).
- **Versioning**: Header-based or URI-based versioning (e.g., `/api/v1/...`).
- **Nomenclature**: Use of plural nouns (`/patients` instead of `/getPatient`).
- **Filtering/Pagination**: Standardized params for list endpoints (`?page=0&size=10`).
