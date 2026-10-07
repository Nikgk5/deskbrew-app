"""
DeskBrew Backend — Cafe CRUD Operations (Repository Layer)

Encapsulates all database queries for the Cafe model. This layer sits
between the API routes and the ORM, keeping business logic testable
and decoupled from HTTP concerns.

Key Query: `get_cafes_in_bbox`
──────────────────────────────
Uses PostGIS `ST_MakeEnvelope` + `ST_Within` for spatial bounding-box
filtering. The GIST index on `cafes.location` ensures O(log n) lookups
even with millions of rows.
"""

from geoalchemy2.functions import ST_MakeEnvelope, ST_Within
from typing import Optional
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.cafe import Cafe
from app.schemas.cafe import BoundingBoxQuery, CafeFilters


def get_cafes_in_bbox(
    db: Session,
    bbox: BoundingBoxQuery,
) -> tuple[list[Cafe], int]:
    """
    Fetch cafes within a geographic bounding box.

    Args:
        db: Active database session.
        bbox: Bounding box coordinates with optional filter parameters.

    Returns:
        Tuple of (list of Cafe ORM instances, total count).

    SQL equivalent:
        SELECT * FROM cafes
        WHERE ST_Within(
            location,
            ST_MakeEnvelope(sw_lng, sw_lat, ne_lng, ne_lat, 4326)
        )
        AND wifi_speed >= :min_wifi_speed  -- optional
        AND has_power_outlets = true        -- optional
        AND is_open_late = true             -- optional
        ORDER BY overall_nomad_score DESC;
    """
    envelope = ST_MakeEnvelope(
        bbox.sw_lng, bbox.sw_lat,
        bbox.ne_lng, bbox.ne_lat,
        4326,  # SRID — WGS 84
    )

    stmt = select(Cafe).where(ST_Within(Cafe.location, envelope))

    # Apply optional filters
    if bbox.min_wifi_speed is not None:
        stmt = stmt.where(Cafe.wifi_speed >= bbox.min_wifi_speed)
    if bbox.has_power is True:
        stmt = stmt.where(Cafe.has_power_outlets.is_(True))
    if bbox.open_late is True:
        stmt = stmt.where(Cafe.is_open_late.is_(True))
    if bbox.min_score is not None:
        stmt = stmt.where(Cafe.overall_nomad_score >= bbox.min_score)

    # Count total matching rows (before pagination)
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = db.execute(count_stmt).scalar() or 0

    # Order by best nomad score first, limit to 100
    stmt = stmt.order_by(Cafe.overall_nomad_score.desc()).limit(100)

    cafes = db.execute(stmt).scalars().all()
    return list(cafes), total


def get_cafes_list(
    db: Session,
    filters: CafeFilters,
) -> tuple[list[Cafe], int]:
    """
    Fetch a paginated, filtered, sorted list of cafes.

    Args:
        db: Active database session.
        filters: Filter, sort, and pagination parameters.

    Returns:
        Tuple of (list of Cafe ORM instances, total count).
    """
    stmt = select(Cafe)

    # Apply filters
    if filters.city:
        stmt = stmt.where(Cafe.city.ilike(f"%{filters.city}%"))
    if filters.min_wifi_speed is not None:
        stmt = stmt.where(Cafe.wifi_speed >= filters.min_wifi_speed)
    if filters.has_power is True:
        stmt = stmt.where(Cafe.has_power_outlets.is_(True))
    if filters.open_late is True:
        stmt = stmt.where(Cafe.is_open_late.is_(True))

    # Count
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = db.execute(count_stmt).scalar() or 0

    # Sort
    sort_column = getattr(Cafe, filters.sort_by, Cafe.overall_nomad_score)
    order = sort_column.desc() if filters.sort_order == "desc" else sort_column.asc()
    stmt = stmt.order_by(order)

    # Paginate
    stmt = stmt.offset(filters.offset).limit(filters.limit)

    cafes = db.execute(stmt).scalars().all()
    return list(cafes), total


def get_cafe_by_slug(db: Session, slug: str) -> Optional[Cafe]:
    """Fetch a single cafe by its URL-friendly slug."""
    stmt = select(Cafe).where(Cafe.slug == slug)
    return db.execute(stmt).scalar_one_or_none()


def get_cafe_by_id(db: Session, cafe_id: int) -> Optional[Cafe]:
    """Fetch a single cafe by primary key."""
    return db.get(Cafe, cafe_id)
