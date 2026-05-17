package com.example.HospitalSystem.dto;

import com.example.HospitalSystem.entity.enums.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {
    private String firstName;
    private String lastName;
    private String email;
    private UserRole role;
    private String phone;
}
