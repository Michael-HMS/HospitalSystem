package com.example.HospitalSystem.dto;

import com.example.HospitalSystem.entity.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientCreateRequest {

    // User details
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone;
    private Gender gender;
    private LocalDate dateOfBirth;
    private String address;

    // Patient specific details
    private String bloodType;
    private String emergencyContact;
    private String insuranceNumber;
    private String allergies;
    private String medicalHistory;
}
