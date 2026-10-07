"""
DeskBrew Backend — Database Engine & Session Management

Provides the SQLAlchemy engine, session factory, and a FastAPI-compatible
dependency that yields a scoped database session per request.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings

settings = get_settings()

engine = create_engine(
    settings.database_url,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  # verify connections before checkout
    echo=settings.debug,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a transactional database session.

    The session is automatically closed after the request completes,
    ensuring connections are returned to the pool.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
