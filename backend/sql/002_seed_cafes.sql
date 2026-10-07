-- ============================================================================
-- DeskBrew — Seed Data for Development & Demo
-- ============================================================================
-- Populates the cafes table with curated remote-work-friendly cafes in Berlin.
-- Uses ST_SetSRID(ST_MakePoint(lng, lat), 4326) for PostGIS geometry.
-- ============================================================================

INSERT INTO cafes (
    name, slug, address, city, country,
    latitude, longitude, location,
    wifi_speed, noise_level, power_outlets, quietness_score, overall_nomad_score,
    has_power_outlets, is_open_late, price_level,
    image_url, thumbnail_url,
    desks_available, total_desks,
    ai_insight, specialty, distance_label
) VALUES

-- 1. The Barn Roastery
(
    'The Barn Roastery',
    'the-barn-roastery',
    'Schönhauser Allee 8, Prenzlauer Berg',
    'Berlin', 'Germany',
    52.5328, 13.4130,
    ST_SetSRID(ST_MakePoint(13.4130, 52.5328), 4326),
    8.6, 7.2, 9.2, 8.7, 9.3,
    TRUE, FALSE, '$$',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=60',
    4, 12,
    'Ideal morning deep-work sanctuary with lightning-fast gigabit fiber with a huge communal oak table. After 3 PM, ambient chatter picks up slightly around the espresso counter, making it prime for non-stressful tasks or collaborative brainstorming.',
    'Single-origin espresso • Oat bar',
    '0.3 km away'
),

-- 2. Five Elephant Mitte
(
    'Five Elephant Mitte',
    'five-elephant-mitte',
    'Alte Schönhauser Str. 14, Mitte',
    'Berlin', 'Germany',
    52.5263, 13.4047,
    ST_SetSRID(ST_MakePoint(13.4047, 52.5263), 4326),
    8.9, 6.8, 9.1, 7.5, 9.1,
    TRUE, FALSE, '$$',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&q=60',
    6, 18,
    'Quiet, airy dumpling-ceiling loft moments away from world-class pour-overs and cheesecake. High laptop-policy compliance from 9 AM to 2 PM with dedicated power stations integrated seamlessly under countertops.',
    'Signature cheesecake • V60 bar',
    '0.5 km away'
),

-- 3. St. Oberholz Loft
(
    'St. Oberholz Loft',
    'st-oberholz-loft',
    'Rosenthaler Str. 72a, Mitte',
    'Berlin', 'Germany',
    52.5294, 13.4012,
    ST_SetSRID(ST_MakePoint(13.4012, 52.5294), 4326),
    8.5, 7.8, 9.7, 7.9, 8.7,
    TRUE, TRUE, '$$$',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=60',
    3, 30,
    'Legendary birthplace of Berlin tech start-ups. Endless power strips at every communal desk, vibrant founder vibes, and ultra-high bandwidth. Expect energetic coffee shop bustle rather than monastic silence.',
    'Coworking day passes • V60 bar',
    '0.5 km away'
),

-- 4. Bonanza Coffee Heroes
(
    'Bonanza Coffee Heroes',
    'bonanza-coffee-heroes',
    'Oderberger Str. 35, Prenzlauer Berg',
    'Berlin', 'Germany',
    52.5380, 13.4065,
    ST_SetSRID(ST_MakePoint(13.4065, 52.5380), 4326),
    9.2, 8.1, 8.5, 8.8, 9.4,
    TRUE, FALSE, '$$',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=60',
    5, 14,
    'Minimalist Scandinavian interior with floor-to-ceiling windows flooding the space with natural light. The upstairs mezzanine is a hidden gem for deep focus — barely any foot traffic and dedicated power rails.',
    'Third-wave specialty • Pour-over bar',
    '0.8 km away'
),

-- 5. Chapter One Coffee
(
    'Chapter One Coffee',
    'chapter-one-coffee',
    'Hauptstr. 1, Schöneberg',
    'Berlin', 'Germany',
    52.4889, 13.3530,
    ST_SetSRID(ST_MakePoint(13.3530, 52.4889), 4326),
    7.8, 7.5, 7.2, 8.2, 8.1,
    TRUE, FALSE, '$$',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&q=60',
    2, 8,
    'Cozy neighborhood gem with a loyal remote-worker community. The back room has a dedicated quiet zone with table lamps and charging stations. Best flat white in Schöneberg.',
    'Flat white specialist • Pastries',
    '2.1 km away'
),

-- 6. Café CK
(
    'Café CK',
    'cafe-ck',
    'Mariannenstr. 49, Kreuzberg',
    'Berlin', 'Germany',
    52.5025, 13.4275,
    ST_SetSRID(ST_MakePoint(13.4275, 52.5025), 4326),
    8.0, 6.5, 8.8, 7.0, 8.4,
    TRUE, TRUE, '$$',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=60',
    7, 20,
    'Kreuzberg industrial-chic with exposed brick and copper pipe lighting. Open until midnight — perfect for night-owl coders. The courtyard garden is a summer productivity paradise.',
    'Cold brew • Late-night kitchen',
    '1.5 km away'
),

-- 7. Nano Kaffee
(
    'Nano Kaffee',
    'nano-kaffee',
    'Dresdener Str. 14, Kreuzberg',
    'Berlin', 'Germany',
    52.5042, 13.4188,
    ST_SetSRID(ST_MakePoint(13.4188, 52.5042), 4326),
    9.0, 8.5, 9.0, 9.2, 9.5,
    TRUE, FALSE, '$',
    'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80',
    'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400&q=60',
    3, 6,
    'Tiny but mighty — this micro-roastery punches above its weight with gigabit fiber and a no-phone-calls policy. The owner is a former developer who designed the space specifically for focused work.',
    'Micro-roastery • Filter coffee',
    '1.2 km away'
),

-- 8. Westberlin
(
    'Westberlin',
    'westberlin',
    'Friedrichstr. 215, Kreuzberg',
    'Berlin', 'Germany',
    52.5070, 13.3888,
    ST_SetSRID(ST_MakePoint(13.3888, 52.5070), 4326),
    7.5, 7.0, 8.0, 7.8, 8.0,
    TRUE, TRUE, '$$',
    'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80',
    'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&q=60',
    8, 25,
    'Art gallery meets coffee shop — rotating exhibitions on the walls while you work at generously spaced desks. The vinyl record collection sets a perfect ambient soundtrack for creative work.',
    'Art café • Vinyl lounge',
    '0.9 km away'
),

-- 9. CODO Coffee
(
    'CODO Coffee',
    'codo-coffee',
    'Friedelstr. 30, Neukölln',
    'Berlin', 'Germany',
    52.4875, 13.4331,
    ST_SetSRID(ST_MakePoint(13.4331, 52.4875), 4326),
    8.3, 7.9, 7.5, 8.5, 8.5,
    TRUE, FALSE, '$',
    'https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=800&q=80',
    'https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=400&q=60',
    4, 10,
    'Neukölln hidden gem with a dedicated coworking corner in the back. The matcha latte is legendary, and the baristas genuinely understand remote workers — they will never rush you.',
    'Matcha specialist • Brunch menu',
    '2.5 km away'
),

-- 10. KASCHK
(
    'KASCHK',
    'kaschk',
    'Linienstr. 40, Mitte',
    'Berlin', 'Germany',
    52.5266, 13.3928,
    ST_SetSRID(ST_MakePoint(13.3928, 52.5266), 4326),
    8.7, 6.2, 8.9, 6.5, 8.2,
    TRUE, TRUE, '$$',
    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&q=60',
    5, 15,
    'Coffee by day, natural wine bar by night. The transition happens seamlessly around 5 PM. Mornings are blissfully quiet with strong WiFi and plenty of outlets along the window counter.',
    'Specialty coffee • Natural wine',
    '0.7 km away'
),

-- 11. Distrikt Coffee
(
    'Distrikt Coffee',
    'distrikt-coffee',
    'Bergstr. 68, Mitte',
    'Berlin', 'Germany',
    52.5298, 13.3892,
    ST_SetSRID(ST_MakePoint(13.3892, 52.5298), 4326),
    8.4, 7.4, 8.6, 7.6, 8.8,
    TRUE, FALSE, '$$',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=60',
    6, 16,
    'Australian-style brunch cafe with excellent batch brew on the house. The upstairs balcony seats offer a surprisingly private workspace overlooking a leafy courtyard. Strong 5GHz network.',
    'Aussie brunch • Batch brew',
    '0.4 km away'
),

-- 12. The Visit Coffee
(
    'The Visit Coffee',
    'the-visit-coffee',
    'Boxhagener Str. 78, Friedrichshain',
    'Berlin', 'Germany',
    52.5118, 13.4587,
    ST_SetSRID(ST_MakePoint(13.4587, 52.5118), 4326),
    7.9, 8.3, 7.0, 8.9, 8.3,
    TRUE, FALSE, '$',
    'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80',
    'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&q=60',
    2, 8,
    'Serene Friedrichshain hideaway that feels like working in a friend''s well-designed living room. The linen curtains diffuse sunlight beautifully, and the owner enforces a gentle no-meeting policy during peak hours.',
    'Single-origin filter • Sourdough',
    '1.8 km away'
);

-- Verify seed data
SELECT
    name,
    overall_nomad_score,
    ST_AsText(location) AS geom,
    city
FROM cafes
ORDER BY overall_nomad_score DESC;
