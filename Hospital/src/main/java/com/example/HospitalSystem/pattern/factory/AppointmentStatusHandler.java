package com.example.HospitalSystem.pattern.factory;

import com.example.HospitalSystem.entity.Appointment;

/**
 * Factory Method Pattern — Product Interface
 *
 * WHY: Each appointment status transition (Confirm, Complete, Cancel) has its own
 * validation rules and side effects. Encoding all of that in a single if/else block
 * inside the service creates a fragile, hard-to-extend method.
 *
 * By defining a common handler interface, each transition becomes its own class
 * with a single responsibility. Adding a new transition (e.g., "Reschedule") means
 * adding one new class — no existing code changes.
 *
 * PATTERN: Factory Method (GoF Creational) — this is the Product interface.
 *          {@link AppointmentStatusHandlerFactory} is the Creator.
 */
public interface AppointmentStatusHandler {

    /**
     * Applies the status transition to the given appointment.
     * Implementations are responsible for validating the current state
     * and throwing an exception if the transition is illegal.
     *
     * @param appointment the appointment to transition
     * @throws IllegalStateException if the transition is not allowed from the current status
     */
    void handle(Appointment appointment);
}
