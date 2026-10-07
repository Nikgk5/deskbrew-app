INSERT INTO cafes (
    name, slug, address, city, country, latitude, longitude, location,
    wifi_speed, noise_level, power_outlets, quietness_score, overall_nomad_score,
    has_power_outlets, is_open_late, price_level, desks_available, total_desks, type, ai_insight, specialty
) VALUES 
(
    'St. Oberholz', 'st-oberholz-rosenthaler', 'Rosenthaler Str. 72A', 'Berlin', 'Germany', 52.5284, 13.4024,
    ST_SetSRID(ST_MakePoint(13.4024, 52.5284), 4326),
    9.2, 5.5, 8.5, 6.0, 8.8,
    true, true, '$$', 2, 45, 'cafe',
    'Legendary startup hub in Mitte. Great coffee but very crowded, often hard to find a free power outlet.',
    'Startup Hub Cafe'
),
(
    'The Barn Coffee Roasters', 'the-barn-mitte', 'Auguststraße 58', 'Berlin', 'Germany', 52.5273, 13.3957,
    ST_SetSRID(ST_MakePoint(13.3957, 52.5273), 4326),
    8.0, 3.5, 4.0, 7.5, 7.5,
    true, false, '$$', 1, 15, 'cafe',
    'Excellent specialty coffee. Laptop free zones exist, very few seats available for working.',
    'Specialty Coffee'
),
(
    'Five Elephant Mitte', 'five-elephant-mitte', 'Alte Schönhauser Str. 14', 'Berlin', 'Germany', 52.5255, 13.4069,
    ST_SetSRID(ST_MakePoint(13.4069, 52.5255), 4326),
    8.5, 4.0, 5.5, 7.0, 8.0,
    true, false, '$$', 3, 20, 'cafe',
    'Incredible cheesecake and coffee. Good wifi but limited space. Grab a seat early.',
    'Cheesecake & Espresso'
),
(
    'Factory Berlin', 'factory-berlin-mitte', 'Rheinsberger Str. 76/77', 'Berlin', 'Germany', 52.5367, 13.3976,
    ST_SetSRID(ST_MakePoint(13.3976, 52.5367), 4326),
    9.9, 3.0, 9.8, 8.5, 9.5,
    true, true, '$$$', 45, 200, 'workspace',
    'Massive tech hub and workspace. Excellent facilities but membership is required.',
    'Tech Campus'
)
ON CONFLICT (slug) DO UPDATE SET 
    desks_available = EXCLUDED.desks_available,
    total_desks = EXCLUDED.total_desks;
