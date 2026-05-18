package com.example.hospitalsystem.entity.enums;

public enum PaymentMethod {
    CASH("Cash"),
    CREDIT_CARD("Credit Card"),
    DEBIT_CARD("Debit Card"),
    INSURANCE("Insurance"),
    ONLINE_PAYMENT("Online Payment");

    private final String dbValue;

    PaymentMethod(String dbValue) {
        this.dbValue = dbValue;
    }

    public String getDbValue() {
        return dbValue;
    }

    public static PaymentMethod fromDbValue(String value) {
        for (PaymentMethod method : values()) {
            if (method.dbValue.equals(value)) {
                return method;
            }
        }
        throw new IllegalArgumentException("Unknown PaymentMethod: " + value);
    }
}
