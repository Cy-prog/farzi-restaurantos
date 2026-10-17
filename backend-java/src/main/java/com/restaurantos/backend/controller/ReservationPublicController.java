package com.restaurantos.backend.controller;

import com.restaurantos.backend.dto.common.ApiResponse;
import com.restaurantos.backend.entity.Reservation;
import com.restaurantos.backend.entity.ReservationStatus;
import com.restaurantos.backend.repository.ReservationRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/reservations")
@RequiredArgsConstructor
public class ReservationPublicController {

    private final ReservationRepository reservationRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Reservation>> createReservation(@Valid @RequestBody Reservation reservation) {
        reservation.setStatus(ReservationStatus.PENDING);
        Reservation saved = reservationRepository.save(reservation);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Reservation request logged. Concierge will confirm.", saved));
    }
}
