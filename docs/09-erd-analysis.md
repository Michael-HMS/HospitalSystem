# 09 ERD Analysis

## Entity Relationship Overview
The ERD provided in the PDF highlights the following critical relationships:

### 1. User Hierarchies
- **User** is the base entity for **Admin**, **Doctor**, and **Patient**.
- Shared attributes: `username`, `password`, `email`.
- Specific attributes:
    - **Doctor**: `specialization`, `department`.
    - **Patient**: `medical_history`, `dob`.

### 2. Appointment Workflow
- **One-to-Many**: One Patient can have many Appointments.
- **One-to-Many**: One Doctor can have many Appointments.
- **Many-to-One**: Appointments are linked to a specific Doctor and Patient.

### 3. Medical Records
- **One-to-One/Many**: A Medical Record is generated during an Appointment.
- **One-to-Many**: A Medical Record can contain multiple Prescriptions.
- **One-to-Many**: A Medical Record can have multiple Laboratory Test Results.

### 4. Billing
- **One-to-One**: Each Bill is linked to a specific service or consolidated treatment record.
- **One-to-Many**: One Bill can have multiple Payments (installments or partial payments).

## Data Integrity Rules
- Deleting a User should cascade or archive related Patient/Doctor data.
- Medical Records must be immutable once "Finalized" by a Doctor.
- Appointments cannot be booked in overlapping time slots for the same Doctor.
