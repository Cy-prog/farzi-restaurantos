package com.restaurantos.backend.controller;

import com.restaurantos.backend.dto.common.ApiResponse;
import com.restaurantos.backend.entity.Order;
import com.restaurantos.backend.entity.OrderStatus;
import com.restaurantos.backend.repository.OrderRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/public/orders")
@RequiredArgsConstructor
public class OrderPublicController {

    private final OrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> submitOrder(@Valid @RequestBody Order order) {
        order.setOrderNumber("FZ-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        order.setStatus(OrderStatus.PENDING);
        if (order.getItems() != null) {
            order.getItems().forEach(it -> it.setOrder(order));
        }
        Order saved = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Order transmitted directly to kitchen station.", saved));
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<ApiResponse<Order>> getOrderByNumber(@PathVariable String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .map(o -> ResponseEntity.ok(ApiResponse.ok(o)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
