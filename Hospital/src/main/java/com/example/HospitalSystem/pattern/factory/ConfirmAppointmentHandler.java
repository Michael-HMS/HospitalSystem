package com.example.HospitalSystem.pattern.factory;

import com.example.HospitalSystem.entity.Appointment;
import com.example.HospitalSystem.entity.enums.AppointmentStatus;

/**
 * Concrete handler: transitions an appointment from Pending → Confirmed.
 */
public class ConfirmAppointmentHandler implements AppointmentStatusHandler {

    @Override
    public void handle(Appointment appointment) {
        if (appointment.getStatus() != AppointmentStatus.Pending) {
            throw new IllegalStateException(
                    "Only Pending appointments can be confirmed. Current status: " + appointment.getStatus());
        }
        appointment.setStatus(AppointmentStatus.Confirmed);
    }
}
