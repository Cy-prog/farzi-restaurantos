package com.restaurantos.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@SQLDelete(sql = "UPDATE reviews SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
public class Review extends BaseEntity {

    @Column(name = "customer_name", nullable = false, length = 150)
    private String customerName;

    @Column(nullable = false)
    private int rating;

    @Column(length = 1500)
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ReviewSource source = ReviewSource.WEBSITE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReviewStatus status = ReviewStatus.PENDING;

    @Column(name = "is_featured", nullable = false)
    private boolean featured = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
