"""
DeskBrew API — Application Entry Point

FastAPI application factory with:
  • CORS middleware configured for the Next.js frontend
  • Versioned API routing (/api/v1/...)
  • Health check endpoint for infrastructure monitoring
  • Auto-generated OpenAPI docs at /docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import router as v1_router
from app.core.config import get_settings
from app.schemas.cafe import HealthResponse

settings = get_settings()

app = FastAPI(
    title=settings.project_name,
    description=(
        "REST API for DeskBrew — a map-based platform helping digital nomads "
        "discover remote-work-friendly cafes with real-time availability, "
        "nomad scores, and AI-powered insights. Built with FastAPI, "
        "SQLAlchemy, GeoAlchemy2, and PostGIS."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ── CORS Middleware ───────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Route Registration ────────────────────────────────────────────────────────
app.include_router(v1_router, prefix=settings.api_v1_prefix)


# ── Health Check ──────────────────────────────────────────────────────────────
@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["infrastructure"],
    summary="Service health check",
)
def health_check() -> HealthResponse:
    """Returns service status for load balancers and monitoring."""
    return HealthResponse()


@app.get("/", include_in_schema=False)
def root():
    """Redirect root to API docs."""
    return {
        "service": "DeskBrew API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }
