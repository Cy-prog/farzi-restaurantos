package com.restaurantos.backend.controller;

import com.restaurantos.backend.dto.common.ApiResponse;
import com.restaurantos.backend.entity.MenuCategory;
import com.restaurantos.backend.entity.MenuItem;
import com.restaurantos.backend.repository.MenuCategoryRepository;
import com.restaurantos.backend.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class MenuPublicController {

    private final MenuItemRepository menuItemRepository;
    private final MenuCategoryRepository menuCategoryRepository;

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<MenuCategory>>> getCategories() {
        List<MenuCategory> categories = menuCategoryRepository.findByIsVisibleTrueOrderByDisplayOrderAsc();
        return ResponseEntity.ok(ApiResponse.ok(categories));
    }

    @GetMapping("/menu")
    public ResponseEntity<ApiResponse<List<MenuItem>>> getMenuItems(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean isVeg,
            @RequestParam(required = false) Boolean isChefSpecial
    ) {
        List<MenuItem> items = menuItemRepository.findByIsAvailableTrueOrderByDisplayOrderAsc();

        if (categoryId != null) {
            items = items.stream().filter(i -> i.getCategory() != null && i.getCategory().getId().equals(categoryId)).toList();
        }
        if (isVeg != null) {
            items = items.stream().filter(i -> i.getIsVeg().equals(isVeg)).toList();
        }
        if (isChefSpecial != null) {
            items = items.stream().filter(i -> i.getIsChefSpecial().equals(isChefSpecial)).toList();
        }

        return ResponseEntity.ok(ApiResponse.ok(items));
    }

    @GetMapping("/menu/{id}")
    public ResponseEntity<ApiResponse<MenuItem>> getMenuItem(@PathVariable Long id) {
        return menuItemRepository.findById(id)
                .map(item -> ResponseEntity.ok(ApiResponse.ok(item)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
