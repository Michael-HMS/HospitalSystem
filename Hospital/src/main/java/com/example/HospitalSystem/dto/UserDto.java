package com.example.HospitalSystem.dto;

import com.example.HospitalSystem.entity.enums.Gender;
import com.example.HospitalSystem.entity.enums.UserRole;
import lombok.Data;

@Data
public class UserDto {
    private Integer userId;
    private UserRole role;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Gender gender;
}
