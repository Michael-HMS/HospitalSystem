package com.example.HospitalSystem.dto;

import lombok.Data;

@Data
public class PatientDto {
    private Integer patientId;
    
    // We nest the UserDto here so when a Patient is mapped, 
    // it automatically maps the non-sensitive User data too.
    private UserDto user;
    
    // Note: Sensitive data like bloodType, medicalHistory, allergies 
    // are INTENTIONALLY excluded from this basic DTO to keep them hidden.
}
