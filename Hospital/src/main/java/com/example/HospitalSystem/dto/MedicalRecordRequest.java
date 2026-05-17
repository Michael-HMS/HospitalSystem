package com.example.HospitalSystem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request DTO for creating or updating a MedicalRecord.
 * Used by the doctor when recording diagnosis and treatment after a consultation.
 */
@Getter
@Setter
@NoArgsConstructor
public class MedicalRecordRequest {

    @NotNull(message = "Appointment ID is required")
    private Integer appointmentId;

    /** Free-text diagnosis written by the doctor. */
    private String diagnosis;

    /** Treatment plan or procedures performed. */
    private String treatment;

    /** Additional clinical notes. */
    private String notes;
}
