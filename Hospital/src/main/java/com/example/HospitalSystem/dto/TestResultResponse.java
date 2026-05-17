package com.example.HospitalSystem.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * Response DTO for a TestResult.
 * Covers Module 6: Medical Reports and Test Results.
 */
@Getter
@Builder
public class TestResultResponse {

    private Integer       resultId;
    private Integer       medicalRecordId;
    private Integer       patientId;
    private String        patientName;
    private String        testName;
    private String        resultData;
    private String        doctorNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
