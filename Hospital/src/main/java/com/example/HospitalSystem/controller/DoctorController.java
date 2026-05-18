package com.example.HospitalSystem.controller;

import com.example.HospitalSystem.dto.AppointmentResponse;
import com.example.HospitalSystem.dto.DoctorDashboardResponse;
import com.example.HospitalSystem.dto.DoctorRegisterRequest;
import com.example.HospitalSystem.dto.DoctorDto;
import com.example.HospitalSystem.dto.MedicalRecordRequest;
import com.example.HospitalSystem.dto.MedicalRecordResponse;
import com.example.HospitalSystem.dto.MedicationCreateRequest;
import com.example.HospitalSystem.dto.MedicationResponse;
import com.example.HospitalSystem.dto.PatientProfileResponse;
import com.example.HospitalSystem.dto.PrescriptionRequest;
import com.example.HospitalSystem.dto.PrescriptionResponse;
import com.example.HospitalSystem.dto.TestResultNoteRequest;
import com.example.HospitalSystem.dto.TestResultResponse;
import com.example.HospitalSystem.entity.enums.AppointmentStatus;
import com.example.HospitalSystem.entity.enums.AvailabilityStatus;
import com.example.HospitalSystem.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for all Doctor use-case endpoints.
 *
 * Module 1 — Dashboard : GET /api/doctors/{id}/dashboard
 * Module 2 — Patient Records : GET /api/doctors/{id}/patients/{pid}/profile
 * GET /api/doctors/{id}/patients/{pid}/medical-history
 * Module 3 — Appointments : GET /api/doctors/{id}/appointments
 * PATCH /api/doctors/{id}/appointments/{aid}/status
 * Module 4 — Diagnosis : POST /api/doctors/{id}/medical-records
 * PUT /api/doctors/{id}/medical-records/{rid}
 * Module 5 — Prescriptions : POST /api/doctors/{id}/prescriptions
 * GET /api/doctors/{id}/patients/{pid}/prescriptions
 * Module 6 — Test Results : GET /api/doctors/{id}/patients/{pid}/test-results
 * GET /api/doctors/{id}/medical-records/{rid}/test-results
 * PATCH /api/doctors/{id}/test-results/{tid}/notes
 * Availability : PATCH /api/doctors/{id}/availability
 */
@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // =========================================================================
    // Onboarding & Search APIs
    // =========================================================================

    // Promote a registered User to a Doctor Profile
    @PostMapping("/onboard")
    public ResponseEntity<DoctorDto> onboardDoctor(@RequestBody DoctorRegisterRequest request) {
        return ResponseEntity.ok(doctorService.onboardDoctor(request));
    }

    // Search for a doctor (Patient uses this)
    @GetMapping("/search")
    public ResponseEntity<List<DoctorDto>> searchDoctors(
            @RequestParam(value = "keyword", required = false) String keyword) {
        List<DoctorDto> result = doctorService.searchDoctors(keyword);
        return ResponseEntity.ok(result);
    }

    // Get all doctors
    @GetMapping
    public ResponseEntity<List<DoctorDto>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    // =========================================================================
    // Module 1 — Doctor Dashboard
    // =========================================================================

    /**
     * GET /api/doctors/{doctorId}/dashboard
     * Returns today's appointment summary and doctor status.
     */
    @GetMapping("/{doctorId}/dashboard")
    public ResponseEntity<DoctorDashboardResponse> getDashboard(@PathVariable Integer doctorId) {
        return ResponseEntity.ok(doctorService.getDashboard(doctorId));
    }

    // =========================================================================
    // Module 2 — Patient Records Management
    // =========================================================================

    /**
     * GET /api/doctors/{doctorId}/patients/{patientId}/profile
     * Returns the patient's full profile: demographics, blood type, allergies,
     * history.
     */
    @GetMapping("/{doctorId}/patients/{patientId}/profile")
    public ResponseEntity<PatientProfileResponse> getPatientProfile(
            @PathVariable Integer doctorId,
            @PathVariable Integer patientId) {
        return ResponseEntity.ok(doctorService.getPatientProfile(patientId));
    }

    /**
     * GET /api/doctors/{doctorId}/patients/{patientId}/medical-history
     * Returns all medical records for a patient, newest first.
     */
    @GetMapping("/{doctorId}/patients/{patientId}/medical-history")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalHistory(
            @PathVariable Integer doctorId,
            @PathVariable Integer patientId) {
        return ResponseEntity.ok(doctorService.getPatientMedicalHistory(patientId));
    }

    // =========================================================================
    // Module 3 — Appointment Management
    // =========================================================================

    /**
     * GET /api/doctors/{doctorId}/appointments?status=Pending
     * Returns the doctor's appointment list, optionally filtered by status.
     * Shows patient name, date, time, and reason for each appointment.
     */
    @GetMapping("/{doctorId}/appointments")
    public ResponseEntity<List<AppointmentResponse>> getAppointments(
            @PathVariable Integer doctorId,
            @RequestParam(required = false) AppointmentStatus status) {
        return ResponseEntity.ok(doctorService.getDoctorAppointments(doctorId, status));
    }

    /**
     * PATCH
     * /api/doctors/{doctorId}/appointments/{appointmentId}/status?target=Confirmed
     * Updates appointment status: Confirmed, Completed, or Cancelled.
     *
     * Uses Factory Method pattern internally to select the correct transition
     * handler.
     * Uses Bridge pattern to notify the patient after the status change.
     */
    @PatchMapping("/{doctorId}/appointments/{appointmentId}/status")
    public ResponseEntity<Void> updateAppointmentStatus(
            @PathVariable Integer doctorId,
            @PathVariable Integer appointmentId,
            @RequestParam AppointmentStatus target) {
        doctorService.updateAppointmentStatus(doctorId, appointmentId, target);
        return ResponseEntity.noContent().build();
    }

    // =========================================================================
    // Module 4 — Diagnosis and Treatment
    // =========================================================================

    /**
     * POST /api/doctors/{doctorId}/medical-records
     * Creates a new medical record for a consultation.
     * Uses Builder pattern to construct the record with optional fields.
     */
    @PostMapping("/{doctorId}/medical-records")
    public ResponseEntity<MedicalRecordResponse> createMedicalRecord(
            @PathVariable Integer doctorId,
            @Valid @RequestBody MedicalRecordRequest request) {
        return ResponseEntity.ok(doctorService.createMedicalRecord(doctorId, request));
    }

    /**
     * PUT /api/doctors/{doctorId}/medical-records/{recordId}
     * Updates an existing medical record — e.g., adds notes after lab results
     * arrive.
     */
    @PutMapping("/{doctorId}/medical-records/{recordId}")
    public ResponseEntity<MedicalRecordResponse> updateMedicalRecord(
            @PathVariable Integer doctorId,
            @PathVariable Integer recordId,
            @Valid @RequestBody MedicalRecordRequest request) {
        return ResponseEntity.ok(doctorService.updateMedicalRecord(doctorId, recordId, request));
    }

    // =========================================================================
    // Module 5 — Prescription Management
    // =========================================================================

    /**
     * POST /api/doctors/{doctorId}/medications
     * Adds a medication to the catalog for prescribing.
     */
    @PostMapping("/{doctorId}/medications")
    public ResponseEntity<MedicationResponse> createMedication(
            @PathVariable Integer doctorId,
            @Valid @RequestBody MedicationCreateRequest request) {
        return ResponseEntity.ok(doctorService.createMedication(doctorId, request));
    }

    /**
     * POST /api/doctors/{doctorId}/prescriptions
     * Creates a prescription with one or more medication lines.
     * Uses Builder pattern to accumulate medication details before saving.
     */
    @PostMapping("/{doctorId}/prescriptions")
    public ResponseEntity<PrescriptionResponse> createPrescription(
            @PathVariable Integer doctorId,
            @Valid @RequestBody PrescriptionRequest request) {
        return ResponseEntity.ok(doctorService.createPrescription(doctorId, request));
    }

    /**
     * GET /api/doctors/{doctorId}/patients/{patientId}/prescriptions
     * Returns all prescriptions for a patient, newest first.
     */
    @GetMapping("/{doctorId}/patients/{patientId}/prescriptions")
    public ResponseEntity<List<PrescriptionResponse>> getPatientPrescriptions(
            @PathVariable Integer doctorId,
            @PathVariable Integer patientId) {
        return ResponseEntity.ok(doctorService.getPatientPrescriptions(patientId));
    }

    // =========================================================================
    // Module 6 — Medical Reports and Test Results
    // =========================================================================

    /**
     * GET /api/doctors/{doctorId}/patients/{patientId}/test-results
     * Returns all test results for a patient, newest first.
     */
    @GetMapping("/{doctorId}/patients/{patientId}/test-results")
    public ResponseEntity<List<TestResultResponse>> getPatientTestResults(
            @PathVariable Integer doctorId,
            @PathVariable Integer patientId) {
        return ResponseEntity.ok(doctorService.getPatientTestResults(patientId));
    }

    /**
     * GET /api/doctors/{doctorId}/medical-records/{recordId}/test-results
     * Returns all test results linked to a specific medical record.
     */
    @GetMapping("/{doctorId}/medical-records/{recordId}/test-results")
    public ResponseEntity<List<TestResultResponse>> getTestResultsByRecord(
            @PathVariable Integer doctorId,
            @PathVariable Integer recordId) {
        return ResponseEntity.ok(doctorService.getTestResultsByRecord(recordId));
    }

    /**
     * PATCH /api/doctors/{doctorId}/test-results/{resultId}/notes
     * Adds or updates the doctor's clinical notes on a test result.
     */
    @PatchMapping("/{doctorId}/test-results/{resultId}/notes")
    public ResponseEntity<TestResultResponse> addTestResultNote(
            @PathVariable Integer doctorId,
            @PathVariable Integer resultId,
            @Valid @RequestBody TestResultNoteRequest request) {
        return ResponseEntity.ok(doctorService.addTestResultNote(doctorId, resultId, request));
    }

    // =========================================================================
    // Availability
    // =========================================================================

    /**
     * PATCH /api/doctors/{doctorId}/availability?status=AVAILABLE
     * Updates the doctor's availability status (AVAILABLE / BUSY / ON_LEAVE).
     */
    @PatchMapping("/{doctorId}/availability")
    public ResponseEntity<Void> updateAvailability(
            @PathVariable Integer doctorId,
            @RequestParam AvailabilityStatus status) {
        doctorService.updateAvailability(doctorId, status);
        return ResponseEntity.noContent().build();
    }
}
