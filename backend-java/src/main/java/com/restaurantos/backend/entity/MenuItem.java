package com.restaurantos.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "menu_items")
@SQLDelete(sql = "UPDATE menu_items SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
public class MenuItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private MenuCategory category;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 180)
    private String slug;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(length = 1000)
    private String ingredients;

    @Column(length = 500)
    private String allergens;

    @Enumerated(EnumType.STRING)
    @Column(name = "spice_level", length = 20)
    private SpiceLevel spiceLevel;

    @Column(name = "is_veg", nullable = false)
    private boolean veg = true;

    @Column(name = "is_available", nullable = false)
    private boolean available = true;

    @Column(name = "is_chef_special", nullable = false)
    private boolean chefSpecial = false;

    @Column(name = "is_recommended", nullable = false)
    private boolean recommended = false;

    @Column(name = "is_popular", nullable = false)
    private boolean popular = false;

    @Column(name = "display_order", nullable = false)
    private int displayOrder = 0;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
