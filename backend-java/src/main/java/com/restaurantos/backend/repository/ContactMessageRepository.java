package com.restaurantos.backend.repository;

import com.restaurantos.backend.entity.ContactMessage;
import com.restaurantos.backend.entity.ContactMessageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    Page<ContactMessage> findByStatus(ContactMessageStatus status, Pageable pageable);
}
