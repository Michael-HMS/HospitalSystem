package com.example.hospitalsystem.entity.enums;

public enum BillStatus {
    UNPAID("Unpaid"),
    PARTIALLY_PAID("Partially Paid"),
    PAID("Paid"),
    CANCELLED("Cancelled");

    private final String dbValue;

    BillStatus(String dbValue) {
        this.dbValue = dbValue;
    }

    public String getDbValue() {
        return dbValue;
    }

    public static BillStatus fromDbValue(String value) {
        for (BillStatus status : values()) {
            if (status.dbValue.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown BillStatus: " + value);
    }
}
