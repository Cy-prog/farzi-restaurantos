package com.restaurantos.backend.repository;

import com.restaurantos.backend.entity.MenuItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    Optional<MenuItem> findBySlug(String slug);
    Page<MenuItem> findByCategoryId(Long categoryId, Pageable pageable);
    List<MenuItem> findByChefSpecialTrueAndAvailableTrue();
    List<MenuItem> findByRecommendedTrueAndAvailableTrue();
    List<MenuItem> findByPopularTrueAndAvailableTrue();
}
