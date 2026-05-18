package com.example.HospitalSystem.mapper;

import com.example.HospitalSystem.dto.DoctorDto;
import com.example.HospitalSystem.entity.Doctor;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
        uses = {UserMapper.class} // Reuses UserMapper to map the nested User entity -> UserDto
)
public interface DoctorMapper {

    @org.mapstruct.Mapping(source = "department.departmentName", target = "departmentName")
    DoctorDto entityToDto(Doctor doctor);

    Doctor dtoToEntity(DoctorDto doctorDto);
}
