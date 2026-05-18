package com.example.HospitalSystem.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalPatients;
    private long totalDoctors;
    private long totalAppointments;
}
