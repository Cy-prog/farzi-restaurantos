package com.restaurantos.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "restaurant_tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "table_number", nullable = false, unique = true, length = 20)
    private String tableNumber;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false, length = 100)
    private String section;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "qr_code_url", length = 500)
    private String qrCodeUrl;

    @Column(name = "active_order_id")
    private Long activeOrderId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = "AVAILABLE";
        if (this.capacity == null) this.capacity = 4;
        if (this.section == null) this.section = "Main Dining";
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
