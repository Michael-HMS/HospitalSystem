package com.example.HospitalSystem.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Request DTO for creating a Prescription.
 * The doctor provides the medical record context and a list of medication details.
 */
@Getter
@Setter
@NoArgsConstructor
public class PrescriptionRequest {

    @NotNull(message = "Medical record ID is required")
    private Integer medicalRecordId;

    /** Optional clinical notes for the pharmacist. */
    private String notes;

    @NotEmpty(message = "At least one medication detail is required")
    private List<PrescriptionDetailRequest> details;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class PrescriptionDetailRequest {

        @NotNull(message = "Medication ID is required")
        private Integer medicationId;

        @NotNull(message = "Dosage is required")
        private String dosage;

        private String frequency;
        private String duration;
    }
}
