package com.example.HospitalSystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class MedicationCreateRequest {

    @NotBlank(message = "Medication name is required")
    private String medicationName;

    private String description;
    private Integer stockQuantity;
    private LocalDate expiryDate;

    @NotNull(message = "Price is required")
    private BigDecimal price;
}
