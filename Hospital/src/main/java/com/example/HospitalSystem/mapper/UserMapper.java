package com.example.HospitalSystem.mapper;

import com.example.HospitalSystem.dto.UserDto;
import com.example.HospitalSystem.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
)
public interface UserMapper {

    UserDto entityToDto(User user);

    User dtoToEntity(UserDto userDto);
}
