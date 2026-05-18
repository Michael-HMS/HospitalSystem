package com.example.HospitalSystem.controller;

import com.example.HospitalSystem.dto.AppointmentRequest;
import com.example.HospitalSystem.dto.AppointmentResponse;
import com.example.HospitalSystem.dto.PatientCreateRequest;
import com.example.HospitalSystem.dto.PatientDto;
import com.example.HospitalSystem.dto.PatientResponse;
import com.example.HospitalSystem.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // =========================================================================
    // Onboarding & Profile APIs
    // =========================================================================

    /**
     * POST /api/patients/register
     * Register a new patient in the system.
     */
    @PostMapping("/register")
    public ResponseEntity<PatientResponse> registerPatient(@RequestBody PatientCreateRequest request) {
        return ResponseEntity.ok(patientService.createPatient(request));
    }

    /**
     * GET /api/patients
     * Returns a safe list of all patients (no sensitive medical info).
     */
    @GetMapping
    public ResponseEntity<List<PatientDto>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatientsBasicInfo());
    }

    /**
     * GET /api/patients/{patientId}
     * Returns a safe profile of a specific patient.
     */
    @GetMapping("/{patientId}")
    public ResponseEntity<PatientDto> getPatient(@PathVariable Integer patientId) {
        return ResponseEntity.ok(patientService.getPatientBasicInfo(patientId));
    }

    // =========================================================================
    // Appointments API
    // =========================================================================

    /**
     * GET /api/patients/{patientId}/appointments
     * Returns all appointments for a specific patient, newest first.
     */
    @GetMapping("/{patientId}/appointments")
    public ResponseEntity<List<AppointmentResponse>> getPatientAppointments(@PathVariable Integer patientId) {
        return ResponseEntity.ok(patientService.getPatientAppointments(patientId));
    }

    /**
     * POST /api/patients/{patientId}/appointments
     * Allows a patient to book a time slot with a specific doctor.
     */
    @PostMapping("/{patientId}/appointments")
    public ResponseEntity<AppointmentResponse> bookAppointment(
            @PathVariable Integer patientId,
            @RequestBody AppointmentRequest request) {
        
        return ResponseEntity.ok(patientService.bookAppointment(patientId, request));
    }
}
