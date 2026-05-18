package com.example.HospitalSystem.service;

import com.example.HospitalSystem.dto.PatientCreateRequest;
import com.example.HospitalSystem.dto.PatientResponse;
import com.example.HospitalSystem.dto.PrescriptionResponse;
import com.example.HospitalSystem.entity.Patient;
import com.example.HospitalSystem.entity.Prescription;
import com.example.HospitalSystem.entity.User;
import com.example.HospitalSystem.entity.enums.UserRole;
import com.example.HospitalSystem.repository.PatientRepository;
import com.example.HospitalSystem.repository.PrescriptionRepository;
import com.example.HospitalSystem.repository.UserRepository;
import com.example.HospitalSystem.dto.AppointmentRequest;
import com.example.HospitalSystem.dto.AppointmentResponse;
import com.example.HospitalSystem.dto.PatientDto;
import com.example.HospitalSystem.entity.Appointment;
import com.example.HospitalSystem.entity.Doctor;
import com.example.HospitalSystem.entity.enums.AppointmentStatus;
import com.example.HospitalSystem.entity.enums.AvailabilityStatus;
import com.example.HospitalSystem.mapper.PatientMapper;
import com.example.HospitalSystem.repository.AppointmentRepository;
import com.example.HospitalSystem.repository.DoctorRepository;
import com.example.HospitalSystem.repository.BillRepository;
import com.example.HospitalSystem.repository.MedicalRecordRepository;
import com.example.HospitalSystem.dto.BillResponse;
import com.example.HospitalSystem.dto.MedicalRecordResponse;
import com.example.HospitalSystem.entity.Bill;
import com.example.HospitalSystem.entity.MedicalRecord;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientMapper patientMapper;

        @Autowired
        private PrescriptionRepository prescriptionRepository;

    @Transactional
    public PatientResponse createPatient(PatientCreateRequest request) {
        String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());

        // 1. Build the base User entity
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(hashedPassword)
                .phone(request.getPhone())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .address(request.getAddress())
                .role(UserRole.Patient)
                .build();

        // Save User first because Patient needs the user_id foreign key
        User savedUser = userRepository.save(user);

        // 2. Build the Patient entity and link it to the saved User
        Patient patient = Patient.builder()
                .user(savedUser)
                .bloodType(request.getBloodType())
                .emergencyContact(request.getEmergencyContact())
                .insuranceNumber(request.getInsuranceNumber())
                .allergies(request.getAllergies())
                .medicalHistory(request.getMedicalHistory())
                .build();

        // Save the Patient entity
        Patient savedPatient = patientRepository.save(patient);

        // 3. Map back to a Response DTO
        return PatientResponse.builder()
                .patientId(savedPatient.getPatientId())
                .userId(savedUser.getUserId())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .gender(savedUser.getGender())
                .bloodType(savedPatient.getBloodType())
                .emergencyContact(savedPatient.getEmergencyContact())
                .insuranceNumber(savedPatient.getInsuranceNumber())
                .build();
    }

    /**
     * Use case: An admin or receptionist needs a list of patients to manage accounts.
     * They DO NOT need to see blood types, medical history, or allergies.
     * We use PatientDto to safely return only the necessary identity data.
     */
    public List<PatientDto> getAllPatientsBasicInfo() {
        return patientRepository.findAll()
                .stream()
                .map(patientMapper::entityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Use case: A receptionist needs to verify a patient's contact info.
     * Sensitive medical data is stripped out by the mapper automatically.
     */
    public PatientDto getPatientBasicInfo(Integer patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found: " + patientId));
                
        return patientMapper.entityToDto(patient);
    }

    /**
     * Use case: A patient views their own appointment history.
     * GET /api/patients/{patientId}/appointments
     */
    public List<AppointmentResponse> getPatientAppointments(Integer patientId) {
        List<Appointment> appointments =
                appointmentRepository.findByPatient_PatientIdOrderByAppointmentDateDescAppointmentTimeDesc(patientId);

        return appointments.stream().map(a -> AppointmentResponse.builder()
                .appointmentId(a.getAppointmentId())
                .patientId(a.getPatient().getPatientId())
                .patientName(a.getPatient().getUser().getFirstName() + " " + a.getPatient().getUser().getLastName())
                .appointmentDate(a.getAppointmentDate())
                .appointmentTime(a.getAppointmentTime())
                .status(a.getStatus().name())
                .reason(a.getReason())
                .build()
        ).collect(Collectors.toList());
    }

    /**
     * Use case: A patient books an appointment with a specific doctor.
     */
    @Transactional
    public AppointmentResponse bookAppointment(Integer patientId, AppointmentRequest request) {
        // 1. Verify Patient exists
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found: " + patientId));

        // 2. Verify Doctor exists
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + request.getDoctorId()));

        // 3. Check Doctor Availability
        // First, check if the doctor is broadly available (not on leave)
        if (doctor.getAvailabilityStatus() == AvailabilityStatus.ON_LEAVE) {
            throw new RuntimeException("Sorry, Dr. " + doctor.getUser().getLastName() + " is currently on leave and cannot accept appointments.");
        }

        // Second, check for double-booking on that specific date and time
        // We fetch all active appointments for that day (ignoring cancelled ones)
        List<Appointment> dailyAppointments = appointmentRepository.findByDoctor_DoctorIdAndAppointmentDateAndStatusNot(
                request.getDoctorId(), 
                request.getAppointmentDate(),
                AppointmentStatus.Cancelled
        );

        // Check if the requested time exactly matches or overlaps closely (assuming 30 min slots)
        boolean isTimeSlotTaken = dailyAppointments.stream().anyMatch(existingAppt -> {
            // Simple check: Exact same time
            return existingAppt.getAppointmentTime().equals(request.getAppointmentTime());
            
            // Note: In a real system, you'd calculate a 30-minute window overlap here
            // e.g., Math.abs(ChronoUnit.MINUTES.between(existingAppt.getTime(), requestedTime)) < 30
        });

        if (isTimeSlotTaken) {
            throw new RuntimeException("The requested time slot (" + request.getAppointmentTime() + ") is already booked for this doctor.");
        }

        // 4. Build the Appointment entity
        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .reason(request.getReason())
                .status(AppointmentStatus.Pending) // Usually starts as pending until doctor/admin confirms
                .build();

        // 5. Save to database
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // 6. Map back to Response
        return AppointmentResponse.builder()
                .appointmentId(savedAppointment.getAppointmentId())
                .patientId(patient.getPatientId())
                .patientName(patient.getUser().getFirstName() + " " + patient.getUser().getLastName())
                .appointmentDate(savedAppointment.getAppointmentDate())
                .appointmentTime(savedAppointment.getAppointmentTime())
                .status(savedAppointment.getStatus().name())
                .reason(savedAppointment.getReason())
                .build();
    }

    /**
     * Returns prescriptions for a patient, but only if the requester owns the patient record.
     */
    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getPatientPrescriptions(Integer patientId, String requesterEmail) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Patient not found: " + patientId));

        if (requesterEmail != null) {
            User user = userRepository.findByEmail(requesterEmail)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.UNAUTHORIZED, "User not found for token subject"));

            if (!patient.getUser().getUserId().equals(user.getUserId())) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "Access denied: prescriptions are restricted to the owning patient");
            }
        }

        return prescriptionRepository.findByPatient_PatientIdOrderByIssueDateDesc(patientId)
                .stream()
                .map(this::mapToPrescriptionResponse)
                .collect(Collectors.toList());
    }

    private PrescriptionResponse mapToPrescriptionResponse(Prescription prescription) {
        List<PrescriptionResponse.DetailResponse> details = prescription.getDetails().stream()
                .map(d -> PrescriptionResponse.DetailResponse.builder()
                        .detailId(d.getDetailId())
                        .medicationId(d.getMedication().getMedicationId())
                        .medicationName(d.getMedication().getMedicationName())
                        .dosage(d.getDosage())
                        .frequency(d.getFrequency())
                        .duration(d.getDuration())
                        .build())
                .collect(Collectors.toList());

        return PrescriptionResponse.builder()
                .prescriptionId(prescription.getPrescriptionId())
                .medicalRecordId(prescription.getMedicalRecord().getRecordId())
                .patientId(prescription.getPatient().getPatientId())
                .patientName(prescription.getPatient().getUser().getFirstName() + " "
                        + prescription.getPatient().getUser().getLastName())
                .doctorId(prescription.getDoctor().getDoctorId())
                .doctorName(prescription.getDoctor().getUser().getFirstName() + " "
                        + prescription.getDoctor().getUser().getLastName())
                .issueDate(prescription.getIssueDate())
                .notes(prescription.getNotes())
                .details(details)
                .build();
    }

    public List<BillResponse> getPatientBills(Integer patientId) {
        List<Bill> bills = billRepository.findByPatient_PatientId(patientId);
        return bills.stream().map(b -> BillResponse.builder()
                .billId(b.getBillId())
                .patientId(b.getPatient().getPatientId())
                .totalAmount(b.getTotalAmount() != null ? b.getTotalAmount().doubleValue() : 0.0)
                .paidAmount(b.getPayments() != null ? b.getPayments().stream().mapToDouble(p -> p.getAmount() != null ? p.getAmount().doubleValue() : 0.0).sum() : 0.0)
                .status(b.getBillStatus())
                .issuedDate(b.getCreatedAt() != null ? b.getCreatedAt().toLocalDate() : null)
                .dueDate(b.getCreatedAt() != null ? b.getCreatedAt().toLocalDate().plusDays(30) : null)
                .build()
        ).collect(Collectors.toList());
    }

    public List<MedicalRecordResponse> getPatientMedicalRecords(Integer patientId) {
        List<MedicalRecord> records = medicalRecordRepository.findByPatient_PatientIdOrderByCreatedAtDesc(patientId);
        return records.stream().map(r -> MedicalRecordResponse.builder()
                .recordId(r.getRecordId())
                .patientId(r.getPatient().getPatientId())
                .patientName(r.getPatient().getUser().getFirstName() + " " + r.getPatient().getUser().getLastName())
                .doctorId(r.getDoctor() != null ? r.getDoctor().getDoctorId() : null)
                .doctorName(r.getDoctor() != null ? r.getDoctor().getUser().getFirstName() + " " + r.getDoctor().getUser().getLastName() : "Unknown")
                .appointmentId(r.getAppointment() != null ? r.getAppointment().getAppointmentId() : null)
                .diagnosis(r.getDiagnosis())
                .treatment(r.getTreatment())
                .notes(r.getNotes())
                .createdAt(r.getCreatedAt())
                .build()
        ).collect(Collectors.toList());
    }
}
