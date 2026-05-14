# 05 Use Cases

## Use Case ID: UC-01
**Title**: Schedule Appointment
**Primary Actor**: Patient
**Description**: Patient selects a doctor and books a time slot for consultation.
**Pre-condition**: Patient is registered and logged in.
**Post-condition**: Appointment is pending and appears on the Doctor's dashboard.

## Use Case ID: UC-02
**Title**: Manage Patient Records
**Primary Actor**: Admin / Doctor
**Description**: Admin adds new patients or search/update existing ones. Doctor updates clinical history.
**Pre-condition**: Actor is authenticated with appropriate role.

## Use Case ID: UC-03
**Title**: Generate Billing Invoice
**Primary Actor**: Admin
**Description**: System calculates charges for medical services and generates a printable invoice.
**Pre-condition**: Patient has received treatment or medication.

## Use Case ID: UC-04
**Title**: Search Medical History
**Primary Actor**: Doctor
**Description**: Doctor searches for a specific patient to view their previous diagnoses.
**Pre-condition**: Patient exists in the system.

## Use Case Diagram Mapping (from PDF)
- **Admin**: Login, View Dashboards, Manage Records (Patient/Doctor/Staff), Manage Billing.
- **Doctor**: Login, View Dashboards, Manage Appointments, Record Diagnosis, Create Prescription, View Test Results.
- **Patient**: Login, Register Account, Manage Profile, Book Appointment, View Records/Prescriptions, View Bills.
