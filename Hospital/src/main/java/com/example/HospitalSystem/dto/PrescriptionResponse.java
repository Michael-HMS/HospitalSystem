package com.example.HospitalSystem.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

/**
 * Response DTO for a Prescription.
 */
@Getter
@Builder
public class PrescriptionResponse {

    private Integer prescriptionId;
    private Integer medicalRecordId;
    private Integer patientId;
    private String patientName;
    private Integer doctorId;
    private String doctorName;
    private LocalDate issueDate;
    private String notes;
    private List<DetailResponse> details;

    @Getter
    @Builder
    public static class DetailResponse {
        private Integer detailId;
        private Integer medicationId;
        private String medicationName;
        private String dosage;
        private String frequency;
        private String duration;
    }
}
