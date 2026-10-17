package com.restaurantos.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "gallery_categories")
@SQLDelete(sql = "UPDATE gallery_categories SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
public class GalleryCategory extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(name = "display_order", nullable = false)
    private int displayOrder = 0;

    @Column(name = "is_visible", nullable = false)
    private boolean visible = true;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
