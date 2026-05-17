package com.example.HospitalSystem.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * Response DTO for the Doctor Dashboard (UC: Doctor Dashboard).
 * Summarises today's schedule and pending/confirmed appointment counts.
 */
@Getter
@Builder
public class DoctorDashboardResponse {

    private Integer doctorId;
    private String doctorName;
    private String specialization;
    private String availabilityStatus;

    /** Total appointments scheduled for today. */
    private int todayTotal;

    /** Appointments still pending confirmation. */
    private int todayPending;

    /** Appointments confirmed for today. */
    private int todayConfirmed;

    /** Appointments already completed today. */
    private int todayCompleted;

    /** Lightweight list of today's appointments for the schedule view. */
    private List<AppointmentSummary> todayAppointments;

    @Getter
    @Builder
    public static class AppointmentSummary {
        private Integer appointmentId;
        private String patientName;
        private String appointmentTime;
        private String status;
        private String reason;
    }
}
