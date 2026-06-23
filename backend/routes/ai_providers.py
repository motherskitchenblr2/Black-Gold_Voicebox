"""AI provider management routes."""

import logging
from typing import Any
from datetime import datetime
import json

from fastapi import APIRouter, HTTPException, status, Body, Query
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai-providers", tags=["ai-providers"])

# In-memory provider storage (in production, use database)
providers_storage: dict[str, dict[str, Any]] = {}


class ProviderUsageStats(BaseModel):
    """Provider usage statistics."""

    requests_today: int = 0
    tokens_used: int = 0
    last_used: str | None = None


class AIProviderConfig(BaseModel):
    """AI Provider configuration."""

    id: str
    name: str
    type: str = Field(..., description="llm, embedding, image, or audio")
    api_key: str
    is_active: bool = False
    models: list[str]
    selected_model: str
    base_url: str | None = None
    rate_limit: int = 3000
    usage_stats: ProviderUsageStats = Field(default_factory=ProviderUsageStats)


class ProviderResponse(BaseModel):
    """Provider response model."""

    success: bool
    message: str
    provider: AIProviderConfig | None = None


class ProvidersListResponse(BaseModel):
    """Providers list response."""

    success: bool
    count: int
    providers: list[AIProviderConfig]


@router.post("/create", response_model=ProviderResponse)
async def create_provider(provider: AIProviderConfig) -> ProviderResponse:
    """Create a new AI provider configuration."""
    if provider.id in providers_storage:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Provider {provider.id} already exists",
        )

    # Validate API key is provided
    if not provider.api_key or provider.api_key.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="API key is required"
        )

    # Store provider
    providers_storage[provider.id] = provider.model_dump()

    logger.info(f"Created AI provider: {provider.name} ({provider.id})")

    return ProviderResponse(
        success=True, message=f"Provider {provider.name} created successfully", provider=provider
    )


@router.get("/list", response_model=ProvidersListResponse)
async def list_providers() -> ProvidersListResponse:
    """List all configured providers."""
    providers = [AIProviderConfig(**config) for config in providers_storage.values()]

    return ProvidersListResponse(success=True, count=len(providers), providers=providers)


@router.get("/{provider_id}", response_model=ProviderResponse)
async def get_provider(provider_id: str) -> ProviderResponse:
    """Get provider configuration."""
    if provider_id not in providers_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Provider {provider_id} not found"
        )

    provider = AIProviderConfig(**providers_storage[provider_id])

    return ProviderResponse(success=True, message="Provider found", provider=provider)


@router.put("/{provider_id}", response_model=ProviderResponse)
async def update_provider(provider_id: str, updates: dict[str, Any]) -> ProviderResponse:
    """Update provider configuration."""
    if provider_id not in providers_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Provider {provider_id} not found"
        )

    # Update provider
    provider_data = providers_storage[provider_id]
    provider_data.update(updates)

    logger.info(f"Updated provider: {provider_id}")

    provider = AIProviderConfig(**provider_data)

    return ProviderResponse(
        success=True, message="Provider updated successfully", provider=provider
    )


@router.delete("/{provider_id}")
async def delete_provider(provider_id: str) -> dict[str, str]:
    """Delete provider configuration."""
    if provider_id not in providers_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Provider {provider_id} not found"
        )

    del providers_storage[provider_id]

    logger.info(f"Deleted provider: {provider_id}")

    return {"message": f"Provider {provider_id} deleted successfully"}


@router.post("/{provider_id}/activate")
async def activate_provider(provider_id: str) -> ProviderResponse:
    """Activate a provider."""
    if provider_id not in providers_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Provider {provider_id} not found"
        )

    providers_storage[provider_id]["is_active"] = True

    logger.info(f"Activated provider: {provider_id}")

    provider = AIProviderConfig(**providers_storage[provider_id])

    return ProviderResponse(success=True, message="Provider activated", provider=provider)


@router.post("/{provider_id}/deactivate")
async def deactivate_provider(provider_id: str) -> ProviderResponse:
    """Deactivate a provider."""
    if provider_id not in providers_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Provider {provider_id} not found"
        )

    providers_storage[provider_id]["is_active"] = False

    logger.info(f"Deactivated provider: {provider_id}")

    provider = AIProviderConfig(**providers_storage[provider_id])

    return ProviderResponse(success=True, message="Provider deactivated", provider=provider)


@router.post("/{provider_id}/test")
async def test_provider(provider_id: str) -> dict[str, Any]:
    """Test provider connectivity."""
    if provider_id not in providers_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Provider {provider_id} not found"
        )

    provider_data = providers_storage[provider_id]

    # Simulate test (in production, make actual API call)
    logger.info(f"Testing provider: {provider_id}")

    return {
        "success": True,
        "message": f"Connection to {provider_data['name']} successful",
        "provider_id": provider_id,
        "response_time_ms": 234,
    }


@router.post("/{provider_id}/usage")
async def update_usage_stats(
    provider_id: str, requests_increment: int = 1, tokens_increment: int = 0
) -> ProviderResponse:
    """Update provider usage statistics."""
    if provider_id not in providers_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Provider {provider_id} not found"
        )

    provider_data = providers_storage[provider_id]

    # Update usage stats
    if "usage_stats" not in provider_data:
        provider_data["usage_stats"] = {
            "requests_today": 0,
            "tokens_used": 0,
            "last_used": None,
        }

    provider_data["usage_stats"]["requests_today"] += requests_increment
    provider_data["usage_stats"]["tokens_used"] += tokens_increment
    provider_data["usage_stats"]["last_used"] = datetime.utcnow().isoformat()

    logger.info(
        f"Updated usage for {provider_id}: +{requests_increment} requests, +{tokens_increment} tokens"
    )

    provider = AIProviderConfig(**provider_data)

    return ProviderResponse(success=True, message="Usage stats updated", provider=provider)


@router.post("/{provider_id}/completion")
async def provider_completion(provider_id: str, prompt: str = Body(...)) -> dict[str, Any]:
    """Call LLM completion using specified provider."""
    if provider_id not in providers_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Provider {provider_id} not found"
        )

    provider_data = providers_storage[provider_id]

    if not provider_data.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Provider {provider_id} is not active"
        )

    if provider_data.get("type") != "llm":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Provider {provider_id} does not support LLM completions",
        )

    # In production, this would call the actual provider API
    logger.info(f"Generating completion using {provider_data['name']}...")

    # Simulate API call response
    response_text = f"[Simulated response from {provider_data['name']} using {provider_data['selected_model']}]"

    # Update usage stats
    provider_data["usage_stats"]["requests_today"] = (
        provider_data.get("usage_stats", {}).get("requests_today", 0) + 1
    )
    provider_data["usage_stats"]["tokens_used"] = (
        provider_data.get("usage_stats", {}).get("tokens_used", 0) + 150
    )
    provider_data["usage_stats"]["last_used"] = datetime.utcnow().isoformat()

    return {
        "success": True,
        "provider_id": provider_id,
        "provider_name": provider_data["name"],
        "model": provider_data["selected_model"],
        "prompt": prompt,
        "response": response_text,
        "tokens_used": 150,
    }
