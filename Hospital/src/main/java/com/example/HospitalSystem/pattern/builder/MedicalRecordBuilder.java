package com.example.HospitalSystem.pattern.builder;

import com.example.HospitalSystem.entity.Appointment;
import com.example.HospitalSystem.entity.Doctor;
import com.example.HospitalSystem.entity.MedicalRecord;
import com.example.HospitalSystem.entity.Patient;

/**
 * Builder Pattern — MedicalRecordBuilder
 *
 * WHY: A MedicalRecord has several optional fields (diagnosis, treatment, notes).
 * Constructing it inline with a large constructor is error-prone and hard to read.
 * The Builder separates the construction steps, making each field explicit and
 * allowing partial records to be created when a consultation is still in progress.
 *
 * PATTERN: Builder (GoF Creational)
 * BENEFIT: Fluent, readable construction; easy to add new optional fields later
 *          without breaking existing call sites.
 */
public class MedicalRecordBuilder {

    // Required fields
    private final Patient patient;
    private final Doctor doctor;
    private final Appointment appointment;

    // Optional fields — all default to null (not yet filled in)
    private String diagnosis;
    private String treatment;
    private String notes;

    /**
     * Constructor enforces the three mandatory associations.
     * Every medical record must be tied to a patient, a doctor, and an appointment.
     */
    public MedicalRecordBuilder(Patient patient, Doctor doctor, Appointment appointment) {
        if (patient == null)    throw new IllegalArgumentException("Patient is required");
        if (doctor == null)     throw new IllegalArgumentException("Doctor is required");
        if (appointment == null) throw new IllegalArgumentException("Appointment is required");

        this.patient     = patient;
        this.doctor      = doctor;
        this.appointment = appointment;
    }

    /** Sets the clinical diagnosis text. */
    public MedicalRecordBuilder withDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
        return this;
    }

    /** Sets the treatment plan or procedures performed. */
    public MedicalRecordBuilder withTreatment(String treatment) {
        this.treatment = treatment;
        return this;
    }

    /** Appends additional clinical notes. */
    public MedicalRecordBuilder withNotes(String notes) {
        this.notes = notes;
        return this;
    }

    /**
     * Builds and returns the fully constructed {@link MedicalRecord}.
     * Uses the entity's own Lombok @Builder to stay consistent with the rest of the project.
     */
    public MedicalRecord build() {
        return MedicalRecord.builder()
                .patient(patient)
                .doctor(doctor)
                .appointment(appointment)
                .diagnosis(diagnosis)
                .treatment(treatment)
                .notes(notes)
                .build();
    }
}
