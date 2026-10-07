"""API v1 router — aggregates all versioned endpoint routers."""

from fastapi import APIRouter

from app.api.v1.cafes import router as cafes_router

router = APIRouter()
router.include_router(cafes_router)
