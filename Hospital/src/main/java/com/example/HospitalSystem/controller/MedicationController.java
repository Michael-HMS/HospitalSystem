package com.example.HospitalSystem.controller;

import com.example.HospitalSystem.entity.Medication;
import com.example.HospitalSystem.repository.MedicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST controller for Medication catalog endpoints.
 * Used by the Admin medications page and the doctor prescription form.
 */
@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    @Autowired
    private MedicationRepository medicationRepository;

    /**
     * GET /api/medications
     * Returns all medications in the system catalog.
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllMedications() {
        List<Medication> medications = medicationRepository.findAll();

        List<Map<String, Object>> result = medications.stream().map(med -> {
            Map<String, Object> medMap = new java.util.HashMap<>();
            medMap.put("medicationId", med.getMedicationId());
            medMap.put("medicationName", med.getMedicationName());
            medMap.put("description", med.getDescription());
            medMap.put("stockQuantity", med.getStockQuantity());
            medMap.put("expiryDate", med.getExpiryDate() != null ? med.getExpiryDate().toString() : null);
            medMap.put("price", med.getPrice());
            return medMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/medications/{id}
     * Returns a single medication by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicationById(@PathVariable Integer id) {
        return medicationRepository.findById(id)
                .map(med -> {
                    Map<String, Object> medMap = new java.util.HashMap<>();
                    medMap.put("medicationId", med.getMedicationId());
                    medMap.put("medicationName", med.getMedicationName());
                    medMap.put("description", med.getDescription());
                    medMap.put("stockQuantity", med.getStockQuantity());
                    medMap.put("expiryDate", med.getExpiryDate() != null ? med.getExpiryDate().toString() : null);
                    medMap.put("price", med.getPrice());
                    return ResponseEntity.ok(medMap);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
