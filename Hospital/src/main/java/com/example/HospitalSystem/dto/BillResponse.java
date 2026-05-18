package com.example.HospitalSystem.dto;

import com.example.HospitalSystem.entity.enums.BillStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class BillResponse {
    private Integer billId;
    private Integer patientId;
    private Double totalAmount;
    private Double paidAmount;
    private BillStatus status;
    private LocalDate issuedDate;
    private LocalDate dueDate;
}
