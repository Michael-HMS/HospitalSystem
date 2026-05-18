package com.example.HospitalSystem.repository;

import com.example.HospitalSystem.entity.Appointment;
import com.example.HospitalSystem.entity.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    List<Appointment> findByDoctor_DoctorIdOrderByAppointmentDateAscAppointmentTimeAsc(Integer doctorId);

    List<Appointment> findByDoctor_DoctorIdAndAppointmentDate(Integer doctorId, LocalDate date);

    List<Appointment> findByDoctor_DoctorIdAndStatus(Integer doctorId, AppointmentStatus status);

    List<Appointment> findByPatient_PatientIdOrderByAppointmentDateDescAppointmentTimeDesc(Integer patientId);

    List<Appointment> findByDoctor_DoctorIdAndAppointmentDateAndStatusNot(Integer doctorId, LocalDate date, AppointmentStatus status);
}
