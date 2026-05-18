package com.example.hospitalsystem.entity.enums;

public enum AvailabilityStatus {
    AVAILABLE("Available"),
    BUSY("Busy"),
    ON_LEAVE("On Leave");

    private final String dbValue;

    AvailabilityStatus(String dbValue) {
        this.dbValue = dbValue;
    }

    public String getDbValue() {
        return dbValue;
    }

    public static AvailabilityStatus fromDbValue(String value) {
        for (AvailabilityStatus status : values()) {
            if (status.dbValue.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown AvailabilityStatus: " + value);
    }
}
