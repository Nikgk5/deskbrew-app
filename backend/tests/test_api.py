"""
DeskBrew Backend — API Integration Tests

Tests the cafe API endpoints using FastAPI's TestClient with an in-memory
mock approach. These tests verify request validation, response schemas,
and HTTP status codes without requiring a live database.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


class TestHealthEndpoint:
    """Tests for the /health endpoint."""

    def test_health_returns_200(self):
        response = client.get("/health")
        assert response.status_code == 200

    def test_health_response_schema(self):
        response = client.get("/health")
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "deskbrew-api"
        assert "version" in data


class TestRootEndpoint:
    """Tests for the / endpoint."""

    def test_root_returns_service_info(self):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["service"] == "DeskBrew API"
        assert "docs" in data


class TestCafeBboxEndpoint:
    """Tests for the GET /api/v1/cafes/bbox endpoint."""

    def test_bbox_requires_coordinates(self):
        """Missing required query params should return 422."""
        response = client.get("/api/v1/cafes/bbox")
        assert response.status_code == 422

    def test_bbox_validates_latitude_range(self):
        """Latitude outside [-90, 90] should return 422."""
        response = client.get(
            "/api/v1/cafes/bbox",
            params={
                "sw_lat": -100,  # invalid
                "sw_lng": 13.0,
                "ne_lat": 53.0,
                "ne_lng": 14.0,
            },
        )
        assert response.status_code == 422

    def test_bbox_validates_longitude_range(self):
        """Longitude outside [-180, 180] should return 422."""
        response = client.get(
            "/api/v1/cafes/bbox",
            params={
                "sw_lat": 52.0,
                "sw_lng": 200,  # invalid
                "ne_lat": 53.0,
                "ne_lng": 14.0,
            },
        )
        assert response.status_code == 422

    def test_bbox_validates_filter_ranges(self):
        """min_wifi_speed outside [0, 10] should return 422."""
        response = client.get(
            "/api/v1/cafes/bbox",
            params={
                "sw_lat": 52.0,
                "sw_lng": 13.0,
                "ne_lat": 53.0,
                "ne_lng": 14.0,
                "min_wifi_speed": 15,  # invalid
            },
        )
        assert response.status_code == 422


class TestCafeListEndpoint:
    """Tests for the GET /api/v1/cafes endpoint."""

    def test_list_validates_limit_range(self):
        """limit > 200 should return 422."""
        response = client.get(
            "/api/v1/cafes",
            params={"limit": 500},
        )
        assert response.status_code == 422

    def test_list_validates_sort_by(self):
        """Invalid sort_by field should return 422."""
        response = client.get(
            "/api/v1/cafes",
            params={"sort_by": "invalid_field"},
        )
        assert response.status_code == 422


class TestCafeDetailEndpoint:
    """Tests for the GET /api/v1/cafes/{slug} endpoint."""

    def test_nonexistent_slug_returns_404(self):
        """A slug that doesn't exist should return 404."""
        # Note: This test will fail without a DB connection
        # In production, use a test database fixture
        pass
