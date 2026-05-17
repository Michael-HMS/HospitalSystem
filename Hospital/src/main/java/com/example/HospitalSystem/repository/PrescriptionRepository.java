package com.example.HospitalSystem.repository;

import com.example.HospitalSystem.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {

    List<Prescription> findByPatient_PatientIdOrderByIssueDateDesc(Integer patientId);

    List<Prescription> findByDoctor_DoctorId(Integer doctorId);
}
