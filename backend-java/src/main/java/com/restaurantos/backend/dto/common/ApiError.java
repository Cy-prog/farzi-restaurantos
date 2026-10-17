package com.restaurantos.backend.dto.common;

import lombok.Getter;

import java.time.Instant;
import java.util.List;

@Getter
public class ApiError {
    private final boolean success = false;
    private final String message;
    private final Integer status;
    private final Instant timestamp = Instant.now();
    private final List<String> details;

    public ApiError(String message, Integer status, List<String> details) {
        this.message = message;
        this.status = status;
        this.details = details;
    }
}
