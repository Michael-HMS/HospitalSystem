# 17 Doctor Services Implementation

## Overview

This document describes all files created, endpoints exposed, design patterns applied, and entity changes made when implementing the Doctor Services layer for the Hospital Management System.

The implementation covers all six Doctor modules defined in the use case diagram:

1. Doctor Dashboard
2. Patient Records Management
3. Appointment Management
4. Diagnosis and Treatment
5. Prescription Management
6. Medical Reports and Test Results

---

## Files Created

### Entities

| File | Purpose |
|------|---------|
| `entity/TestResult.java` | New entity for Module 6. Stores lab/diagnostic test results linked to a MedicalRecord and Patient. Doctors can view results and add clinical notes. |

### Repositories

| File | Purpose |
|------|---------|
| `repository/AppointmentRepository.java` | Query methods for doctor appointment lists, filtered by date, status, or doctor ID. |
| `repository/MedicalRecordRepository.java` | Fetch medical records by patient (ordered newest-first) and by appointment ID. |
| `repository/PrescriptionRepository.java` | Fetch prescriptions by patient or doctor. |
| `repository/MedicationRepository.java` | Basic CRUD access to the Medication table for prescription creation. |
| `repository/TestResultRepository.java` | Fetch test results by patient or by medical record. |

### DTOs

| File | Purpose |
|------|---------|
| `dto/DoctorDashboardResponse.java` | Dashboard summary: doctor info, today's appointment counts by status, and appointment list. Contains inner class `AppointmentSummary`. |
| `dto/AppointmentResponse.java` | Appointment list item: patient name, date, time, status, reason. |
| `dto/PatientProfileResponse.java` | Full patient profile: demographics, blood type, allergies, medical history, emergency contact, insurance number. |
| `dto/MedicalRecordRequest.java` | Input for creating or updating a medical record: appointmentId, diagnosis, treatment, notes. |
| `dto/MedicalRecordResponse.java` | Output for a medical record: all fields plus patient and doctor names. |
| `dto/PrescriptionRequest.java` | Input for creating a prescription: medicalRecordId, notes, and a list of medication detail lines. Contains inner class `PrescriptionDetailRequest`. |
| `dto/PrescriptionResponse.java` | Output for a prescription: all fields plus patient/doctor names and medication detail list. Contains inner class `DetailResponse`. |
| `dto/TestResultResponse.java` | Output for a test result: test name, result data, doctor notes, timestamps. |
| `dto/TestResultNoteRequest.java` | Input for adding/updating doctor notes on a test result. |

### Design Pattern Classes

| File | Pattern | Purpose |
|------|---------|---------|
| `pattern/builder/MedicalRecordBuilder.java` | Builder | Constructs a `MedicalRecord` step by step with required and optional fields. |
| `pattern/builder/PrescriptionBuilder.java` | Builder | Constructs a `Prescription` with accumulated medication lines; wires bidirectional relationships. |
| `pattern/factory/AppointmentStatusHandler.java` | Factory Method (Product interface) | Defines the contract for appointment status transition handlers. |
| `pattern/factory/ConfirmAppointmentHandler.java` | Factory Method (Concrete Product) | Handles Pending → Confirmed transition with validation. |
| `pattern/factory/CompleteAppointmentHandler.java` | Factory Method (Concrete Product) | Handles Confirmed → Completed transition with validation. |
| `pattern/factory/CancelAppointmentHandler.java` | Factory Method (Concrete Product) | Handles any → Cancelled transition with validation. |
| `pattern/factory/AppointmentStatusHandlerFactory.java` | Factory Method (Creator) | Maps a target `AppointmentStatus` enum value to the correct handler. |
| `pattern/bridge/MessageSender.java` | Bridge (Implementor interface) | Defines the delivery contract: `send(recipient, subject, body)`. |
| `pattern/bridge/EmailMessageSender.java` | Bridge (Concrete Implementor) | Email delivery implementation (logs in dev; replace with JavaMailSender in production). |
| `pattern/bridge/SmsMessageSender.java` | Bridge (Concrete Implementor) | SMS delivery implementation (logs in dev; replace with Twilio/SNS in production). |
| `pattern/bridge/DoctorNotification.java` | Bridge (Abstraction) | Abstract notification type that holds a `MessageSender` reference. |
| `pattern/bridge/AppointmentStatusNotification.java` | Bridge (Refined Abstraction) | Sends a patient notification when an appointment status changes. |

### Service and Controller

| File | Purpose |
|------|---------|
| `service/DoctorService.java` | Implements all six doctor modules. Orchestrates repositories, applies design patterns, and maps entities to DTOs. |
| `controller/DoctorController.java` | Exposes all doctor use cases as REST endpoints under `/api/doctors`. |

### pom.xml Change

Added `spring-boot-starter-validation` dependency to enable `@Valid` and `@NotNull`/`@NotBlank` annotations on request DTOs.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

---

## Entity Changes

### Patient.java

Added the `credit` field to match the new database column:

```java
@Column(name = "credit", length = 20)
private String credit;
```

Matches the SQL definition: `credit VARCHAR(20) DEFAULT NULL`. No `nullable = false` is set because the column allows NULL by default. Lombok generates `getCredit()` and `setCredit()` automatically.

---

## REST API Endpoints

All endpoints are under the base path `/api/doctors`.

### Module 1 — Doctor Dashboard

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/doctors/{doctorId}/dashboard` | Returns today's appointment summary: total, pending, confirmed, completed counts, and the appointment list with patient names and times. |

### Module 2 — Patient Records Management

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/doctors/{doctorId}/patients/{patientId}/profile` | Returns the patient's full profile: name, contact info, blood type, allergies, medical history, emergency contact, and insurance number. |
| GET | `/api/doctors/{doctorId}/patients/{patientId}/medical-history` | Returns all medical records for the patient, ordered newest-first. Includes diagnoses, treatments, and clinical notes. |

### Module 3 — Appointment Management

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/doctors/{doctorId}/appointments` | Returns the doctor's full appointment list ordered by date and time. Optional `?status=` query parameter filters by `Pending`, `Confirmed`, `Completed`, or `Cancelled`. |
| PATCH | `/api/doctors/{doctorId}/appointments/{appointmentId}/status?target=` | Updates appointment status. Accepted values: `Confirmed`, `Completed`, `Cancelled`. Validates the transition and notifies the patient. |

### Module 4 — Diagnosis and Treatment

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/doctors/{doctorId}/medical-records` | Creates a new medical record for a consultation. Requires `appointmentId`; `diagnosis`, `treatment`, and `notes` are optional. |
| PUT | `/api/doctors/{doctorId}/medical-records/{recordId}` | Updates an existing medical record. Only fields present in the request body are updated (partial update). |

### Module 5 — Prescription Management

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/doctors/{doctorId}/prescriptions` | Creates a prescription linked to a medical record. Requires at least one medication detail with `medicationId` and `dosage`. |
| GET | `/api/doctors/{doctorId}/patients/{patientId}/prescriptions` | Returns all prescriptions for a patient, ordered newest-first. |

### Module 6 — Medical Reports and Test Results

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/doctors/{doctorId}/patients/{patientId}/test-results` | Returns all test results for a patient, ordered newest-first. |
| GET | `/api/doctors/{doctorId}/medical-records/{recordId}/test-results` | Returns all test results linked to a specific medical record. |
| PATCH | `/api/doctors/{doctorId}/test-results/{resultId}/notes` | Adds or updates the doctor's clinical notes and recommendations on a test result. |

### Availability

| Method | Path | Description |
|--------|------|-------------|
| PATCH | `/api/doctors/{doctorId}/availability?status=` | Updates the doctor's availability status. Accepted values: `AVAILABLE`, `BUSY`, `ON_LEAVE`. |

---

## Design Patterns

### 1. Builder Pattern

**Classes:** `MedicalRecordBuilder`, `PrescriptionBuilder`

**Where it is used:**
- `DoctorService.createMedicalRecord()` uses `MedicalRecordBuilder`
- `DoctorService.createPrescription()` uses `PrescriptionBuilder`

**Why it was applied:**

`MedicalRecord` has three mandatory associations (patient, doctor, appointment) and three optional text fields (diagnosis, treatment, notes). A doctor may fill these in at different points during or after a consultation. Using a plain constructor would require passing `null` for fields not yet known, which is error-prone and unreadable.

`Prescription` is a composite object — it owns a list of `PrescriptionDetail` lines, each with its own medication, dosage, frequency, and duration. The builder accumulates these lines one by one with `addMedication()` and then wires the bidirectional `Prescription ↔ PrescriptionDetail` relationship automatically before returning the built object. This keeps that relationship management out of the service.

**Example:**
```java
// MedicalRecord — required fields in constructor, optional fields via fluent methods
MedicalRecord record = new MedicalRecordBuilder(patient, doctor, appointment)
    .withDiagnosis("Type 2 Diabetes")
    .withTreatment("Metformin 500mg twice daily")
    .withNotes("Follow up in 3 months")
    .build();

// Prescription — medication lines accumulated before building
Prescription rx = new PrescriptionBuilder(record, doctor, patient)
    .withNotes("Take with food")
    .addMedication(metformin, "500mg", "Twice daily", "30 days")
    .addMedication(vitaminD,  "1000IU", "Once daily",  "30 days")
    .build();
```

**Benefit:** Readable construction, enforced required fields, easy to add new optional fields without breaking existing call sites.

---

### 2. Factory Method Pattern

**Classes:** `AppointmentStatusHandler` (interface), `ConfirmAppointmentHandler`, `CompleteAppointmentHandler`, `CancelAppointmentHandler`, `AppointmentStatusHandlerFactory`

**Where it is used:**
- `DoctorService.updateAppointmentStatus()` calls `AppointmentStatusHandlerFactory.getHandler(targetStatus)`

**Why it was applied:**

Each appointment status transition has its own validation rules:
- Only `Pending` appointments can be confirmed
- Only `Confirmed` appointments can be completed
- `Completed` appointments cannot be cancelled

Without this pattern, all of that logic would live in a single `if/else` block inside the service. Every time a new status or transition rule is added, the service method must be modified — violating the Open/Closed Principle.

With the Factory Method, each transition is its own class with a single responsibility. The service asks the factory for the right handler and calls `handle()`. Adding a new transition (e.g., "Rescheduled") means adding one new handler class and one line in the factory switch — the service is never touched.

**Example:**
```java
// Service does not know which class handles the transition
AppointmentStatusHandler handler = AppointmentStatusHandlerFactory.getHandler(targetStatus);
handler.handle(appointment); // validates current state and sets new status
```

**Benefit:** Each transition rule is isolated, independently testable, and the service stays clean regardless of how many statuses are added.

---

### 3. Bridge Pattern

**Classes:** `MessageSender` (interface), `EmailMessageSender`, `SmsMessageSender`, `DoctorNotification` (abstract), `AppointmentStatusNotification`

**Where it is used:**
- `DoctorService` receives a `MessageSender` via constructor injection (`@Qualifier("emailSender")`)
- `DoctorService.updateAppointmentStatus()` creates an `AppointmentStatusNotification` and calls `send()`

**Why it was applied:**

The system needs to notify patients when a doctor changes their appointment status. It must support both Email and SMS delivery. Without the Bridge, you would need a separate class for every combination of notification type and delivery channel — `EmailAppointmentStatusNotification`, `SmsAppointmentStatusNotification`, and so on. As notification types and channels grow, this becomes an M×N class explosion.

The Bridge separates the *what to send* (notification type = `DoctorNotification` abstraction) from the *how to send it* (delivery channel = `MessageSender` implementor). Each side can vary independently.

Switching from email to SMS in the service requires changing a single `@Qualifier` annotation on the constructor — no notification logic changes.

**Example:**
```java
// Abstraction uses the bridge without knowing if it's email or SMS
new AppointmentStatusNotification(messageSender, patientName, "Confirmed", date)
    .send(patientEmail);

// To switch to SMS: change @Qualifier("emailSender") to @Qualifier("smsSender")
// Nothing else changes
```

**Benefit:** Notification types and delivery channels are decoupled. New channels (e.g., push notifications) or new notification types (e.g., prescription ready) can be added independently without modifying existing classes.

---

## Design Pattern Summary Table

| Pattern | Category | Classes | Applied In |
|---------|----------|---------|------------|
| Builder | Creational | `MedicalRecordBuilder`, `PrescriptionBuilder` | `createMedicalRecord()`, `createPrescription()` |
| Factory Method | Creational | `AppointmentStatusHandlerFactory` + 3 handlers | `updateAppointmentStatus()` |
| Bridge | Structural | `DoctorNotification`, `MessageSender` + 2 senders | `updateAppointmentStatus()` (notification) |

---

## Module-to-Code Mapping

| Module | Service Method(s) | Pattern Used |
|--------|------------------|--------------|
| 1 — Dashboard | `getDashboard()` | — |
| 2 — Patient Records | `getPatientProfile()`, `getPatientMedicalHistory()` | — |
| 3 — Appointments | `getDoctorAppointments()`, `updateAppointmentStatus()` | Factory Method, Bridge |
| 4 — Diagnosis & Treatment | `createMedicalRecord()`, `updateMedicalRecord()` | Builder |
| 5 — Prescriptions | `createPrescription()`, `getPatientPrescriptions()` | Builder |
| 6 — Test Results | `getPatientTestResults()`, `getTestResultsByRecord()`, `addTestResultNote()` | — |
