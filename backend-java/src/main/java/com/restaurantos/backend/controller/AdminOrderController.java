package com.restaurantos.backend.controller;

import com.restaurantos.backend.dto.common.ApiResponse;
import com.restaurantos.backend.entity.Order;
import com.restaurantos.backend.entity.OrderStatus;
import com.restaurantos.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class AdminOrderController {

    private final OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.ok(orderRepository.findAllByOrderByCreatedAtDesc()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(status);
            Order updated = orderRepository.save(order);
            return ResponseEntity.ok(ApiResponse.ok("Order status updated", updated));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
