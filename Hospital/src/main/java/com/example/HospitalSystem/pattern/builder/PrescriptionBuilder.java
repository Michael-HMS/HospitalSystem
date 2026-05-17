package com.example.HospitalSystem.pattern.builder;

import com.example.HospitalSystem.entity.Doctor;
import com.example.HospitalSystem.entity.Medication;
import com.example.HospitalSystem.entity.MedicalRecord;
import com.example.HospitalSystem.entity.Patient;
import com.example.HospitalSystem.entity.Prescription;
import com.example.HospitalSystem.entity.PrescriptionDetail;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Builder Pattern — PrescriptionBuilder
 *
 * WHY: A Prescription is a composite object — it owns a list of PrescriptionDetail
 * entries, each with its own dosage, frequency, and duration. Building this
 * step-by-step with a fluent API is far cleaner than passing a pre-built list
 * into a constructor, and it makes the intent of each medication line explicit.
 *
 * PATTERN: Builder (GoF Creational)
 * BENEFIT: Each medication line is added declaratively; the builder validates
 *          that at least one medication is present before building.
 */
public class PrescriptionBuilder {

    // Required
    private final MedicalRecord medicalRecord;
    private final Doctor doctor;
    private final Patient patient;

    // Optional
    private String notes;
    private LocalDate issueDate = LocalDate.now();

    // Accumulated medication lines
    private final List<PrescriptionDetail> details = new ArrayList<>();

    public PrescriptionBuilder(MedicalRecord medicalRecord, Doctor doctor, Patient patient) {
        if (medicalRecord == null) throw new IllegalArgumentException("MedicalRecord is required");
        if (doctor == null)        throw new IllegalArgumentException("Doctor is required");
        if (patient == null)       throw new IllegalArgumentException("Patient is required");

        this.medicalRecord = medicalRecord;
        this.doctor        = doctor;
        this.patient       = patient;
    }

    public PrescriptionBuilder withNotes(String notes) {
        this.notes = notes;
        return this;
    }

    public PrescriptionBuilder withIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
        return this;
    }

    /**
     * Adds a single medication line to the prescription.
     *
     * @param medication the medication entity
     * @param dosage     e.g. "500mg"
     * @param frequency  e.g. "Twice daily"
     * @param duration   e.g. "7 days"
     */
    public PrescriptionBuilder addMedication(Medication medication,
                                             String dosage,
                                             String frequency,
                                             String duration) {
        if (medication == null) throw new IllegalArgumentException("Medication cannot be null");
        if (dosage == null || dosage.isBlank()) throw new IllegalArgumentException("Dosage is required");

        PrescriptionDetail detail = PrescriptionDetail.builder()
                .medication(medication)
                .dosage(dosage)
                .frequency(frequency)
                .duration(duration)
                .build();

        this.details.add(detail);
        return this;
    }

    /**
     * Builds the {@link Prescription} and wires each {@link PrescriptionDetail}
     * back to it so the bidirectional relationship is consistent.
     */
    public Prescription build() {
        if (details.isEmpty()) {
            throw new IllegalStateException("A prescription must contain at least one medication");
        }

        Prescription prescription = Prescription.builder()
                .medicalRecord(medicalRecord)
                .doctor(doctor)
                .patient(patient)
                .issueDate(issueDate)
                .notes(notes)
                .build();

        // Wire the back-reference on each detail
        details.forEach(d -> d.setPrescription(prescription));
        prescription.getDetails().addAll(details);

        return prescription;
    }
}
