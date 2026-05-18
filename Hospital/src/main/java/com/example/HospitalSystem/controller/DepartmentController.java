package com.example.HospitalSystem.controller;

import com.example.HospitalSystem.entity.Department;
import com.example.HospitalSystem.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST controller for Department lookup endpoints.
 * Used by the frontend Departments page and the Doctors filter dropdown.
 */
@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    @Autowired
    private DepartmentRepository departmentRepository;

    /**
     * GET /api/departments
     * Returns all departments with their basic info and doctor list.
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllDepartments() {
        List<Department> departments = departmentRepository.findAllWithDoctorsAndUsers();

        List<Map<String, Object>> result = departments.stream().map(dept -> {
            List<Map<String, Object>> doctorList = dept.getDoctors().stream().map(doc -> {
                Map<String, Object> docMap = new java.util.HashMap<>();
                docMap.put("doctorId", doc.getDoctorId());
                if (doc.getUser() != null) {
                    docMap.put("firstName", doc.getUser().getFirstName());
                    docMap.put("lastName", doc.getUser().getLastName());
                }
                docMap.put("specialization", doc.getSpecialization());
                return docMap;
            }).collect(Collectors.toList());

            Map<String, Object> deptMap = new java.util.HashMap<>();
            deptMap.put("departmentId", dept.getDepartmentId());
            deptMap.put("departmentName", dept.getDepartmentName());
            deptMap.put("description", dept.getDescription());
            deptMap.put("doctors", doctorList);
            return deptMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/departments/{id}
     * Returns a single department by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getDepartmentById(@PathVariable Integer id) {
        return departmentRepository.findByIdWithDoctorsAndUsers(id)
                .map(dept -> {
                    List<Map<String, Object>> doctorList = dept.getDoctors().stream().map(doc -> {
                        Map<String, Object> docMap = new java.util.HashMap<>();
                        docMap.put("doctorId", doc.getDoctorId());
                        if (doc.getUser() != null) {
                            docMap.put("firstName", doc.getUser().getFirstName());
                            docMap.put("lastName", doc.getUser().getLastName());
                        }
                        docMap.put("specialization", doc.getSpecialization());
                        return docMap;
                    }).collect(Collectors.toList());

                    Map<String, Object> deptMap = new java.util.HashMap<>();
                    deptMap.put("departmentId", dept.getDepartmentId());
                    deptMap.put("departmentName", dept.getDepartmentName());
                    deptMap.put("description", dept.getDescription());
                    deptMap.put("doctors", doctorList);
                    return ResponseEntity.ok(deptMap);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
