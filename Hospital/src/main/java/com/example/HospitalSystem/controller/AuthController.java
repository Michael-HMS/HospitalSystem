package com.example.HospitalSystem.controller;

import com.example.HospitalSystem.dto.AuthRequest;
import com.example.HospitalSystem.dto.RegisterRequest;
import com.example.HospitalSystem.entity.Patient;
import com.example.HospitalSystem.entity.User;
import com.example.HospitalSystem.entity.enums.UserRole;
import com.example.HospitalSystem.repository.DoctorRepository;
import com.example.HospitalSystem.repository.PatientRepository;
import com.example.HospitalSystem.repository.UserRepository;
import com.example.HospitalSystem.util.JwtUtil;
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
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                response.put("error", "Email is already registered");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            User newUser = new User();

            if (request.getUsername() != null) {
                String[] names = request.getUsername().split(" ", 2);
                newUser.setFirstName(names[0]);
                newUser.setLastName(names.length > 1 ? names[1] : "");
            } else {
                newUser.setFirstName("Unknown");
                newUser.setLastName("");
            }

            newUser.setEmail(request.getEmail());
            String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());
            newUser.setPasswordHash(hashedPassword);
            newUser.setRole(UserRole.Patient);
            userRepository.save(newUser);

            Patient newPatient = new Patient();
            newPatient.setUser(newUser);
            Patient savedPatient = patientRepository.save(newPatient);

            response.put("message", "User registered successfully as Patient");
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", newUser.getUserId());
            userData.put("profileId", savedPatient.getPatientId());
            userData.put("firstName", newUser.getFirstName());
            userData.put("lastName", newUser.getLastName());
            userData.put("email", newUser.getEmail());
            response.put("user", userData);

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

            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (BCrypt.checkpw(password, user.getPasswordHash())) {
                    String roleName = user.getRole().name();
                    String token = jwtUtil.generateToken(email, roleName);

                    HttpHeaders headers = new HttpHeaders();
                    headers.set("Authorization", "Bearer " + token);

                    response.put("message", "Login successful");
                    response.put("role", roleName);

                    Map<String, Object> userData = new HashMap<>();
                    userData.put("email", email);
                    userData.put("id", user.getUserId());
                    userData.put("firstName", user.getFirstName());
                    userData.put("lastName", user.getLastName());

                    // Resolve the role-specific profile ID (doctor_id or patient_id)
                    // so the frontend can call role-specific endpoints directly
                    if (user.getRole() == UserRole.Doctor) {
                        doctorRepository.findByUser_UserId(user.getUserId())
                                .ifPresent(d -> userData.put("profileId", d.getDoctorId()));
                    } else if (user.getRole() == UserRole.Patient) {
                        patientRepository.findByUser_UserId(user.getUserId())
                                .ifPresent(p -> userData.put("profileId", p.getPatientId()));
                    } else {
                        userData.put("profileId", user.getUserId());
                    }

                    response.put("user", userData);
                    response.put("token", token);

                    return ResponseEntity.ok().headers(headers).body(response);
                }
            }

            response.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Internal Server Error during login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
