package com.example.HospitalSystem.pattern.bridge;

/**
 * Bridge Pattern — Abstraction
 *
 * Defines the high-level notification operations that the doctor service uses.
 * It holds a reference to a {@link MessageSender} (the bridge) so the delivery
 * channel can be swapped at runtime without changing this class.
 *
 * Subclasses (RefinedAbstractions) represent specific notification types:
 * appointment reminders, status change alerts, etc.
 */
public abstract class DoctorNotification {

    /** The delivery channel injected via the bridge. */
    protected final MessageSender sender;

    protected DoctorNotification(MessageSender sender) {
        this.sender = sender;
    }

    /**
     * Sends the notification to the given recipient address/phone.
     *
     * @param recipient email address or phone number
     */
    public abstract void send(String recipient);
}
