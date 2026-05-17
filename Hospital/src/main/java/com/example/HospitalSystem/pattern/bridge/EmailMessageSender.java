package com.example.HospitalSystem.pattern.bridge;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Bridge Pattern — Concrete Implementor: Email delivery.
 *
 * In production this would integrate with JavaMailSender or an SMTP service.
 * The log statement acts as a placeholder so the pattern is demonstrable
 * without requiring an email server in the development environment.
 */
@Component("emailSender")
public class EmailMessageSender implements MessageSender {

    private static final Logger log = LoggerFactory.getLogger(EmailMessageSender.class);

    @Override
    public void send(String recipient, String subject, String body) {
        // TODO: replace with real JavaMailSender integration
        log.info("[EMAIL] To: {} | Subject: {} | Body: {}", recipient, subject, body);
    }
}
