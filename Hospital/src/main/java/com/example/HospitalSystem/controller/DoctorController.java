package com.example.HospitalSystem.controller;

import com.example.HospitalSystem.dto.DoctorRegisterRequest;
import com.example.HospitalSystem.dto.DoctorResponse;
import com.example.HospitalSystem.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // Promote a registered User to a Doctor Profile
    @PostMapping("/onboard")
    public ResponseEntity<DoctorResponse> onboardDoctor(@RequestBody DoctorRegisterRequest request) {
        return ResponseEntity.ok(doctorService.onboardDoctor(request));
    }

    // Search for a doctor (Patient uses this)
    @GetMapping("/search")
    public ResponseEntity<List<DoctorResponse>> searchDoctors(
            @RequestParam(value = "keyword", required = false) String keyword) {
        List<DoctorResponse> result = doctorService.searchDoctors(keyword);
        return ResponseEntity.ok(result);
    }

    // Get all doctors
    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }
}
