package com.example.HospitalSystem.pattern.bridge;

/**
 * Bridge Pattern — Implementation Interface (Implementor)
 *
 * WHY: The system needs to send notifications via multiple channels (Email, SMS).
 * Without the Bridge, every notification type would need to know about every
 * delivery channel, creating an M×N class explosion.
 *
 * The Bridge separates the "what to send" (Notification abstraction) from
 * "how to send it" (MessageSender implementation), so each can vary independently.
 *
 * PATTERN: Bridge (GoF Structural) — this is the Implementor.
 */
public interface MessageSender {

    /**
     * Sends a message to the specified recipient.
     *
     * @param recipient the address/phone number of the recipient
     * @param subject   a short subject line (used by email; ignored by SMS)
     * @param body      the full message body
     */
    void send(String recipient, String subject, String body);
}
