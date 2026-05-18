package com.example.HospitalSystem.dto;

import com.example.HospitalSystem.entity.enums.AvailabilityStatus;
import lombok.Data;

@Data
public class DoctorDto {
    private Integer doctorId;
    
    // Nests the safe UserDto to hide password and address
    private UserDto user;
    
    private String specialization;
    private String departmentName;
    private Integer yearsOfExperience;
    private AvailabilityStatus availabilityStatus;

    // Note: Sensitive/Internal data like licenseNumber, appointments list, 
    // and medicalRecords are intentionally EXCLUDED here.
}
