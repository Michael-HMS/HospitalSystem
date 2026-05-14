# 06 Modules and Services

## 1. Patient Management Module
- **Purpose**: Centralize patient administrative and clinical data.
- **Responsibilities**: CRUD operations on Patient profiles, tracking patient history.
- **Entities**: `Patient`, `MedicalRecord`.
- **APIs**: `GET /api/patients`, `POST /api/patients`, `PUT /api/patients/{id}`.
- **Design Patterns**: 
    - **Builder**: To construct complex Patient records.

## 2. Appointment Module
- **Purpose**: Orchestrate scheduling between patients and doctors.
- **Responsibilities**: Managing slots, booking, cancellations, reminders.
- **Entities**: `Appointment`, `DoctorSchedule`.
- **APIs**: `POST /api/appointments`, `GET /api/doctors/{id}/slots`.
- **Design Patterns**:
    - **Factory**: For creating different types of appointments (General, Emergency).

## 3. Billing & Payment Module
- **Purpose**: Manage financial transactions and insurance claims.
- **Responsibilities**: Invoice generation, payment processing, transaction tracking.
- **Entities**: `Bill`, `Transaction`, `PaymentMethod`.
- **APIs**: `POST /api/billing/invoice`, `GET /api/billing/history`.
- **Design Patterns**:
    - **Adapter**: For integrating with external Payment Gateways (Stripe, PayPal).
    - **Abstract Factory**: For different billing systems (Standard, Corporate/Insurance).

## 4. Medication & Pharmacy Module
- **Purpose**: Track inventory and dispense prescriptions.
- **Responsibilities**: Stock management, expiration tracking, prescription fulfillment.
- **Entities**: `Medication`, `Prescription`, `InventoryItem`.
- **Design Patterns**:
    - **Builder**: For complex prescriptions with multiple dosage instructions.

## 5. Notification Module
- **Purpose**: Multi-channel communication with stakeholders.
- **Responsibilities**: Sending SMS, Email, and Push notifications.
- **Design Patterns**:
    - **Bridge**: To separate notification abstraction from delivery implementation (SMS, Email).
