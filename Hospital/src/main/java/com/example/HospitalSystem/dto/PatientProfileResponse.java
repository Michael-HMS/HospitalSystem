package com.example.HospitalSystem.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * Response DTO for a patient's full profile.
 * Used by doctors when accessing patient records before a consultation.
 *
 * Covers Module 2: Patient Records Management — view patient profiles.
 */
@Getter
@Builder
public class PatientProfileResponse {

    private Integer patientId;
    private String  firstName;
    private String  lastName;
    private String  email;
    private String  phone;
    private String  dateOfBirth;
    private String  gender;
    private String  bloodType;
    private String  allergies;
    private String  medicalHistory;
    private String  emergencyContact;
    private String  insuranceNumber;
}
