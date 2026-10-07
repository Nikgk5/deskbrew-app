"""
DeskBrew Backend — Pydantic Schemas (API Contracts)

Defines the request/response schemas for the Cafes API.
Strict separation between internal ORM models and external API contracts
ensures we never accidentally leak database internals to the client.
"""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# ── Request Schemas ───────────────────────────────────────────────────────────


class BoundingBoxQuery(BaseModel):
    """
    Geographic bounding box for spatial cafe queries.

    The client sends the current map viewport corners so the backend
    returns only cafes visible within the user's screen.
    """

    sw_lat: float = Field(..., ge=-90, le=90, description="Southwest corner latitude")
    sw_lng: float = Field(..., ge=-180, le=180, description="Southwest corner longitude")
    ne_lat: float = Field(..., ge=-90, le=90, description="Northeast corner latitude")
    ne_lng: float = Field(..., ge=-180, le=180, description="Northeast corner longitude")

    # Optional filters
    min_wifi_speed: Optional[float] = Field(None, ge=0, le=10, description="Minimum WiFi speed rating")
    has_power: Optional[bool] = Field(None, description="Filter for power outlet availability")
    open_late: Optional[bool] = Field(None, description="Filter for late-night hours")
    min_score: Optional[float] = Field(None, ge=0, le=10, description="Minimum overall nomad score")


class CafeFilters(BaseModel):
    """Additional filter parameters for cafe listing endpoints."""

    city: Optional[str] = None
    min_wifi_speed: Optional[float] = Field(None, ge=0, le=10)
    has_power: Optional[bool] = None
    open_late: Optional[bool] = None
    sort_by: str = Field(default="overall_nomad_score", pattern="^(overall_nomad_score|wifi_speed|noise_level|name)$")
    sort_order: str = Field(default="desc", pattern="^(asc|desc)$")
    limit: int = Field(default=50, ge=1, le=200)
    offset: int = Field(default=0, ge=0)


# ── Response Schemas ──────────────────────────────────────────────────────────


class NomadScores(BaseModel):
    """Grouped nomad metric scores for a cafe."""

    wifi_speed: float
    power_outlets: float
    quietness: float
    overall: float


class CafeResponse(BaseModel):
    """
    Public API representation of a cafe.

    This schema is what the frontend receives — it flattens the PostGIS
    geometry into simple lat/lng floats and groups nomad metrics into
    a nested `scores` object for clean UI consumption.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    address: str
    city: str
    country: str
    latitude: float
    longitude: float
    type: str

    # Nomad metrics
    scores: NomadScores

    # Amenities
    has_power_outlets: bool
    is_open_late: bool
    price_level: str
    image_url: Optional[str] = None
    thumbnail_url: Optional[str] = None

    # Availability
    desks_available: int = 0
    total_desks: int = 0

    # AI content
    ai_insight: Optional[str] = None

    # Metadata
    specialty: Optional[str] = None
    distance_label: Optional[str] = None

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class CafeListResponse(BaseModel):
    """Paginated list response wrapper with metadata."""

    cafes: list[CafeResponse]
    total: int
    limit: int
    offset: int
    bbox: Optional[dict] = None


class HealthResponse(BaseModel):
    """Health check response."""

    status: str = "healthy"
    service: str = "deskbrew-api"
    version: str = "1.0.0"
