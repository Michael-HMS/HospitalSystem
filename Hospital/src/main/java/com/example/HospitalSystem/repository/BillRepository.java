package com.example.HospitalSystem.repository;

import com.example.HospitalSystem.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {
    List<Bill> findByPatient_PatientId(Integer patientId);
}
