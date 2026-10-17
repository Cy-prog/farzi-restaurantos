package com.restaurantos.backend.repository;

import com.restaurantos.backend.entity.Review;
import com.restaurantos.backend.entity.ReviewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByStatus(ReviewStatus status, Pageable pageable);
    List<Review> findByFeaturedTrueAndStatus(ReviewStatus status);
}
