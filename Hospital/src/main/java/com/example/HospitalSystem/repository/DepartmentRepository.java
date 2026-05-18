package com.example.HospitalSystem.repository;

import com.example.HospitalSystem.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    Optional<Department> findByDepartmentName(String departmentName);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT d FROM Department d LEFT JOIN FETCH d.doctors doc LEFT JOIN FETCH doc.user")
    java.util.List<Department> findAllWithDoctorsAndUsers();

    @org.springframework.data.jpa.repository.Query("SELECT d FROM Department d LEFT JOIN FETCH d.doctors doc LEFT JOIN FETCH doc.user WHERE d.departmentId = :id")
    Optional<Department> findByIdWithDoctorsAndUsers(@org.springframework.data.repository.query.Param("id") Integer id);
}
