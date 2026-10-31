package com.restaurantos.backend.controller;

import com.restaurantos.backend.dto.common.ApiResponse;
import com.restaurantos.backend.entity.MenuItem;
import com.restaurantos.backend.repository.MenuItemRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/menu")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class AdminMenuController {

    private final MenuItemRepository menuItemRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItem>>> getAdminMenu() {
        return ResponseEntity.ok(ApiResponse.ok(menuItemRepository.findAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MenuItem>> createMenuItem(@Valid @RequestBody MenuItem item) {
        MenuItem saved = menuItemRepository.save(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created("Dish created", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItem>> updateMenuItem(@PathVariable Long id,
            @Valid @RequestBody MenuItem item) {
        return menuItemRepository.findById(id).map(existing -> {
            item.setId(id);
            MenuItem updated = menuItemRepository.save(item);
            return ResponseEntity.ok(ApiResponse.ok("Dish updated", updated));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
        if (menuItemRepository.existsById(id)) {
            menuItemRepository.deleteById(id);
            return ResponseEntity.ok(ApiResponse.ok("Dish deleted", null));
        }
        return ResponseEntity.notFound().build();
    }
}
