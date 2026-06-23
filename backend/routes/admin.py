"""Admin authentication and management routes."""

from datetime import datetime, timedelta
import logging
from typing import Any

from fastapi import APIRouter, HTTPException, status, Body
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin", tags=["admin"])

# Admin credentials (hardcoded for now - in production use environment variables)
ADMIN_ID = "Admin"
ADMIN_PASSWORD = "Mobile@123"
SESSION_TIMEOUT_MINUTES = 15

# In-memory session storage (in production, use Redis or database)
active_sessions: dict[str, dict[str, Any]] = {}


class LoginRequest(BaseModel):
    """Admin login request."""

    admin_id: str
    password: str


class LoginResponse(BaseModel):
    """Admin login response."""

    success: bool
    session_token: str | None = None
    expires_at: str | None = None
    message: str


class SessionValidation(BaseModel):
    """Session validation response."""

    is_valid: bool
    expires_at: str | None = None


class AdminStatus(BaseModel):
    """Admin system status."""

    status: str
    providers_count: int
    active_providers: int
    total_requests_today: int
    last_check: str


@router.post("/login", response_model=LoginResponse)
async def admin_login(request: LoginRequest) -> LoginResponse:
    """Authenticate admin user."""
    # Verify credentials
    if request.admin_id != ADMIN_ID or request.password != ADMIN_PASSWORD:
        logger.warning(f"Failed login attempt with ID: {request.admin_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    # Generate session token
    session_token = f"token_{datetime.utcnow().timestamp()}_{request.admin_id}"
    expires_at = datetime.utcnow() + timedelta(minutes=SESSION_TIMEOUT_MINUTES)

    # Store session
    active_sessions[session_token] = {
        "admin_id": request.admin_id,
        "created_at": datetime.utcnow().isoformat(),
        "expires_at": expires_at.isoformat(),
    }

    logger.info(f"Admin login successful for: {request.admin_id}")

    return LoginResponse(
        success=True,
        session_token=session_token,
        expires_at=expires_at.isoformat(),
        message="Login successful",
    )


@router.post("/logout")
async def admin_logout(session_token: str = Body(...)) -> dict[str, str]:
    """Logout admin user."""
    if session_token in active_sessions:
        del active_sessions[session_token]
        logger.info("Admin logout")
    return {"message": "Logout successful"}


@router.post("/validate-session", response_model=SessionValidation)
async def validate_session(session_token: str = Body(...)) -> SessionValidation:
    """Validate admin session."""
    if session_token not in active_sessions:
        return SessionValidation(is_valid=False)

    session = active_sessions[session_token]
    expires_at = datetime.fromisoformat(session["expires_at"])

    if datetime.utcnow() > expires_at:
        del active_sessions[session_token]
        return SessionValidation(is_valid=False)

    return SessionValidation(is_valid=True, expires_at=session["expires_at"])


@router.post("/refresh-session")
async def refresh_session(session_token: str = Body(...)) -> LoginResponse:
    """Refresh admin session."""
    if session_token not in active_sessions:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")

    session = active_sessions[session_token]
    expires_at = datetime.utcnow() + timedelta(minutes=SESSION_TIMEOUT_MINUTES)

    session["expires_at"] = expires_at.isoformat()

    logger.info("Admin session refreshed")

    return LoginResponse(
        success=True,
        session_token=session_token,
        expires_at=expires_at.isoformat(),
        message="Session refreshed",
    )


@router.get("/status", response_model=AdminStatus)
async def get_admin_status() -> AdminStatus:
    """Get current admin system status."""
    return AdminStatus(
        status="healthy",
        providers_count=0,  # Will be updated by provider routes
        active_providers=0,
        total_requests_today=0,
        last_check=datetime.utcnow().isoformat(),
    )


@router.get("/health")
async def health_check() -> dict[str, str]:
    """Admin panel health check."""
    return {"status": "ok", "service": "admin-panel"}
