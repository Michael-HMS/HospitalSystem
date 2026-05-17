package com.example.HospitalSystem.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * Response DTO for a MedicalRecord.
 */
@Getter
@Builder
public class MedicalRecordResponse {

    private Integer recordId;
    private Integer patientId;
    private String patientName;
    private Integer doctorId;
    private String doctorName;
    private Integer appointmentId;
    private String diagnosis;
    private String treatment;
    private String notes;
    private LocalDateTime createdAt;
}
