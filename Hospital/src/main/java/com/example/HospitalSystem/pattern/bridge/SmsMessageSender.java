package com.example.HospitalSystem.pattern.bridge;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Bridge Pattern — Concrete Implementor: SMS delivery.
 *
 * In production this would call a provider like Twilio or AWS SNS.
 */
@Component("smsSender")
public class SmsMessageSender implements MessageSender {

    private static final Logger log = LoggerFactory.getLogger(SmsMessageSender.class);

    @Override
    public void send(String recipient, String subject, String body) {
        // Subject is not used for SMS — only the body is sent
        // TODO: replace with real SMS provider integration
        log.info("[SMS] To: {} | Message: {}", recipient, body);
    }
}
