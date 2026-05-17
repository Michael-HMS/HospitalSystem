package com.example.HospitalSystem.pattern.bridge;

/**
 * Bridge Pattern — Refined Abstraction: Appointment Status Change Notification.
 *
 * Sent to a patient when a doctor changes their appointment status
 * (e.g., Confirmed or Cancelled). The delivery channel (email/SMS) is
 * determined by whichever {@link MessageSender} is injected.
 */
public class AppointmentStatusNotification extends DoctorNotification {

    private final String patientName;
    private final String newStatus;
    private final String appointmentDate;

    public AppointmentStatusNotification(MessageSender sender,
                                         String patientName,
                                         String newStatus,
                                         String appointmentDate) {
        super(sender);
        this.patientName     = patientName;
        this.newStatus       = newStatus;
        this.appointmentDate = appointmentDate;
    }

    @Override
    public void send(String recipient) {
        String subject = "Your appointment has been " + newStatus;
        String body    = String.format(
                "Dear %s, your appointment on %s has been %s. Please contact us if you have questions.",
                patientName, appointmentDate, newStatus);
        sender.send(recipient, subject, body);
    }
}
