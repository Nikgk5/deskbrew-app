ALTER TABLE cafes ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'cafe';
UPDATE cafes SET type = 'cafe' WHERE type IS NULL;

INSERT INTO cafes (
    name, slug, address, city, country, latitude, longitude, location,
    wifi_speed, noise_level, power_outlets, quietness_score, overall_nomad_score,
    has_power_outlets, is_open_late, price_level, desks_available, total_desks, type, ai_insight, specialty
) VALUES 
(
    'M92 Workspace', 'm92-kastoria', 'Megalou Alexandrou 92', 'Kastoria', 'Greece', 40.5217, 21.2652,
    ST_SetSRID(ST_MakePoint(21.2652, 40.5217), 4326),
    9.8, 2.1, 9.9, 9.5, 9.7,
    true, true, '$$$', 15, 30, 'workspace',
    'A dedicated premium workspace for digital nomads visiting Kastoria, with extremely fast fiber internet, ergonomic chairs, and quiet rooms.',
    'Dedicated Desks & Meeting Rooms'
),
(
    'Betahaus Berlin', 'betahaus-berlin', 'Rudi-Dutschke-Straße 23', 'Berlin', 'Germany', 52.5074, 13.3904,
    ST_SetSRID(ST_MakePoint(13.3904, 52.5074), 4326),
    9.5, 4.0, 9.5, 8.0, 9.2,
    true, true, '$$$', 40, 150, 'workspace',
    'One of Berlin''s most famous coworking spaces, offering a vibrant community, excellent facilities, and dedicated remote working areas.',
    'Community Events & Coworking'
),
(
    'Outpost Bali', 'outpost-canggu', 'Jl. Raya Semat No.1', 'Canggu', 'Indonesia', -8.6478, 115.1385,
    ST_SetSRID(ST_MakePoint(115.1385, -8.6478), 4326),
    9.0, 3.5, 9.0, 8.5, 9.0,
    true, true, '$$$', 25, 100, 'workspace',
    'Tropical coliving and coworking space featuring AC rooms, standing desks, and a huge nomad community.',
    'Coliving & Coworking'
),
(
    'Selina Secret Garden', 'selina-secret-garden-lisbon', 'Beco de São Lázaro 44', 'Lisbon', 'Portugal', 38.7185, -9.1378,
    ST_SetSRID(ST_MakePoint(-9.1378, 38.7185), 4326),
    8.8, 5.0, 8.5, 7.5, 8.5,
    true, true, '$$$', 20, 80, 'workspace',
    'A hub for digital nomads in Lisbon, combining accommodation with a bustling coworking area and rooftop pool.',
    'Boutique Nomad Hub'
)
ON CONFLICT (slug) DO NOTHING;
