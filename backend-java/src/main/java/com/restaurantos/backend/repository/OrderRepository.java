package com.restaurantos.backend.repository;

import com.restaurantos.backend.entity.Order;
import com.restaurantos.backend.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByTableNumber(String tableNumber);
    List<Order> findAllByOrderByCreatedAtDesc();
}
