package com.example.HospitalSystem.dto;

import com.example.HospitalSystem.entity.enums.AvailabilityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorResponse {
    private Integer doctorId;
    private String firstName;
    private String lastName;
    private String email;
    private String specialization;
    private String departmentName;
    private Integer yearsOfExperience;
    private AvailabilityStatus availabilityStatus;
}
