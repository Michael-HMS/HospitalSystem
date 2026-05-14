# 08 Database Design

## Overview
The HMS uses a relational database schema to maintain data integrity and support complex relationships between patients, appointments, and medical history.

## List of Core Tables

### 1. Users & Roles
- `users`: ID, username, password, email, enabled.
- `roles`: ID, name (ROLE_ADMIN, ROLE_DOCTOR, ROLE_PATIENT).
- `user_roles`: Mapping table.

### 2. Clinical Data
- `patients`: ID, user_id, first_name, last_name, gender, dob, phone, address.
- `doctors`: ID, user_id, specialization, department_id.
- `medical_records`: ID, patient_id, doctor_id, diagnosis, treatment, date.
- `prescriptions`: ID, record_id, medication_id, dosage, duration.

### 3. Operational Data
- `appointments`: ID, patient_id, doctor_id, appointment_date, status (PENDING, COMPLETED, CANCELED).
- `medications`: ID, name, stock_quantity, expiry_date, price.
- `departments`: ID, name, description.

### 4. Financial Data
- `bills`: ID, patient_id, total_amount, status (PAID, UNPAID), created_at.
- `payments`: ID, bill_id, payment_method, amount, transaction_id.

## Storage Strategy
- **Initial**: H2 In-Memory (for rapid prototyping).
- **Production**: PostgreSQL or MySQL (for persistent, scalable storage).
