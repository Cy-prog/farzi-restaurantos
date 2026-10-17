package com.restaurantos.backend.repository;

import com.restaurantos.backend.entity.Reservation;
import com.restaurantos.backend.entity.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Page<Reservation> findByStatus(ReservationStatus status, Pageable pageable);
    List<Reservation> findByReservationDate(LocalDate date);
    long countByReservationDate(LocalDate date);
}
