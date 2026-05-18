package com.example.HospitalSystem.mapper;

import com.example.HospitalSystem.dto.PatientDto;
import com.example.HospitalSystem.entity.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
        uses = {UserMapper.class} // Tells MapStruct to use UserMapper for the nested User object
)
public interface PatientMapper {

    PatientDto entityToDto(Patient patient);

    Patient dtoToEntity(PatientDto patientDto);
}
