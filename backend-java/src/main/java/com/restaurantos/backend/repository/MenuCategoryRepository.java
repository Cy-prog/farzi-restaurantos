package com.restaurantos.backend.repository;

import com.restaurantos.backend.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {
    Optional<MenuCategory> findBySlug(String slug);
    List<MenuCategory> findByVisibleTrueOrderByDisplayOrderAsc();
}
