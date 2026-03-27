-- Boutique Chic Master Seed Data Script
-- This script populates categories, products, orders, and reviews to create a full demo experience.

-- 1. CLEANUP (Optional - Clear existing data to avoid conflicts)
-- DELETE FROM public.reviews;
-- DELETE FROM public.order_items;
-- DELETE FROM public.orders;
-- DELETE FROM public.products;
-- DELETE FROM public.categories;

-- 2. CATEGORIES
INSERT INTO public.categories (name, description, icon) VALUES
('Luxury Watches', 'High-end timepieces for the modern business leader.', 'Watch'),
('Artisan Necklaces', 'Hand-crafted necklaces using premium silver and gold.', 'Gem'),
('Elegant Bracelets', 'Minimalist and statement bracelets for every occasion.', 'Circle'),
('Bespoke Rings', 'Luxury rings designed for eternal elegance.', 'Disc'),
('Premium Gifts', 'Curated accessory sets for special corporate gifting.', 'Gift')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, icon = EXCLUDED.icon;

-- 3. PRODUCTS
-- Mapping some variables for references (this uses subqueries for category IDs)
INSERT INTO public.products (name, description, price, original_price, image_url, category_id, stock, status, featured) VALUES
('Golden Chronograph X1', 'A 24k gold-plated chronograph with sapphire glass.', 1250.00, 1500.00, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1487&auto=format&fit=crop', (SELECT id FROM categories WHERE name = 'Luxury Watches' LIMIT 1), 15, 'active', true),
('Diamond Silver Band', 'Sterling silver band featuring an ethically sourced diamond.', 450.00, 520.00, 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?q=80&w=1528&auto=format&fit=crop', (SELECT id FROM categories WHERE name = 'Bespoke Rings' LIMIT 1), 8, 'active', true),
('Silk Road Bracelet', 'Oriental-inspired design with premium silk and gold elements.', 280.00, NULL, 'https://images.unsplash.com/photo-1515562141207-7a88fb0ce338?q=80&w=1470&auto=format&fit=crop', (SELECT id FROM categories WHERE name = 'Elegant Bracelets' LIMIT 1), 50, 'active', false),
('Pearl Infinity Necklace', 'A delicate necklace with rare black pearls.', 920.00, 1100.00, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1374&auto=format&fit=crop', (SELECT id FROM categories WHERE name = 'Artisan Necklaces' LIMIT 1), 3, 'active', true),
('Executive Gift Set', 'Leather wallet matched with a premium pen and watch.', 195.00, 250.00, 'https://images.unsplash.com/photo-1549461756-8a9c279c7d3c?q=80&w=1470&auto=format&fit=crop', (SELECT id FROM categories WHERE name = 'Premium Gifts' LIMIT 1), 25, 'active', false),
('Emerald Deco Ring', 'Art-deco inspired ring with a deep green emerald.', 750.00, 850.00, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1470&auto=format&fit=crop', (SELECT id FROM categories WHERE name = 'Bespoke Rings' LIMIT 1), 12, 'active', true),
('Titanium Sport Watch', 'Lightweight titanium watch for the active professional.', 890.00, NULL, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1399&auto=format&fit=crop', (SELECT id FROM categories WHERE name = 'Luxury Watches' LIMIT 1), 0, 'active', false);

-- 4. ORDERS (Mock Orders for Analytics)
-- Assumes a user exists or can create one. These use a dummy UUID if profile/user not found.
-- INSERT INTO public.orders (total_amount, status, customer_id) VALUES
-- (2500.00, 'delivered', '00000000-0000-0000-0000-000000000000'),
-- (450.00, 'shipped', '00000000-0000-0000-0000-000000000000'),
-- (1250.00, 'delivered', '00000000-0000-0000-0000-000000000000'),
-- (280.00, 'pending', '00000000-0000-0000-0000-000000000000'),
-- (750.00, 'delivered', '00000000-0000-0000-0000-000000000000');

-- 5. REVIEWS (Mock Reviews)
-- INSERT INTO public.reviews (product_id, rating, comment, status) VALUES
-- ((SELECT id FROM products LIMIT 1), 5, 'Exceptional quality product!', 'approved'),
-- ((SELECT id FROM products OFFSET 1 LIMIT 1), 4, 'Very nice but took a while to arrive.', 'approved'),
-- ((SELECT id FROM products OFFSET 2 LIMIT 1), 5, 'Perfect for my luxury retail shop.', 'approved');
