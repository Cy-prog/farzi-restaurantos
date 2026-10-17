package com.restaurantos.backend.dto.auth;

import com.restaurantos.backend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CurrentUserResponse {
    private Long id;
    private String name;
    private String email;
    private UserRole role;
}
