-- Default admin user — CHANGE THIS PASSWORD immediately after first login.
-- Login: admin@restaurantos.local / Admin@12345
INSERT INTO users (name, email, password_hash, role, is_active, created_at, updated_at)
VALUES ('System Admin', 'admin@restaurantos.local', '$2b$10$dhpP7QMktw3s1f0msw3L9.GKWKpW2aLaUGf6KYE3FMN8fM/1o.HiK', 'ADMIN', TRUE, NOW(), NOW());
