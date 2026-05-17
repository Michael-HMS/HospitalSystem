package com.example.HospitalSystem.pattern.factory;

import com.example.HospitalSystem.entity.Appointment;
import com.example.HospitalSystem.entity.enums.AppointmentStatus;

/**
 * Concrete handler: transitions an appointment from Confirmed → Completed.
 * Only a confirmed appointment can be marked as completed — a doctor cannot
 * complete an appointment that was never confirmed.
 */
public class CompleteAppointmentHandler implements AppointmentStatusHandler {

    @Override
    public void handle(Appointment appointment) {
        if (appointment.getStatus() != AppointmentStatus.Confirmed) {
            throw new IllegalStateException(
                    "Only Confirmed appointments can be completed. Current status: " + appointment.getStatus());
        }
        appointment.setStatus(AppointmentStatus.Completed);
    }
}
