-- Seed Farzi categories, signature dishes, tables, and demo settings

INSERT INTO menu_categories (id, name, slug, description, display_order, is_visible, created_at, updated_at) VALUES
(1, 'Starters & Molecular Tapas', 'starters-tapas', 'Avant-garde appetizers fusing street delicacies with modern culinary science', 1, TRUE, NOW(), NOW()),
(2, 'Progressive Small Plates', 'small-plates', 'Intricate sharing dishes with playful textures and layered aromatics', 2, TRUE, NOW(), NOW()),
(3, 'Main Course Curations', 'main-course', 'Slow-simmered gravies and charcoal-roasted specialties reimagined', 3, TRUE, NOW(), NOW()),
(4, 'Artisanal Breads & Fragrant Rice', 'breads-rice', 'Tandoor leavened breads and dum-cooked aged basmati', 4, TRUE, NOW(), NOW()),
(5, 'Sweet Illusions & Desserts', 'desserts', 'Theatrical post-meal spectacles crafted with liquid nitrogen', 5, TRUE, NOW(), NOW()),
(6, 'Alchemical Mixology & Botanicals', 'beverages', 'Smoked distillations, ayurvedic infusions, and signature mocktails', 6, TRUE, NOW(), NOW());

INSERT INTO menu_items (id, category_id, name, slug, description, price, image_url, ingredients, allergens, spice_level, is_veg, is_available, is_chef_special, is_recommended, is_popular, display_order, created_at, updated_at) VALUES
(1, 1, 'Dal Chawal Arancini', 'dal-chawal-arancini', 'Crispy lentil & arborio rice spheres topped with tomato punch chutney, dehydrated poppadum tuile, and mint emulsion.', 495.00, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop', 'Yellow Moong Dal, Arborio Rice, Papadum, Mint, Mustard Seed Emulsion', 'Dairy, Gluten', 'MILD', TRUE, TRUE, TRUE, TRUE, TRUE, 1, NOW(), NOW()),
(2, 1, 'Deconstructed Pani Puri Sphere', 'deconstructed-pani-puri', 'Molecular alginate spheres enclosing spiced mint-coriander water, served over sweet tamarind dust and micro sev crisps.', 445.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop', 'Mint Extract, Coriander, Black Salt, Tamarind Pulp, Semolina Flakes', 'Gluten', 'MEDIUM', TRUE, TRUE, TRUE, TRUE, TRUE, 2, NOW(), NOW()),
(3, 2, 'Smoked Butter Chicken Bao', 'smoked-butter-chicken-bao', 'Steamed lotus-leaf bao buns stuffed with pulled tandoori chicken, makhani glaze, kasuri fenugreek foam, and pickled shallots.', 595.00, 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=1200&auto=format&fit=crop', 'Chicken Tikka, Steamed Bao Dough, Tomato Cream, Kasuri Methi, Pickled Red Onions', 'Dairy, Gluten', 'MILD', FALSE, TRUE, TRUE, TRUE, TRUE, 1, NOW(), NOW()),
(4, 2, 'Galouti Kebab Pâté on Ulta Tawa Crisp', 'galouti-kebab-pate', 'Melt-in-mouth smoked lamb pâté delicately spiced with 18 awadhi herbs, served on saffron inverted-griddle crisps with cardamom gel.', 675.00, 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=1200&auto=format&fit=crop', 'Minced Lamb, Raw Papaya, Rose Petal Powder, Brown Onions, Ghee', 'Gluten, Dairy', 'MEDIUM', FALSE, TRUE, TRUE, TRUE, TRUE, 2, NOW(), NOW()),
(5, 3, 'Wild Mushroom & Black Truffle Khichdi', 'wild-mushroom-truffle-khichdi', 'Slow-tempered arborio & moong comfort risotto infused with porcini broth, shaved winter truffles, and aged parmesan papad crisp.', 695.00, 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1200&auto=format&fit=crop', 'Porcini Mushrooms, Black Truffle Oil, Moong Dal, Arborio Rice, Parmesan Crust', 'Dairy', 'MILD', TRUE, TRUE, TRUE, TRUE, TRUE, 1, NOW(), NOW()),
(6, 3, 'Braised Lamb Shank Rogan Josh', 'braised-lamb-shank-rogan-josh', '8-hour slow cooked tender lamb shank in Kashmiri rattan jyot & dried ginger reduction, topped with saffron bone marrow glaze.', 895.00, 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop', 'Prime Lamb Shank, Kashmiri Chili, Rattan Jyot, Fennel Powder, Dry Ginger', 'Dairy', 'MEDIUM', FALSE, TRUE, TRUE, TRUE, TRUE, 2, NOW(), NOW());

INSERT INTO restaurant_tables (table_number, capacity, section, status, qr_code_url, created_at, updated_at) VALUES
('T01', 2, 'Main Dining', 'AVAILABLE', '/menu?table=T01', NOW(), NOW()),
('T02', 2, 'Main Dining', 'AVAILABLE', '/menu?table=T02', NOW(), NOW()),
('T03', 4, 'Main Dining', 'AVAILABLE', '/menu?table=T03', NOW(), NOW()),
('T04', 4, 'Main Dining', 'OCCUPIED', '/menu?table=T04', NOW(), NOW()),
('T05', 6, 'Terrace Garden', 'AVAILABLE', '/menu?table=T05', NOW(), NOW()),
('T07', 8, 'Chef Table', 'RESERVED', '/menu?table=T07', NOW(), NOW());
