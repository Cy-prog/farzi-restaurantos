package com.restaurantos.backend.repository;

import com.restaurantos.backend.entity.WebsiteSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WebsiteSettingsRepository extends JpaRepository<WebsiteSettings, Long> {
}
