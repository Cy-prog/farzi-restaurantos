package com.restaurantos.backend.repository;

import com.restaurantos.backend.entity.GalleryCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryCategoryRepository extends JpaRepository<GalleryCategory, Long> {
    List<GalleryCategory> findByVisibleTrueOrderByDisplayOrderAsc();
}
