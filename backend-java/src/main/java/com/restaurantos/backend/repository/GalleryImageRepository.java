package com.restaurantos.backend.repository;

import com.restaurantos.backend.entity.GalleryImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> {
    List<GalleryImage> findByCategoryIdOrderByDisplayOrderAsc(Long categoryId);
}
