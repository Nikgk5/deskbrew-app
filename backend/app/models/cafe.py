"""
DeskBrew Backend — SQLAlchemy ORM Models

Defines the `Cafe` model mapped to the `cafes` table in Supabase (PostgreSQL
with PostGIS). Spatial coordinates are stored as a PostGIS `POINT(lng, lat)`
geometry enabling efficient bounding-box and radius queries via GeoAlchemy2.

Table Design Rationale
──────────────────────
• `location` — PostGIS Geometry(Point, 4326) column with a GIST spatial index
  for sub-millisecond bounding-box lookups even at scale.
• Nomad-centric metrics (`wifi_speed`, `noise_level`, `power_outlets`,
  `quietness_score`) are stored as numeric columns to support server-side
  filtering and sorting without post-processing.
• `ai_insight` — pre-generated summary text surfaced on the cafe card UI.
• `created_at` / `updated_at` — audit timestamps with server-side defaults.
"""

from datetime import datetime
from typing import Any

from geoalchemy2 import Geometry
from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""

    pass


class Cafe(Base):
    """
    ORM model for the `cafes` table.

    Each row represents a verified remote-work-friendly cafe with spatial
    coordinates, nomad-centric ratings, and metadata used by the DeskBrew UI.
    """

    __tablename__ = "cafes"

    # ── Primary Key ───────────────────────────────────────────────────────
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # ── Identity ──────────────────────────────────────────────────────────
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    address: Mapped[str] = mapped_column(String(500), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    country: Mapped[str] = mapped_column(String(100), nullable=False)

    # ── Spatial ───────────────────────────────────────────────────────────
    # PostGIS Point geometry — SRID 4326 (WGS 84, standard GPS coordinates)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    location: Mapped[Any] = mapped_column(
        Geometry(geometry_type="POINT", srid=4326, spatial_index=True),
        nullable=False,
    )

    # ── Nomad Metrics (1–10 scale) ────────────────────────────────────────
    wifi_speed: Mapped[float] = mapped_column(
        Numeric(3, 1), nullable=False, comment="WiFi speed rating 1-10"
    )
    noise_level: Mapped[float] = mapped_column(
        Numeric(3, 1), nullable=False, comment="Noise level rating 1-10 (10=quietest)"
    )
    power_outlets: Mapped[float] = mapped_column(
        Numeric(3, 1), nullable=False, comment="Power outlet availability 1-10"
    )
    quietness_score: Mapped[float] = mapped_column(
        Numeric(3, 1), nullable=False, comment="Quietness score 1-10"
    )
    overall_nomad_score: Mapped[float] = mapped_column(
        Numeric(3, 1), nullable=False, index=True, comment="Composite nomad score 1-10"
    )

    # ── Amenities & Details ───────────────────────────────────────────────
    has_power_outlets: Mapped[bool] = mapped_column(Boolean, default=True)
    is_open_late: Mapped[bool] = mapped_column(Boolean, default=False)
    price_level: Mapped[str] = mapped_column(
        String(10), nullable=False, default="$$", comment="$, $$, or $$$"
    )
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    thumbnail_url: Mapped[str] = mapped_column(String(500), nullable=True)

    # ── Availability ──────────────────────────────────────────────────────
    desks_available: Mapped[int] = mapped_column(Integer, default=0)
    total_desks: Mapped[int] = mapped_column(Integer, default=0)

    # ── AI-Generated Content ──────────────────────────────────────────────
    ai_insight: Mapped[str] = mapped_column(
        Text,
        nullable=True,
        comment="AI-generated summary of the cafe vibe and work suitability",
    )

    # ── Metadata ──────────────────────────────────────────────────────────
    specialty: Mapped[str] = mapped_column(String(255), nullable=True)
    distance_label: Mapped[str] = mapped_column(String(50), nullable=True)

    # ── Timestamps ────────────────────────────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def __repr__(self) -> str:
        return f"<Cafe(id={self.id}, name='{self.name}', score={self.overall_nomad_score})>"
