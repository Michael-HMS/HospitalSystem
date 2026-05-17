package com.example.HospitalSystem.dto;

import lombok.Data;

@Data
public class DoctorRegisterRequest {
    private Integer userId;
    private String departmentName;
    private String specialization;
    private Integer yearsOfExperience;
}
