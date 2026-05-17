package com.example.HospitalSystem.pattern.factory;

import com.example.HospitalSystem.entity.enums.AppointmentStatus;

/**
 * Factory Method Pattern — Creator
 *
 * WHY: The service layer should not need to know which concrete handler class
 * to instantiate. It simply asks the factory for "the handler for Confirmed"
 * and calls handle(). This keeps the service clean and makes it trivial to
 * add new transitions without touching the service.
 *
 * PATTERN: Factory Method (GoF Creational)
 *
 * Usage example in DoctorService:
 * <pre>
 *   AppointmentStatusHandler handler =
 *       AppointmentStatusHandlerFactory.getHandler(AppointmentStatus.Confirmed);
 *   handler.handle(appointment);
 * </pre>
 */
public class AppointmentStatusHandlerFactory {

    private AppointmentStatusHandlerFactory() {
        // Utility class — no instantiation
    }

    /**
     * Returns the appropriate handler for the requested target status.
     *
     * @param targetStatus the status the appointment should transition TO
     * @return a handler that performs and validates the transition
     * @throws IllegalArgumentException if no handler exists for the given status
     */
    public static AppointmentStatusHandler getHandler(AppointmentStatus targetStatus) {
        return switch (targetStatus) {
            case Confirmed  -> new ConfirmAppointmentHandler();
            case Completed  -> new CompleteAppointmentHandler();
            case Cancelled  -> new CancelAppointmentHandler();
            default -> throw new IllegalArgumentException(
                    "No handler available for status transition to: " + targetStatus);
        };
    }
}
