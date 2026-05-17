package com.example.HospitalSystem.repository;

import com.example.HospitalSystem.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Optional<Admin> findByUserEmail(String email);
}
