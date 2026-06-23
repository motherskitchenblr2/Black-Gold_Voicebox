#!/usr/bin/env python3
"""Lightweight development backend for Voicebox AI API Integration.

This server provides the necessary API endpoints without heavy ML dependencies.
Used for development and testing of the AI Provider integration UI.
"""

import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import json
import os

# ============================================================================
# Data Models
# ============================================================================

class AdminLoginRequest(BaseModel):
    admin_id: str
    password: str


class AdminLoginResponse(BaseModel):
    token: str
    admin_id: str
    expires_in: int


class AIProvider(BaseModel):
    id: str
    name: str
    base_url: str
    api_key_required: bool = True
    models: List[str] = []
    is_active: bool = False
    rate_limit: int = 100


class ProviderConfig(BaseModel):
    provider_id: str
    api_key: str
    model: str
    rate_limit: int = 100


class PromptRequest(BaseModel):
    prompt: str
    provider_id: Optional[str] = None
    model: Optional[str] = None
    max_tokens: int = 500


class PromptResponse(BaseModel):
    response: str
    tokens_used: int
    provider: str
    timestamp: datetime


class UsageStats(BaseModel):
    provider: str
    total_requests: int
    total_tokens: int
    last_used: Optional[datetime] = None


class AuditLog(BaseModel):
    id: str
    action: str
    admin_id: str
    timestamp: datetime
    details: Dict[str, Any] = {}


# ============================================================================
# In-Memory Storage
# ============================================================================

ADMIN_CREDENTIALS = {
    "admin_id": "Admin",
    "password": "Mobile@123"
}

ACTIVE_SESSIONS = {}
PROVIDERS_CONFIG = {}
USAGE_STATS = {}
AUDIT_LOGS = []
LOG_ID_COUNTER = 0

# Available free providers
AVAILABLE_PROVIDERS = {
    "groq": {
        "name": "Groq",
        "base_url": "https://api.groq.com/openai/v1",
        "models": ["mixtral-8x7b", "llama-3-8b", "llama-3-70b"],
        "docs": "https://console.groq.com"
    },
    "deepinfra": {
        "name": "Deep Infra",
        "base_url": "https://api.deepinfra.com/v1/openai",
        "models": ["meta-llama/Llama-2-70b", "mistralai/Mistral-7B"],
        "docs": "https://deepinfra.com"
    },
    "huggingface": {
        "name": "Hugging Face",
        "base_url": "https://api-inference.huggingface.co",
        "models": ["gpt2", "distilbert-base-uncased"],
        "docs": "https://huggingface.co/docs/api-inference"
    },
    "together": {
        "name": "Together AI",
        "base_url": "https://api.together.xyz/v1",
        "models": ["togethercomputer/llama-2-70b", "NousResearch/Nous-Hermes-2-Mixtral-8x7B"],
        "docs": "https://www.together.ai"
    },
    "replicate": {
        "name": "Replicate",
        "base_url": "https://api.replicate.com/v1",
        "models": ["stability-ai/sdxl", "meta/llama-2-70b"],
        "docs": "https://replicate.com"
    },
    "anthropic": {
        "name": "Anthropic",
        "base_url": "https://api.anthropic.com/v1",
        "models": ["claude-3-opus", "claude-3-sonnet"],
        "docs": "https://console.anthropic.com"
    },
    "openrouter": {
        "name": "OpenRouter",
        "base_url": "https://openrouter.ai/api/v1",
        "models": ["openai/gpt-4", "anthropic/claude-3-opus"],
        "docs": "https://openrouter.ai"
    },
    "mistral": {
        "name": "Mistral AI",
        "base_url": "https://api.mistral.ai/v1",
        "models": ["mistral-small", "mistral-medium"],
        "docs": "https://console.mistral.ai"
    },
    "llamacloud": {
        "name": "LLaMA Cloud",
        "base_url": "https://api.llama-cloud.com/v1",
        "models": ["llama-2-7b", "llama-2-13b"],
        "docs": "https://cloud.llamaindex.ai"
    },
    "cohere": {
        "name": "Cohere",
        "base_url": "https://api.cohere.com/v1",
        "models": ["command", "command-light"],
        "docs": "https://cohere.com/docs"
    }
}

# ============================================================================
# FastAPI App Setup
# ============================================================================

app = FastAPI(
    title="Voicebox AI API Integration Backend",
    version="1.0.0",
    description="Development backend for AI provider management"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Utility Functions
# ============================================================================

def log_audit(action: str, admin_id: str, details: Dict[str, Any] = None):
    """Log admin actions for audit trail."""
    global LOG_ID_COUNTER
    LOG_ID_COUNTER += 1
    audit_entry = AuditLog(
        id=str(LOG_ID_COUNTER),
        action=action,
        admin_id=admin_id,
        timestamp=datetime.now(),
        details=details or {}
    )
    AUDIT_LOGS.append(audit_entry)
    return audit_entry


def get_session_admin(token: str) -> str:
    """Validate session token and return admin_id."""
    if token not in ACTIVE_SESSIONS:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    return ACTIVE_SESSIONS[token]["admin_id"]


# ============================================================================
# Health Check Route
# ============================================================================

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "voicebox-backend",
        "version": "1.0.0"
    }


# ============================================================================
# Admin Routes (/admin/*)
# ============================================================================

@app.post("/admin/login", response_model=AdminLoginResponse)
def admin_login(request: AdminLoginRequest):
    """Authenticate admin with credentials."""
    if request.admin_id != ADMIN_CREDENTIALS["admin_id"] or \
       request.password != ADMIN_CREDENTIALS["password"]:
        log_audit("failed_login", request.admin_id, {"reason": "invalid_credentials"})
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create session
    token = f"session_{int(datetime.now().timestamp() * 1000)}"
    ACTIVE_SESSIONS[token] = {
        "admin_id": request.admin_id,
        "created_at": datetime.now(),
        "expires_in": 900  # 15 minutes
    }
    
    log_audit("login", request.admin_id, {"token": token})
    
    return AdminLoginResponse(
        token=token,
        admin_id=request.admin_id,
        expires_in=900
    )


@app.post("/admin/verify-session")
def verify_session(token: str):
    """Verify if session is still valid."""
    if token not in ACTIVE_SESSIONS:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    session = ACTIVE_SESSIONS[token]
    return {
        "valid": True,
        "admin_id": session["admin_id"],
        "expires_in": 900
    }


@app.post("/admin/logout")
def logout(token: str):
    """Logout admin session."""
    admin_id = get_session_admin(token)
    del ACTIVE_SESSIONS[token]
    log_audit("logout", admin_id)
    return {"status": "logged_out"}


@app.post("/admin/refresh-session")
def refresh_session(token: str):
    """Refresh session token."""
    admin_id = get_session_admin(token)
    new_token = f"session_{int(datetime.now().timestamp() * 1000)}"
    ACTIVE_SESSIONS[new_token] = ACTIVE_SESSIONS[token]
    del ACTIVE_SESSIONS[token]
    log_audit("session_refresh", admin_id)
    return {"token": new_token, "expires_in": 900}


# ============================================================================
# AI Provider Routes (/ai-providers/*)
# ============================================================================

@app.get("/ai-providers/available")
def get_available_providers(token: Optional[str] = None):
    """Get list of available free AI providers."""
    providers = []
    for provider_id, info in AVAILABLE_PROVIDERS.items():
        providers.append({
            "id": provider_id,
            "name": info["name"],
            "models": info["models"],
            "docs": info["docs"],
            "configured": provider_id in PROVIDERS_CONFIG
        })
    return {"providers": providers}


@app.post("/ai-providers/configure")
def configure_provider(config: ProviderConfig, token: str):
    """Configure an AI provider with API key."""
    admin_id = get_session_admin(token)
    
    provider_id = config.provider_id
    if provider_id not in AVAILABLE_PROVIDERS:
        raise HTTPException(status_code=400, detail="Unknown provider")
    
    PROVIDERS_CONFIG[provider_id] = {
        "api_key": config.api_key,
        "model": config.model,
        "rate_limit": config.rate_limit,
        "configured_at": datetime.now(),
        "configured_by": admin_id
    }
    
    if provider_id not in USAGE_STATS:
        USAGE_STATS[provider_id] = {
            "provider": provider_id,
            "total_requests": 0,
            "total_tokens": 0,
            "last_used": None
        }
    
    log_audit("configure_provider", admin_id, {
        "provider": provider_id,
        "model": config.model
    })
    
    return {
        "status": "configured",
        "provider": provider_id,
        "model": config.model
    }


@app.get("/ai-providers/configured")
def get_configured_providers(token: str):
    """Get list of configured providers."""
    admin_id = get_session_admin(token)
    
    providers = []
    for provider_id, config in PROVIDERS_CONFIG.items():
        provider_info = AVAILABLE_PROVIDERS.get(provider_id, {})
        providers.append({
            "id": provider_id,
            "name": provider_info.get("name"),
            "model": config.get("model"),
            "rate_limit": config.get("rate_limit"),
            "configured_at": config.get("configured_at").isoformat() if config.get("configured_at") else None
        })
    
    return {"providers": providers, "count": len(providers)}


@app.delete("/ai-providers/{provider_id}")
def remove_provider(provider_id: str, token: str):
    """Remove a configured provider."""
    admin_id = get_session_admin(token)
    
    if provider_id not in PROVIDERS_CONFIG:
        raise HTTPException(status_code=404, detail="Provider not configured")
    
    del PROVIDERS_CONFIG[provider_id]
    log_audit("remove_provider", admin_id, {"provider": provider_id})
    
    return {"status": "removed", "provider": provider_id}


@app.post("/ai-providers/test/{provider_id}")
def test_provider(provider_id: str, token: str):
    """Test provider connectivity."""
    admin_id = get_session_admin(token)
    
    if provider_id not in PROVIDERS_CONFIG:
        raise HTTPException(status_code=404, detail="Provider not configured")
    
    # Simulate test
    log_audit("test_provider", admin_id, {"provider": provider_id})
    
    return {
        "status": "ok",
        "provider": provider_id,
        "response_time": 120,  # ms
        "message": f"Connected to {AVAILABLE_PROVIDERS[provider_id]['name']}"
    }


# ============================================================================
# Completion Routes
# ============================================================================

@app.post("/ai-providers/complete")
def complete_prompt(request: PromptRequest, token: str):
    """Generate completion using active provider."""
    admin_id = get_session_admin(token)
    
    # Find active provider
    if request.provider_id:
        if request.provider_id not in PROVIDERS_CONFIG:
            raise HTTPException(status_code=404, detail="Provider not configured")
        provider_id = request.provider_id
    else:
        # Use first configured provider
        if not PROVIDERS_CONFIG:
            raise HTTPException(status_code=400, detail="No provider configured")
        provider_id = list(PROVIDERS_CONFIG.keys())[0]
    
    provider_name = AVAILABLE_PROVIDERS[provider_id]["name"]
    
    # Simulate API call
    mock_response = f"Generated response from {provider_name} for: '{request.prompt[:50]}...'"
    tokens_used = len(request.prompt.split()) + 50
    
    # Update stats
    if provider_id not in USAGE_STATS:
        USAGE_STATS[provider_id] = {
            "provider": provider_id,
            "total_requests": 0,
            "total_tokens": 0,
            "last_used": None
        }
    
    USAGE_STATS[provider_id]["total_requests"] += 1
    USAGE_STATS[provider_id]["total_tokens"] += tokens_used
    USAGE_STATS[provider_id]["last_used"] = datetime.now()
    
    log_audit("completion_request", admin_id, {
        "provider": provider_id,
        "tokens": tokens_used
    })
    
    return PromptResponse(
        response=mock_response,
        tokens_used=tokens_used,
        provider=provider_name,
        timestamp=datetime.now()
    )


# ============================================================================
# Usage Statistics Routes
# ============================================================================

@app.get("/ai-providers/stats")
def get_usage_stats(token: str):
    """Get usage statistics for all providers."""
    admin_id = get_session_admin(token)
    
    stats = []
    for provider_id, stat in USAGE_STATS.items():
        stats.append({
            "provider": AVAILABLE_PROVIDERS[provider_id]["name"],
            "total_requests": stat["total_requests"],
            "total_tokens": stat["total_tokens"],
            "last_used": stat["last_used"].isoformat() if stat["last_used"] else None
        })
    
    return {
        "stats": stats,
        "timestamp": datetime.now().isoformat()
    }


# ============================================================================
# Audit Log Routes
# ============================================================================

@app.get("/admin/audit-logs")
def get_audit_logs(token: str, limit: int = 100):
    """Get admin audit logs."""
    admin_id = get_session_admin(token)
    
    # Return last N logs
    logs = []
    for log in AUDIT_LOGS[-limit:]:
        logs.append({
            "id": log.id,
            "action": log.action,
            "admin_id": log.admin_id,
            "timestamp": log.timestamp.isoformat(),
            "details": log.details
        })
    
    return {"logs": logs, "count": len(logs)}


@app.post("/admin/audit-logs/export")
def export_audit_logs(token: str):
    """Export audit logs as CSV."""
    admin_id = get_session_admin(token)
    
    csv_data = "id,action,admin_id,timestamp,details\n"
    for log in AUDIT_LOGS:
        details_str = json.dumps(log.details).replace('"', '""')
        csv_data += f'{log.id},"{log.action}","{log.admin_id}",{log.timestamp.isoformat()},"{details_str}"\n'
    
    log_audit("export_logs", admin_id)
    
    return {"csv": csv_data}


# ============================================================================
# Server Startup
# ============================================================================

if __name__ == "__main__":
    port = int(os.getenv("BACKEND_PORT", 17493))
    print(f"\n{'='*60}")
    print("🚀 Voicebox AI Integration Backend (Development)")
    print(f"{'='*60}")
    print(f"Server starting on http://localhost:{port}")
    print(f"Admin credentials: Admin / Mobile@123")
    print(f"{'='*60}\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
