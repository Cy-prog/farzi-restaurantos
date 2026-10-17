package com.restaurantos.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "website_settings")
@Getter
@Setter
public class WebsiteSettings extends BaseEntity {

    @Column(name = "restaurant_name", nullable = false, length = 150)
    private String restaurantName;

    @Column(length = 255)
    private String tagline;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "favicon_url", length = 500)
    private String faviconUrl;

    @Column(name = "primary_color", length = 20)
    private String primaryColor;

    @Column(name = "accent_color", length = 20)
    private String accentColor;

    @Column(length = 20)
    private String phone;

    @Column(name = "whatsapp_number", length = 20)
    private String whatsappNumber;

    @Column(length = 180)
    private String email;

    @Column(length = 500)
    private String address;

    @Column(name = "google_maps_embed_url", length = 1000)
    private String googleMapsEmbedUrl;

    @Column(name = "working_hours", columnDefinition = "TEXT")
    private String workingHours;

    @Column(name = "social_links", columnDefinition = "TEXT")
    private String socialLinks;
}
