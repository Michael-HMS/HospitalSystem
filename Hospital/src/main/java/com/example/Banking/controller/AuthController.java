package com.example.Banking.controller;

import com.example.Banking.dto.AuthRequest;
import com.example.Banking.dto.RegisterRequest;
import com.example.Banking.entity.Admin;
import com.example.Banking.entity.Doctor;
import com.example.Banking.entity.Patient;
import com.example.Banking.entity.User;
import com.example.Banking.repository.AdminRepository;
import com.example.Banking.repository.DoctorRepository;
import com.example.Banking.repository.PatientRepository;
import com.example.Banking.util.JwtUtil;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Check if user already exists
            if (patientRepository.findByUserEmail(request.getEmail()).isPresent() ||
                    doctorRepository.findByUserEmail(request.getEmail()).isPresent() ||
                    adminRepository.findByEmail(request.getEmail()).isPresent()) {
                response.put("error", "Email is already registered");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Default register as Patient
            User newUser = new User();
            newUser.setRole(com.example.Banking.entity.enums.UserRole.Patient);

            // Handle "username" mapping to first/last name
            if (request.getUsername() != null) {
                String[] names = request.getUsername().split(" ", 2);
                newUser.setFirstName(names[0]);
                newUser.setLastName(names.length > 1 ? names[1] : "");
            } else {
                newUser.setFirstName("Unknown");
                newUser.setLastName("");
            }

            newUser.setEmail(request.getEmail());

            // Hash the password with jBCrypt
            String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());
            newUser.setPasswordHash(hashedPassword);

            Patient newPatient = new Patient();
            newPatient.setUser(newUser);
            patientRepository.save(newPatient);

            response.put("message", "User registered successfully as Patient");
            response.put("user", newPatient);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Internal Server Error during registration: " + e.getMessage());
            response.put("details", e.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String email = request.getEmail();
            String password = request.getPassword();

            // 1. Check in Patient Repository
            Optional<Patient> patientOpt = patientRepository.findByUserEmail(email);
            if (patientOpt.isPresent()) {
                return processLogin(patientOpt.get().getUser().getPasswordHash(), password, email, "Patient", patientOpt.get());
            }

            // 2. Check in Doctor Repository
            Optional<Doctor> doctorOpt = doctorRepository.findByUserEmail(email);
            if (doctorOpt.isPresent()) {
                return processLogin(doctorOpt.get().getUser().getPasswordHash(), password, email, "Doctor", doctorOpt.get());
            }

            // 3. Check in Admin Repository
            Optional<Admin> adminOpt = adminRepository.findByEmail(email);
            if (adminOpt.isPresent()) {
                return processLogin(adminOpt.get().getPassword(), password, email, "Admin", adminOpt.get());
            }

            // Not found in any role
            response.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Internal Server Error during login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private ResponseEntity<Map<String, Object>> processLogin(String storedHash, String rawPassword, String email,
            String role, Object userObj) {
        Map<String, Object> response = new HashMap<>();

        if (BCrypt.checkpw(rawPassword, storedHash)) {
            // Success! Generate token
            String token = jwtUtil.generateToken(email, role);

            // Add Header
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);

            // Prepare Response Body
            response.put("message", "Login successful");
            response.put("role", role);

            // Safely map user data to avoid Hibernate Jackson Proxy Serialization Errors!
            Map<String, Object> userData = new HashMap<>();
            userData.put("email", email);

            if (role.equals("Patient")) {
                Patient p = (Patient) userObj;
                userData.put("id", p.getPatientId());
                userData.put("firstName", p.getUser().getFirstName());
                userData.put("lastName", p.getUser().getLastName());
            } else if (role.equals("Doctor")) {
                Doctor d = (Doctor) userObj;
                userData.put("id", d.getDoctorId());
                userData.put("firstName", d.getUser().getFirstName());
                userData.put("lastName", d.getUser().getLastName());
            } else if (role.equals("Admin")) {
                Admin a = (Admin) userObj;
                userData.put("id", a.getAdminId());
                userData.put("name", a.getName());
            }

            response.put("user", userData);
            response.put("token", token);

            return ResponseEntity.ok().headers(headers).body(response);
        } else {
            // Password invalid
            response.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}
