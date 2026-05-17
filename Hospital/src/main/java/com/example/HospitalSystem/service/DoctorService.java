package com.example.HospitalSystem.service;

import com.example.HospitalSystem.dto.DoctorRegisterRequest;
import com.example.HospitalSystem.dto.DoctorResponse;
import com.example.HospitalSystem.entity.Department;
import com.example.HospitalSystem.entity.Doctor;
import com.example.HospitalSystem.entity.User;
import com.example.HospitalSystem.entity.enums.AvailabilityStatus;
import com.example.HospitalSystem.entity.enums.UserRole;
import com.example.HospitalSystem.repository.DepartmentRepository;
import com.example.HospitalSystem.repository.DoctorRepository;
import com.example.HospitalSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public DoctorResponse onboardDoctor(DoctorRegisterRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));

        // Ensure user hasn't already been onboarded
        if (doctorRepository.findAll().stream().anyMatch(d -> d.getUser().getUserId().equals(request.getUserId()))) {
            throw new RuntimeException("Doctor profile already exists for this User!");
        }

        // Set role just in case it wasn't
        user.setRole(UserRole.Doctor);
        userRepository.save(user);

        // Fetch or create Department
        Department dept = departmentRepository.findByDepartmentName(request.getDepartmentName())
                .orElseGet(() -> {
                    Department newDept = new Department();
                    newDept.setDepartmentName(request.getDepartmentName());
                    return departmentRepository.save(newDept);
                });

        Doctor doctor = Doctor.builder()
                .user(user)
                .department(dept)
                .specialization(request.getSpecialization())
                .yearsOfExperience(request.getYearsOfExperience() != null ? request.getYearsOfExperience() : 0)
                .availabilityStatus(AvailabilityStatus.AVAILABLE)
                .build();

        Doctor savedDoctor = doctorRepository.save(doctor);
        return mapToResponse(savedDoctor);
    }

    public List<DoctorResponse> searchDoctors(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return doctorRepository.findAll().stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }
        return doctorRepository.searchDoctors(keyword.trim()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private DoctorResponse mapToResponse(Doctor doctor) {
        return DoctorResponse.builder()
                .doctorId(doctor.getDoctorId())
                .firstName(doctor.getUser().getFirstName())
                .lastName(doctor.getUser().getLastName())
                .email(doctor.getUser().getEmail())
                .specialization(doctor.getSpecialization())
                .departmentName(doctor.getDepartment() != null ? doctor.getDepartment().getDepartmentName() : null)
                .yearsOfExperience(doctor.getYearsOfExperience())
                .availabilityStatus(doctor.getAvailabilityStatus())
                .build();
    }
}
