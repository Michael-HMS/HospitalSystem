package com.example.HospitalSystem.repository;

import com.example.HospitalSystem.entity.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Integer> {

    /** All test results for a patient, newest first. */
    List<TestResult> findByPatient_PatientIdOrderByCreatedAtDesc(Integer patientId);

    /** All test results linked to a specific medical record. */
    List<TestResult> findByMedicalRecord_RecordId(Integer recordId);
}
