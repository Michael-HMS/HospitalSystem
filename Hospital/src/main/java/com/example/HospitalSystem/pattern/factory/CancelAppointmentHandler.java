package com.example.HospitalSystem.pattern.factory;

import com.example.HospitalSystem.entity.Appointment;
import com.example.HospitalSystem.entity.enums.AppointmentStatus;

/**
 * Concrete handler: cancels an appointment.
 * Pending and Confirmed appointments may be cancelled; Completed ones cannot.
 */
public class CancelAppointmentHandler implements AppointmentStatusHandler {

    @Override
    public void handle(Appointment appointment) {
        if (appointment.getStatus() == AppointmentStatus.Completed) {
            throw new IllegalStateException("A completed appointment cannot be cancelled.");
        }
        if (appointment.getStatus() == AppointmentStatus.Cancelled) {
            throw new IllegalStateException("Appointment is already cancelled.");
        }
        appointment.setStatus(AppointmentStatus.Cancelled);
    }
}
