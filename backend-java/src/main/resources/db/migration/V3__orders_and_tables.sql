-- RestaurantOS Professional — Phase 3: Orders, Tables, and QR Scans

CREATE TABLE restaurant_tables (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_number VARCHAR(20) NOT NULL UNIQUE,
    capacity INT NOT NULL DEFAULT 4,
    section VARCHAR(100) NOT NULL DEFAULT 'Main Dining',
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    qr_code_url VARCHAR(500) NULL,
    active_order_id BIGINT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_restaurant_tables_number (table_number),
    INDEX idx_restaurant_tables_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    table_number VARCHAR(20) NOT NULL,
    customer_name VARCHAR(150) NULL,
    customer_phone VARCHAR(30) NULL,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    notes VARCHAR(1000) NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted_at DATETIME NULL,
    INDEX idx_orders_number (order_number),
    INDEX idx_orders_table (table_number),
    INDEX idx_orders_status (status),
    INDEX idx_orders_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    special_instructions VARCHAR(500) NULL,
    is_veg BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_items_order (order_id),
    INDEX idx_order_items_menu_item (menu_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE qr_scans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_number VARCHAR(20) NOT NULL,
    user_agent VARCHAR(500) NULL,
    scanned_at DATETIME NOT NULL,
    INDEX idx_qr_scans_table (table_number),
    INDEX idx_qr_scans_time (scanned_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
