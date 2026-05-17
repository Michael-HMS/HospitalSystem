package com.example.HospitalSystem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request DTO for a doctor adding/updating notes on a test result.
 * Covers Module 6: View / Update Test Results.
 */
@Getter
@Setter
@NoArgsConstructor
public class TestResultNoteRequest {

    @NotBlank(message = "Doctor notes cannot be blank")
    private String doctorNotes;
}
