package com.restaurantos.backend.controller;

import com.restaurantos.backend.dto.common.ApiResponse;
import com.restaurantos.backend.entity.Reservation;
import com.restaurantos.backend.entity.ReservationStatus;
import com.restaurantos.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reservations")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class AdminReservationController {

    private final ReservationRepository reservationRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Reservation>>> getAllReservations() {
        return ResponseEntity.ok(ApiResponse.ok(reservationRepository.findAllByOrderByReservationDateDescReservationTimeDesc()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Reservation>> updateStatus(
            @PathVariable Long id,
            @RequestParam ReservationStatus status
    ) {
        return reservationRepository.findById(id).map(r -> {
            r.setStatus(status);
            Reservation updated = reservationRepository.save(r);
            return ResponseEntity.ok(ApiResponse.ok("Reservation status updated", updated));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
