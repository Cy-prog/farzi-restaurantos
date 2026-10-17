package com.restaurantos.backend.service;

import com.restaurantos.backend.dto.auth.CurrentUserResponse;
import com.restaurantos.backend.dto.auth.LoginRequest;
import com.restaurantos.backend.dto.auth.LoginResponse;
import com.restaurantos.backend.entity.User;
import com.restaurantos.backend.exception.UnauthorizedException;
import com.restaurantos.backend.repository.UserRepository;
import com.restaurantos.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmailAndActiveTrue(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .authorities("ROLE_" + user.getRole().name())
                .build();

        String token = jwtService.generateToken(userDetails);

        CurrentUserResponse userResponse = new CurrentUserResponse(
                user.getId(), user.getName(), user.getEmail(), user.getRole()
        );

        return new LoginResponse(token, userResponse);
    }

    public CurrentUserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmailAndActiveTrue(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        return new CurrentUserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
