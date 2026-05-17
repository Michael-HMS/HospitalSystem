package com.example.HospitalSystem.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Response DTO for an Appointment.
 * Used by the doctor's appointment list endpoint.
 *
 * Covers Module 3: Appointment Management — view scheduled appointments.
 */
@Getter
@Builder
public class AppointmentResponse {

    private Integer   appointmentId;
    private Integer   patientId;
    private String    patientName;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String    status;
    private String    reason;
}
