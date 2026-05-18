package com.example.HospitalSystem.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class MedicationResponse {

    private Integer medicationId;
    private String medicationName;
    private String description;
    private Integer stockQuantity;
    private LocalDate expiryDate;
    private BigDecimal price;
}
