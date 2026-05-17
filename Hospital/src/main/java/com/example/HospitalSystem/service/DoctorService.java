package com.example.HospitalSystem.service;

import com.example.HospitalSystem.dto.AppointmentResponse;
import com.example.HospitalSystem.dto.DoctorDashboardResponse;
import com.example.HospitalSystem.dto.DoctorRegisterRequest;
import com.example.HospitalSystem.dto.DoctorResponse;
import com.example.HospitalSystem.dto.MedicalRecordRequest;
import com.example.HospitalSystem.dto.MedicalRecordResponse;
import com.example.HospitalSystem.dto.PatientProfileResponse;
import com.example.HospitalSystem.dto.PrescriptionRequest;
import com.example.HospitalSystem.dto.PrescriptionResponse;
import com.example.HospitalSystem.dto.TestResultNoteRequest;
import com.example.HospitalSystem.dto.TestResultResponse;
import com.example.HospitalSystem.entity.Appointment;
import com.example.HospitalSystem.entity.Department;
import com.example.HospitalSystem.entity.Doctor;
import com.example.HospitalSystem.entity.MedicalRecord;
import com.example.HospitalSystem.entity.Medication;
import com.example.HospitalSystem.entity.Patient;
import com.example.HospitalSystem.entity.Prescription;
import com.example.HospitalSystem.entity.TestResult;
import com.example.HospitalSystem.entity.User;
import com.example.HospitalSystem.entity.enums.AppointmentStatus;
import com.example.HospitalSystem.entity.enums.AvailabilityStatus;
import com.example.HospitalSystem.entity.enums.UserRole;
import com.example.HospitalSystem.pattern.bridge.AppointmentStatusNotification;
import com.example.HospitalSystem.pattern.bridge.MessageSender;
import com.example.HospitalSystem.pattern.builder.MedicalRecordBuilder;
import com.example.HospitalSystem.pattern.builder.PrescriptionBuilder;
import com.example.HospitalSystem.pattern.factory.AppointmentStatusHandler;
import com.example.HospitalSystem.pattern.factory.AppointmentStatusHandlerFactory;
import com.example.HospitalSystem.repository.AppointmentRepository;
import com.example.HospitalSystem.repository.DepartmentRepository;
import com.example.HospitalSystem.repository.DoctorRepository;
import com.example.HospitalSystem.repository.MedicalRecordRepository;
import com.example.HospitalSystem.repository.MedicationRepository;
import com.example.HospitalSystem.repository.PatientRepository;
import com.example.HospitalSystem.repository.PrescriptionRepository;
import com.example.HospitalSystem.repository.TestResultRepository;
import com.example.HospitalSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DoctorService — implements all six Doctor modules from the use case diagram.
 *
 * Module 1 — Doctor Dashboard : getDashboard()
 * Module 2 — Patient Records : getPatientProfile(), getPatientMedicalHistory()
 * Module 3 — Appointment Management : getDoctorAppointments(),
 * updateAppointmentStatus()
 * Module 4 — Diagnosis & Treatment : createMedicalRecord(),
 * updateMedicalRecord()
 * Module 5 — Prescription Management : createPrescription(),
 * getPatientPrescriptions()
 * Module 6 — Test Results : getTestResults(), addTestResultNote()
 * Includes Doctor Onboarding and Searching
 */
@Service
public class DoctorService {

        private final DoctorRepository doctorRepository;
        private final PatientRepository patientRepository;
        private final AppointmentRepository appointmentRepository;
        private final MedicalRecordRepository medicalRecordRepository;
        private final PrescriptionRepository prescriptionRepository;
        private final MedicationRepository medicationRepository;
        private final TestResultRepository testResultRepository;
        private final UserRepository userRepository;
        private final DepartmentRepository departmentRepository;

        private final MessageSender messageSender;

        public DoctorService(DoctorRepository doctorRepository,
                        PatientRepository patientRepository,
                        AppointmentRepository appointmentRepository,
                        MedicalRecordRepository medicalRecordRepository,
                        PrescriptionRepository prescriptionRepository,
                        MedicationRepository medicationRepository,
                        TestResultRepository testResultRepository,
                        UserRepository userRepository,
                        DepartmentRepository departmentRepository,
                        @Qualifier("emailSender") MessageSender messageSender) {
                this.doctorRepository = doctorRepository;
                this.patientRepository = patientRepository;
                this.appointmentRepository = appointmentRepository;
                this.medicalRecordRepository = medicalRecordRepository;
                this.prescriptionRepository = prescriptionRepository;
                this.medicationRepository = medicationRepository;
                this.testResultRepository = testResultRepository;
                this.userRepository = userRepository;
                this.departmentRepository = departmentRepository;
                this.messageSender = messageSender;
        }

        public DoctorResponse onboardDoctor(DoctorRegisterRequest request) {
                User user = userRepository.findById(request.getUserId())
                                .orElseThrow(() -> new RuntimeException(
                                                "User not found with ID: " + request.getUserId()));

                if (doctorRepository.findAll().stream()
                                .anyMatch(d -> d.getUser().getUserId().equals(request.getUserId()))) {
                        throw new RuntimeException("Doctor profile already exists for this User!");
                }

                user.setRole(UserRole.Doctor);
                userRepository.save(user);

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
                                .yearsOfExperience(
                                                request.getYearsOfExperience() != null ? request.getYearsOfExperience()
                                                                : 0)
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
                                .departmentName(doctor.getDepartment() != null
                                                ? doctor.getDepartment().getDepartmentName()
                                                : null)
                                .yearsOfExperience(doctor.getYearsOfExperience())
                                .availabilityStatus(doctor.getAvailabilityStatus())
                                .build();
        }

        // =========================================================================
        // Module 1 — Doctor Dashboard
        // =========================================================================

        /**
         * Returns today's appointment summary for the doctor's dashboard.
         * Shows upcoming appointments, counts by status, and doctor availability.
         */
        public DoctorDashboardResponse getDashboard(Integer doctorId) {
                Doctor doctor = findDoctorOrThrow(doctorId);

                List<Appointment> todayList = appointmentRepository.findByDoctor_DoctorIdAndAppointmentDate(doctorId,
                                LocalDate.now());

                long pending = todayList.stream().filter(a -> a.getStatus() == AppointmentStatus.Pending).count();
                long confirmed = todayList.stream().filter(a -> a.getStatus() == AppointmentStatus.Confirmed).count();
                long completed = todayList.stream().filter(a -> a.getStatus() == AppointmentStatus.Completed).count();

                List<DoctorDashboardResponse.AppointmentSummary> summaries = todayList.stream()
                                .map(a -> DoctorDashboardResponse.AppointmentSummary.builder()
                                                .appointmentId(a.getAppointmentId())
                                                .patientName(fullName(a.getPatient()))
                                                .appointmentTime(a.getAppointmentTime().toString())
                                                .status(a.getStatus().name())
                                                .reason(a.getReason())
                                                .build())
                                .collect(Collectors.toList());

                return DoctorDashboardResponse.builder()
                                .doctorId(doctorId)
                                .doctorName(doctor.getUser().getFirstName() + " " + doctor.getUser().getLastName())
                                .specialization(doctor.getSpecialization())
                                .availabilityStatus(doctor.getAvailabilityStatus() != null
                                                ? doctor.getAvailabilityStatus().getDbValue()
                                                : null)
                                .todayTotal(todayList.size())
                                .todayPending((int) pending)
                                .todayConfirmed((int) confirmed)
                                .todayCompleted((int) completed)
                                .todayAppointments(summaries)
                                .build();
        }

        // =========================================================================
        // Module 2 — Patient Records Management
        // =========================================================================

        /**
         * Returns a patient's full profile (demographics + medical background).
         * Doctors use this before a consultation to understand the patient's condition.
         */
        public PatientProfileResponse getPatientProfile(Integer patientId) {
                Patient patient = findPatientOrThrow(patientId);
                return PatientProfileResponse.builder()
                                .patientId(patient.getPatientId())
                                .firstName(patient.getUser().getFirstName())
                                .lastName(patient.getUser().getLastName())
                                .email(patient.getUser().getEmail())
                                .phone(patient.getUser().getPhone())
                                .dateOfBirth(patient.getUser().getDateOfBirth() != null
                                                ? patient.getUser().getDateOfBirth().toString()
                                                : null)
                                .gender(patient.getUser().getGender() != null
                                                ? patient.getUser().getGender().name()
                                                : null)
                                .bloodType(patient.getBloodType())
                                .allergies(patient.getAllergies())
                                .medicalHistory(patient.getMedicalHistory())
                                .emergencyContact(patient.getEmergencyContact())
                                .insuranceNumber(patient.getInsuranceNumber())
                                .build();
        }

        /**
         * Returns the full medical record history for a patient, newest first.
         * Includes previous diagnoses, treatments, and clinical notes.
         */
        public List<MedicalRecordResponse> getPatientMedicalHistory(Integer patientId) {
                return medicalRecordRepository
                                .findByPatient_PatientIdOrderByCreatedAtDesc(patientId)
                                .stream()
                                .map(this::mapToMedicalRecordResponse)
                                .collect(Collectors.toList());
        }

        // =========================================================================
        // Module 3 — Appointment Management
        // =========================================================================

        /**
         * Returns all appointments for a doctor, optionally filtered by status.
         * Provides the appointment list view with patient name, date, and time.
         */
        public List<AppointmentResponse> getDoctorAppointments(Integer doctorId, AppointmentStatus status) {
                findDoctorOrThrow(doctorId);
                List<Appointment> appointments = (status != null)
                                ? appointmentRepository.findByDoctor_DoctorIdAndStatus(doctorId, status)
                                : appointmentRepository
                                                .findByDoctor_DoctorIdOrderByAppointmentDateAscAppointmentTimeAsc(
                                                                doctorId);

                return appointments.stream()
                                .map(a -> AppointmentResponse.builder()
                                                .appointmentId(a.getAppointmentId())
                                                .patientId(a.getPatient().getPatientId())
                                                .patientName(fullName(a.getPatient()))
                                                .appointmentDate(a.getAppointmentDate())
                                                .appointmentTime(a.getAppointmentTime())
                                                .status(a.getStatus().name())
                                                .reason(a.getReason())
                                                .build())
                                .collect(Collectors.toList());
        }

        /**
         * Changes the status of an appointment (Confirm / Complete / Cancel).
         *
         * FACTORY METHOD: AppointmentStatusHandlerFactory selects the correct
         * transition handler based on the target status. The service never
         * instantiates a handler directly — adding a new status means adding
         * one new handler class and one factory entry, nothing else changes.
         *
         * BRIDGE: After the transition, the patient is notified via the injected
         * MessageSender. Swapping email for SMS is a single @Qualifier change.
         */
        @Transactional
        public void updateAppointmentStatus(Integer doctorId, Integer appointmentId, AppointmentStatus targetStatus) {
                Appointment appointment = findAppointmentOrThrow(appointmentId);

                if (!appointment.getDoctor().getDoctorId().equals(doctorId)) {
                        throw new IllegalArgumentException("Appointment does not belong to doctor " + doctorId);
                }

                // Factory Method — select and execute the right transition handler
                AppointmentStatusHandler handler = AppointmentStatusHandlerFactory.getHandler(targetStatus);
                handler.handle(appointment);
                appointmentRepository.save(appointment);

                // Bridge — notify the patient via the injected delivery channel
                new AppointmentStatusNotification(
                                messageSender,
                                fullName(appointment.getPatient()),
                                targetStatus.name(),
                                appointment.getAppointmentDate().toString())
                                .send(appointment.getPatient().getUser().getEmail());
        }

        // =========================================================================
        // Module 4 — Diagnosis and Treatment
        // =========================================================================

        /**
         * Creates a MedicalRecord for a consultation.
         *
         * BUILDER: MedicalRecordBuilder enforces the three required associations
         * (patient, doctor, appointment) and allows optional fields (diagnosis,
         * treatment, notes) to be set independently — useful when a doctor fills
         * in notes progressively during or after the consultation.
         */
        @Transactional
        public MedicalRecordResponse createMedicalRecord(Integer doctorId, MedicalRecordRequest request) {
                Doctor doctor = findDoctorOrThrow(doctorId);
                Appointment appointment = findAppointmentOrThrow(request.getAppointmentId());

                if (!appointment.getDoctor().getDoctorId().equals(doctorId)) {
                        throw new IllegalArgumentException("Appointment does not belong to doctor " + doctorId);
                }
                if (medicalRecordRepository.findByAppointment_AppointmentId(request.getAppointmentId()).isPresent()) {
                        throw new IllegalStateException(
                                        "A medical record already exists for appointment "
                                                        + request.getAppointmentId());
                }

                // Builder Pattern — construct the record step by step
                MedicalRecord record = new MedicalRecordBuilder(appointment.getPatient(), doctor, appointment)
                                .withDiagnosis(request.getDiagnosis())
                                .withTreatment(request.getTreatment())
                                .withNotes(request.getNotes())
                                .build();

                return mapToMedicalRecordResponse(medicalRecordRepository.save(record));
        }

        /**
         * Updates an existing MedicalRecord — e.g., doctor adds notes after lab results
         * arrive.
         * Only the fields present in the request are updated (partial update).
         */
        @Transactional
        public MedicalRecordResponse updateMedicalRecord(Integer doctorId, Integer recordId,
                        MedicalRecordRequest request) {
                MedicalRecord record = medicalRecordRepository.findById(recordId)
                                .orElseThrow(() -> new RuntimeException("Medical record not found: " + recordId));

                if (!record.getDoctor().getDoctorId().equals(doctorId)) {
                        throw new IllegalArgumentException("Record does not belong to doctor " + doctorId);
                }

                if (request.getDiagnosis() != null)
                        record.setDiagnosis(request.getDiagnosis());
                if (request.getTreatment() != null)
                        record.setTreatment(request.getTreatment());
                if (request.getNotes() != null)
                        record.setNotes(request.getNotes());

                return mapToMedicalRecordResponse(medicalRecordRepository.save(record));
        }

        // =========================================================================
        // Module 5 — Prescription Management
        // =========================================================================

        /**
         * Creates a Prescription with one or more medication lines.
         *
         * BUILDER: PrescriptionBuilder accumulates medication details fluently,
         * validates that at least one medication is present, and wires the
         * bidirectional Prescription ↔ PrescriptionDetail relationship before
         * returning the built entity — keeping that complexity out of the service.
         */
        @Transactional
        public PrescriptionResponse createPrescription(Integer doctorId, PrescriptionRequest request) {
                Doctor doctor = findDoctorOrThrow(doctorId);

                MedicalRecord medicalRecord = medicalRecordRepository.findById(request.getMedicalRecordId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Medical record not found: " + request.getMedicalRecordId()));

                if (!medicalRecord.getDoctor().getDoctorId().equals(doctorId)) {
                        throw new IllegalArgumentException("Medical record does not belong to doctor " + doctorId);
                }

                // Builder Pattern — build the prescription with all medication lines
                PrescriptionBuilder builder = new PrescriptionBuilder(
                                medicalRecord, doctor, medicalRecord.getPatient())
                                .withNotes(request.getNotes());

                for (PrescriptionRequest.PrescriptionDetailRequest detail : request.getDetails()) {
                        Medication medication = medicationRepository.findById(detail.getMedicationId())
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Medication not found: " + detail.getMedicationId()));
                        builder.addMedication(medication, detail.getDosage(), detail.getFrequency(),
                                        detail.getDuration());
                }

                return mapToPrescriptionResponse(prescriptionRepository.save(builder.build()));
        }

        /**
         * Returns all prescriptions for a patient, newest first.
         */
        public List<PrescriptionResponse> getPatientPrescriptions(Integer patientId) {
                return prescriptionRepository
                                .findByPatient_PatientIdOrderByIssueDateDesc(patientId)
                                .stream()
                                .map(this::mapToPrescriptionResponse)
                                .collect(Collectors.toList());
        }

        // =========================================================================
        // Module 6 — Medical Reports and Test Results
        // =========================================================================

        /**
         * Returns all test results for a patient.
         * Doctors use this to review lab findings before adding notes.
         */
        public List<TestResultResponse> getPatientTestResults(Integer patientId) {
                return testResultRepository
                                .findByPatient_PatientIdOrderByCreatedAtDesc(patientId)
                                .stream()
                                .map(this::mapToTestResultResponse)
                                .collect(Collectors.toList());
        }

        /**
         * Returns all test results linked to a specific medical record.
         */
        public List<TestResultResponse> getTestResultsByRecord(Integer recordId) {
                return testResultRepository
                                .findByMedicalRecord_RecordId(recordId)
                                .stream()
                                .map(this::mapToTestResultResponse)
                                .collect(Collectors.toList());
        }

        /**
         * Adds or updates the doctor's clinical notes on a test result.
         * Covers: "View / Update Test Results" from the use case diagram.
         */
        @Transactional
        public TestResultResponse addTestResultNote(Integer doctorId, Integer resultId,
                        TestResultNoteRequest request) {
                TestResult result = testResultRepository.findById(resultId)
                                .orElseThrow(() -> new RuntimeException("Test result not found: " + resultId));

                // Verify the result belongs to a record owned by this doctor
                if (!result.getMedicalRecord().getDoctor().getDoctorId().equals(doctorId)) {
                        throw new IllegalArgumentException("Test result does not belong to doctor " + doctorId);
                }

                result.setDoctorNotes(request.getDoctorNotes());
                return mapToTestResultResponse(testResultRepository.save(result));
        }

        // =========================================================================
        // Availability
        // =========================================================================

        /**
         * Updates the doctor's availability status (Available / Busy / On Leave).
         */
        @Transactional
        public void updateAvailability(Integer doctorId, AvailabilityStatus status) {
                Doctor doctor = findDoctorOrThrow(doctorId);
                doctor.setAvailabilityStatus(status);
                doctorRepository.save(doctor);
        }

        // =========================================================================
        // Private helpers
        // =========================================================================

        private Doctor findDoctorOrThrow(Integer doctorId) {
                return doctorRepository.findById(doctorId)
                                .orElseThrow(() -> new RuntimeException("Doctor not found: " + doctorId));
        }

        private Patient findPatientOrThrow(Integer patientId) {
                return patientRepository.findById(patientId)
                                .orElseThrow(() -> new RuntimeException("Patient not found: " + patientId));
        }

        private Appointment findAppointmentOrThrow(Integer appointmentId) {
                return appointmentRepository.findById(appointmentId)
                                .orElseThrow(() -> new RuntimeException("Appointment not found: " + appointmentId));
        }

        private String fullName(Patient patient) {
                return patient.getUser().getFirstName() + " " + patient.getUser().getLastName();
        }

        private MedicalRecordResponse mapToMedicalRecordResponse(MedicalRecord r) {
                return MedicalRecordResponse.builder()
                                .recordId(r.getRecordId())
                                .patientId(r.getPatient().getPatientId())
                                .patientName(fullName(r.getPatient()))
                                .doctorId(r.getDoctor().getDoctorId())
                                .doctorName(r.getDoctor().getUser().getFirstName() + " "
                                                + r.getDoctor().getUser().getLastName())
                                .appointmentId(r.getAppointment().getAppointmentId())
                                .diagnosis(r.getDiagnosis())
                                .treatment(r.getTreatment())
                                .notes(r.getNotes())
                                .createdAt(r.getCreatedAt())
                                .build();
        }

        private PrescriptionResponse mapToPrescriptionResponse(Prescription p) {
                List<PrescriptionResponse.DetailResponse> details = p.getDetails().stream()
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
                                .prescriptionId(p.getPrescriptionId())
                                .medicalRecordId(p.getMedicalRecord().getRecordId())
                                .patientId(p.getPatient().getPatientId())
                                .patientName(fullName(p.getPatient()))
                                .doctorId(p.getDoctor().getDoctorId())
                                .doctorName(p.getDoctor().getUser().getFirstName() + " "
                                                + p.getDoctor().getUser().getLastName())
                                .issueDate(p.getIssueDate())
                                .notes(p.getNotes())
                                .details(details)
                                .build();
        }

        private TestResultResponse mapToTestResultResponse(TestResult t) {
                return TestResultResponse.builder()
                                .resultId(t.getResultId())
                                .medicalRecordId(t.getMedicalRecord().getRecordId())
                                .patientId(t.getPatient().getPatientId())
                                .patientName(fullName(t.getPatient()))
                                .testName(t.getTestName())
                                .resultData(t.getResultData())
                                .doctorNotes(t.getDoctorNotes())
                                .createdAt(t.getCreatedAt())
                                .updatedAt(t.getUpdatedAt())
                                .build();
        }
}
