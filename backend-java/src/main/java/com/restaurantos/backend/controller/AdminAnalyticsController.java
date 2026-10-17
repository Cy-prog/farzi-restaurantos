package com.restaurantos.backend.controller;

import com.restaurantos.backend.dto.common.ApiResponse;
import com.restaurantos.backend.repository.MenuItemRepository;
import com.restaurantos.backend.repository.OrderRepository;
import com.restaurantos.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class AdminAnalyticsController {

    private final OrderRepository orderRepository;
    private final ReservationRepository reservationRepository;
    private final MenuItemRepository menuItemRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalOrders", orderRepository.count());
        data.put("totalReservations", reservationRepository.count());
        data.put("totalMenuItems", menuItemRepository.count());
        data.put("recentOrders", orderRepository.findAllByOrderByCreatedAtDesc().stream().limit(10).toList());
        return ResponseEntity.ok(ApiResponse.ok(data));
    }
}
