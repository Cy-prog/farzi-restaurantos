package com.restaurantos.backend.dto.auth;

import lombok.Getter;

@Getter
public class LoginResponse {
    private final String token;
    private final String tokenType = "Bearer";
    private final CurrentUserResponse user;

    public LoginResponse(String token, CurrentUserResponse user) {
        this.token = token;
        this.user = user;
    }
}
