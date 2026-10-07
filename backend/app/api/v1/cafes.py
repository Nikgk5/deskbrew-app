"""
DeskBrew Backend — Cafe API Routes

RESTful endpoints for querying remote-work-friendly cafes.

Endpoints:
    GET /api/v1/cafes/bbox     — Spatial query by map viewport bounding box
    GET /api/v1/cafes          — Paginated listing with filters & sorting
    GET /api/v1/cafes/{slug}   — Single cafe detail by slug
    GET /api/v1/cafes/id/{id}  — Single cafe detail by ID
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.cafe import (
    get_cafe_by_id,
    get_cafe_by_slug,
    get_cafes_in_bbox,
    get_cafes_list,
)
from app.models.cafe import Cafe
from app.schemas.cafe import (
    BoundingBoxQuery,
    CafeFilters,
    CafeListResponse,
    CafeResponse,
    NomadScores,
)

router = APIRouter(prefix="/cafes", tags=["cafes"])


def _to_response(cafe: Cafe) -> CafeResponse:
    """Convert an ORM Cafe instance to a CafeResponse schema."""
    return CafeResponse(
        id=cafe.id,
        name=cafe.name,
        slug=cafe.slug,
        address=cafe.address,
        city=cafe.city,
        country=cafe.country,
        latitude=cafe.latitude,
        longitude=cafe.longitude,
        scores=NomadScores(
            wifi_speed=float(cafe.wifi_speed),
            power_outlets=float(cafe.power_outlets),
            quietness=float(cafe.quietness_score),
            overall=float(cafe.overall_nomad_score),
        ),
        has_power_outlets=cafe.has_power_outlets,
        is_open_late=cafe.is_open_late,
        price_level=cafe.price_level,
        image_url=cafe.image_url,
        thumbnail_url=cafe.thumbnail_url,
        desks_available=cafe.desks_available,
        total_desks=cafe.total_desks,
        ai_insight=cafe.ai_insight,
        specialty=cafe.specialty,
        distance_label=cafe.distance_label,
        created_at=cafe.created_at,
        updated_at=cafe.updated_at,
    )


@router.get(
    "/bbox",
    response_model=CafeListResponse,
    summary="Query cafes within map viewport",
    description=(
        "Returns cafes whose PostGIS coordinates fall within the supplied "
        "bounding box. Designed to be called on every map `moveend` event "
        "so the sidebar stays in sync with the visible map area."
    ),
)
def query_cafes_by_bbox(
    sw_lat: float = Query(..., ge=-90, le=90, description="Southwest latitude"),
    sw_lng: float = Query(..., ge=-180, le=180, description="Southwest longitude"),
    ne_lat: float = Query(..., ge=-90, le=90, description="Northeast latitude"),
    ne_lng: float = Query(..., ge=-180, le=180, description="Northeast longitude"),
    min_wifi_speed: Optional[float] = Query(None, ge=0, le=10),
    has_power: Optional[bool] = Query(None),
    open_late: Optional[bool] = Query(None),
    min_score: Optional[float] = Query(None, ge=0, le=10),
    db: Session = Depends(get_db),
) -> CafeListResponse:
    """
    Spatial bounding-box query endpoint.

    The frontend sends the map's current viewport corners on every
    pan/zoom event. The backend uses PostGIS `ST_Within` + `ST_MakeEnvelope`
    to return only the cafes visible in that viewport.
    """
    bbox = BoundingBoxQuery(
        sw_lat=sw_lat,
        sw_lng=sw_lng,
        ne_lat=ne_lat,
        ne_lng=ne_lng,
        min_wifi_speed=min_wifi_speed,
        has_power=has_power,
        open_late=open_late,
        min_score=min_score,
    )

    cafes, total = get_cafes_in_bbox(db, bbox)

    return CafeListResponse(
        cafes=[_to_response(c) for c in cafes],
        total=total,
        limit=100,
        offset=0,
        bbox={
            "sw_lat": sw_lat,
            "sw_lng": sw_lng,
            "ne_lat": ne_lat,
            "ne_lng": ne_lng,
        },
    )


@router.get(
    "",
    response_model=CafeListResponse,
    summary="List cafes with filters",
    description="Paginated cafe listing with optional filtering and sorting.",
)
def list_cafes(
    city: Optional[str] = Query(None),
    min_wifi_speed: Optional[float] = Query(None, ge=0, le=10),
    has_power: Optional[bool] = Query(None),
    open_late: Optional[bool] = Query(None),
    sort_by: str = Query("overall_nomad_score"),
    sort_order: str = Query("desc"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
) -> CafeListResponse:
    """Paginated, filterable cafe listing endpoint."""
    filters = CafeFilters(
        city=city,
        min_wifi_speed=min_wifi_speed,
        has_power=has_power,
        open_late=open_late,
        sort_by=sort_by,
        sort_order=sort_order,
        limit=limit,
        offset=offset,
    )

    cafes, total = get_cafes_list(db, filters)

    return CafeListResponse(
        cafes=[_to_response(c) for c in cafes],
        total=total,
        limit=filters.limit,
        offset=filters.offset,
    )


@router.get(
    "/{slug}",
    response_model=CafeResponse,
    summary="Get cafe by slug",
    description="Fetch a single cafe's full details by its URL-friendly slug.",
)
def get_cafe_detail(
    slug: str,
    db: Session = Depends(get_db),
) -> CafeResponse:
    """Single cafe detail endpoint."""
    cafe = get_cafe_by_slug(db, slug)
    if not cafe:
        raise HTTPException(status_code=404, detail=f"Cafe '{slug}' not found")
    return _to_response(cafe)


@router.get(
    "/id/{cafe_id}",
    response_model=CafeResponse,
    summary="Get cafe by ID",
    description="Fetch a single cafe's full details by primary key.",
)
def get_cafe_by_pk(
    cafe_id: int,
    db: Session = Depends(get_db),
) -> CafeResponse:
    """Single cafe lookup by numeric ID."""
    cafe = get_cafe_by_id(db, cafe_id)
    if not cafe:
        raise HTTPException(status_code=404, detail=f"Cafe with id={cafe_id} not found")
    return _to_response(cafe)
