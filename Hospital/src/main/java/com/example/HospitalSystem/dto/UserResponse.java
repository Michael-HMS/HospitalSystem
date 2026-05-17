package com.example.HospitalSystem.dto;

import com.example.HospitalSystem.entity.enums.UserRole;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponse {
    private Integer userId;
    private String firstName;
    private String lastName;
    private String email;
    private UserRole role;
    private String phone;
}
