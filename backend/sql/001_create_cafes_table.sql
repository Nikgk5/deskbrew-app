-- ============================================================================
-- DeskBrew — Supabase Database Schema (PostgreSQL + PostGIS)
-- ============================================================================
-- Run this script in the Supabase SQL Editor to create the `cafes` table
-- with PostGIS spatial indexing. Requires the PostGIS extension.
--
-- Architecture Notes:
-- • The `location` column stores a PostGIS POINT(longitude, latitude) geometry
--   in SRID 4326 (WGS 84), matching standard GPS coordinate systems.
-- • A GIST spatial index on `location` enables sub-millisecond bounding-box
--   queries via ST_Within + ST_MakeEnvelope, even at scale.
-- • Nomad metrics are stored as NUMERIC(3,1) to support one-decimal precision
--   on a 1–10 scale (e.g. 8.7, 9.4).
-- ============================================================================

-- 1. Enable PostGIS extension (idempotent)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create the cafes table
CREATE TABLE IF NOT EXISTS cafes (
    -- Primary Key
    id              SERIAL PRIMARY KEY,

    -- Identity
    name            VARCHAR(255)   NOT NULL,
    slug            VARCHAR(255)   NOT NULL UNIQUE,
    address         VARCHAR(500)   NOT NULL,
    city            VARCHAR(100)   NOT NULL,
    country         VARCHAR(100)   NOT NULL,

    -- Coordinates (redundant with `location` for simpler reads)
    latitude        DOUBLE PRECISION NOT NULL,
    longitude       DOUBLE PRECISION NOT NULL,

    -- PostGIS Geometry — POINT(lng, lat) in WGS 84
    location        GEOMETRY(Point, 4326) NOT NULL,

    -- Nomad Metrics (1–10 scale, one decimal)
    wifi_speed          NUMERIC(3,1) NOT NULL CHECK (wifi_speed BETWEEN 0 AND 10),
    noise_level         NUMERIC(3,1) NOT NULL CHECK (noise_level BETWEEN 0 AND 10),
    power_outlets       NUMERIC(3,1) NOT NULL CHECK (power_outlets BETWEEN 0 AND 10),
    quietness_score     NUMERIC(3,1) NOT NULL CHECK (quietness_score BETWEEN 0 AND 10),
    overall_nomad_score NUMERIC(3,1) NOT NULL CHECK (overall_nomad_score BETWEEN 0 AND 10),

    -- Amenities
    has_power_outlets   BOOLEAN DEFAULT TRUE,
    is_open_late        BOOLEAN DEFAULT FALSE,
    price_level         VARCHAR(10) NOT NULL DEFAULT '$$',

    -- Media
    image_url       VARCHAR(500),
    thumbnail_url   VARCHAR(500),

    -- Real-time Availability
    desks_available INTEGER DEFAULT 0,
    total_desks     INTEGER DEFAULT 0,

    -- AI-Generated Content
    ai_insight      TEXT,

    -- Metadata
    specialty       VARCHAR(255),
    distance_label  VARCHAR(50),

    -- Timestamps
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_cafes_location
    ON cafes USING GIST (location);

CREATE INDEX IF NOT EXISTS idx_cafes_city
    ON cafes (city);

CREATE INDEX IF NOT EXISTS idx_cafes_slug
    ON cafes (slug);

CREATE INDEX IF NOT EXISTS idx_cafes_nomad_score
    ON cafes (overall_nomad_score DESC);

CREATE INDEX IF NOT EXISTS idx_cafes_name
    ON cafes (name);

-- 4. Create an update trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_cafes_updated_at ON cafes;

CREATE TRIGGER trigger_cafes_updated_at
    BEFORE UPDATE ON cafes
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- 5. Enable Row Level Security (Supabase best practice)
ALTER TABLE cafes ENABLE ROW LEVEL SECURITY;

-- Allow public read access (no auth required for browsing)
CREATE POLICY "Allow public read access"
    ON cafes FOR SELECT
    USING (true);

-- ============================================================================
-- Verification: Run after executing the script
-- ============================================================================
-- SELECT PostGIS_Version();
-- SELECT count(*) FROM cafes;
-- \d cafes
