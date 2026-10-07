-- DeskBrew - Seed More Global Cafes
-- Includes Athens, Bali, and Lisbon

INSERT INTO cafes (
    name, slug, address, city, country,
    latitude, longitude, location,
    wifi_speed, noise_level, power_outlets, quietness_score, overall_nomad_score,
    has_power_outlets, is_open_late, price_level,
    image_url, thumbnail_url,
    desks_available, total_desks,
    ai_insight, specialty, distance_label
) VALUES

-- ATHENS, GREECE (User's presumed location)
(
    'Dope Roasting Co.',
    'dope-roasting-athens',
    'Vissis 25, Athens',
    'Athens', 'Greece',
    37.9786, 23.7275,
    ST_SetSRID(ST_MakePoint(23.7275, 37.9786), 4326),
    8.5, 7.0, 9.0, 7.5, 8.8,
    TRUE, FALSE, '$$',
    'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80',
    'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=400&q=60',
    5, 20,
    'Excellent multi-level cafe in the heart of Athens with fast WiFi and great specialty coffee. Top floor is usually full of remote workers.',
    'Specialty Coffee • Cinnamon Buns',
    ''
),
(
    'Anäna Coffee|Food',
    'anana-coffee-athens',
    'Praxitelous 33, Athens',
    'Athens', 'Greece',
    37.9789, 23.7314,
    ST_SetSRID(ST_MakePoint(23.7314, 37.9789), 4326),
    8.2, 6.8, 8.0, 7.2, 8.5,
    TRUE, FALSE, '$$',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&q=60',
    3, 12,
    'A beautiful minimalist cafe with an indoor courtyard. Great for morning work sessions before it gets busy.',
    'Vegan pastries • Flat White',
    ''
),

-- THESSALONIKI, GREECE
(
    'Ypsilon',
    'ypsilon-thessaloniki',
    'Edessis 5, Thessaloniki',
    'Thessaloniki', 'Greece',
    40.6356, 22.9372,
    ST_SetSRID(ST_MakePoint(22.9372, 40.6356), 4326),
    8.8, 7.5, 8.5, 8.0, 9.0,
    TRUE, TRUE, '$$',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=60',
    8, 30,
    'Massive historic building converted into a multi-purpose space. Tons of seating, fast internet, and transitions into a great bar at night.',
    'Creative space • Cocktails',
    ''
),

-- LISBON, PORTUGAL (Nomad Hub)
(
    'Copenhagen Coffee Lab',
    'copenhagen-coffee-lab-lisbon',
    'R. Nova da Piedade 10, Lisbon',
    'Lisbon', 'Portugal',
    38.7126, -9.1500,
    ST_SetSRID(ST_MakePoint(-9.1500, 38.7126), 4326),
    9.0, 7.0, 8.5, 7.8, 8.9,
    TRUE, FALSE, '$$',
    'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80',
    'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&q=60',
    4, 15,
    'A classic spot for Lisbon nomads. Minimalist, excellent internet, and arguably the best cinnamon rolls in the city.',
    'Nordic roast • Cinnamon rolls',
    ''
),

-- CANGGU, BALI (Nomad Hub)
(
    'BWork Bali',
    'bwork-bali-canggu',
    'Jl. Nelayan No.9C, Canggu',
    'Canggu', 'Indonesia',
    -8.6542, 115.1308,
    ST_SetSRID(ST_MakePoint(115.1308, -8.6542), 4326),
    9.8, 8.5, 10.0, 8.8, 9.6,
    TRUE, TRUE, '$$$',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&q=60',
    12, 50,
    'Premium cafe and coworking blend. Flawless gigabit internet, ergonomic chairs, and a silent focus room upstairs.',
    'Coworking • Specialty Coffee',
    ''
);
