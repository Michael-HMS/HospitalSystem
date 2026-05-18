package com.example.HospitalSystem.dto;

import com.example.HospitalSystem.entity.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponse {
    private Integer patientId;
    private Integer userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Gender gender;
    
    private String bloodType;
    private String emergencyContact;
    private String insuranceNumber;
}
