#!/usr/bin/env python3
"""Lightweight development backend for Voicebox AI API Integration.

This server provides the necessary API endpoints without heavy ML dependencies.
Used for development and testing of the AI Provider integration UI.
Includes autonomous agentic AI system with multimodal support.
"""

import uvicorn
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import json
import os
import sys
import hashlib
import secrets

# Add backend_agent to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from backend_agent import VoiceboxAgent, User, FileBasedStorage
    AGENT_AVAILABLE = True
except ImportError:
    AGENT_AVAILABLE = False
    print("Warning: Agent module not available, using basic functionality")

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


# Agent Models
class AgentInputRequest(BaseModel):
    type: str  # 'text', 'voice', 'file', 'image'
    content: str
    metadata: Optional[Dict[str, Any]] = None


class AgentResponse(BaseModel):
    status: str
    type: str
    message: str
    provider_selected: Optional[str] = None
    next_step: Optional[str] = None


class UserCreateRequest(BaseModel):
    username: str
    password: str
    email: Optional[str] = None
    is_admin: bool = False


class UserLoginRequest(BaseModel):
    username: str
    password: str


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str


class UserResponse(BaseModel):
    id: str
    username: str
    email: Optional[str]
    is_admin: bool
    created_at: str
    last_login: Optional[str]


# ============================================================================
# FastAPI Setup
# ============================================================================

app = FastAPI(
    title="Voicebox AI Agent Platform",
    description="Autonomous multimodal AI agent with voice, file, and document support",
    version="1.0.0"
)

# CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# Initialize agent and file storage
agent = VoiceboxAgent() if AGENT_AVAILABLE else None
file_storage = FileBasedStorage() if AGENT_AVAILABLE else None

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
# Agent Routes
# ============================================================================

@app.post("/agent/input", response_model=dict)
async def process_agent_input(user_id: str, request: AgentInputRequest):
    """Process multimodal input through the agent."""
    if not AGENT_AVAILABLE or not agent:
        return {
            "status": "error",
            "type": request.type,
            "message": "Agent not available"
        }
    
    input_data = {
        'type': request.type,
        'content': request.content,
        **(request.metadata or {})
    }
    
    result = agent.process_input(user_id, input_data)
    
    return {
        "status": result.get('status', 'processed'),
        "type": result.get('type', request.type),
        "message": f"Processed {request.type} input",
        "provider_selected": result.get('provider_selected'),
        "next_step": result.get('next_step')
    }


@app.get("/agent/tools")
async def get_agent_tools():
    """Get list of available tools for the agent."""
    if not AGENT_AVAILABLE or not agent:
        return {"tools": []}
    
    return {"tools": agent.get_tools()}


@app.post("/agent/orchestrate")
async def orchestrate_providers(task: str, required_capabilities: List[str]):
    """Use provider orchestration to select best provider."""
    if not AGENT_AVAILABLE or not agent:
        return {"status": "error", "message": "Agent not available"}
    
    result = agent.execute_tool('orchestrate_providers', {
        'task': task,
        'required_capabilities': required_capabilities,
        'fallback_strategy': 'best_match'
    })
    
    return result


# ============================================================================
# User Management Routes
# ============================================================================

@app.post("/users/create")
async def create_user(request: UserCreateRequest):
    """Create a new user."""
    if not AGENT_AVAILABLE or not file_storage:
        raise HTTPException(status_code=500, detail="Storage not available")
    
    # Check if user exists
    existing = file_storage.get_user_by_username(request.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Create user
    user = User(
        username=request.username,
        password_hash=User.hash_password(request.password),
        email=request.email or "",
        is_admin=request.is_admin
    )
    
    file_storage.save_user(user)
    file_storage.save_audit_log("user_created", "system", {"username": request.username})
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin,
        "created_at": user.created_at,
        "last_login": user.last_login
    }


@app.post("/users/login")
async def login_user(request: UserLoginRequest):
    """Login user and return session token."""
    if not AGENT_AVAILABLE or not file_storage:
        raise HTTPException(status_code=500, detail="Storage not available")
    
    user = file_storage.get_user_by_username(request.username)
    if not user or not user.verify_password(request.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create session
    token = secrets.token_urlsafe(32)
    ACTIVE_SESSIONS[token] = {
        'user_id': user.id,
        'username': user.username,
        'created_at': datetime.now(),
        'expires_at': datetime.now() + timedelta(hours=24)
    }
    
    file_storage.save_audit_log("user_login", user.id, {"username": user.username})
    
    return {
        "status": "success",
        "token": token,
        "user_id": user.id,
        "username": user.username,
        "is_admin": user.is_admin
    }


@app.post("/users/change-password")
async def change_password(user_id: str, request: PasswordChangeRequest):
    """Change user password."""
    if not AGENT_AVAILABLE or not file_storage:
        raise HTTPException(status_code=500, detail="Storage not available")
    
    if request.new_password != request.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    if len(request.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    
    user = file_storage.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.verify_password(request.current_password):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    
    # Update password
    user.password_hash = User.hash_password(request.new_password)
    file_storage.save_user(user)
    file_storage.save_audit_log("password_changed", user_id, {"username": user.username})
    
    return {"status": "success", "message": "Password changed successfully"}


@app.get("/users/list")
async def list_users(admin_token: str):
    """List all users (admin only)."""
    if admin_token not in ACTIVE_SESSIONS:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    session = ACTIVE_SESSIONS[admin_token]
    user = file_storage.get_user(session['user_id']) if AGENT_AVAILABLE else None
    
    if not user or not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if not AGENT_AVAILABLE or not file_storage:
        return {"users": []}
    
    # Read users from storage
    with open(file_storage.users_file, 'r') as f:
        users_data = json.load(f)
    
    users = []
    for user_id, data in users_data.items():
        users.append({
            "id": user_id,
            "username": data['username'],
            "email": data.get('email'),
            "is_admin": data.get('is_admin', False),
            "created_at": data['created_at'],
            "last_login": data.get('last_login')
        })
    
    return {"users": users}


# ============================================================================
# File Management Routes
# ============================================================================

@app.post("/files/upload")
async def upload_file(user_id: str, file: UploadFile = File(...)):
    """Upload a file."""
    if not AGENT_AVAILABLE or not file_storage:
        raise HTTPException(status_code=500, detail="Storage not available")
    
    # Save file
    upload_dir = os.path.join(file_storage.data_dir, "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    
    file_id = secrets.token_urlsafe(16)
    file_path = os.path.join(upload_dir, f"{file_id}_{file.filename}")
    
    contents = await file.read()
    with open(file_path, 'wb') as f:
        f.write(contents)
    
    file_storage.save_audit_log("file_uploaded", user_id, {
        "file_name": file.filename,
        "file_size": len(contents),
        "file_type": file.content_type
    })
    
    return {
        "status": "success",
        "file_id": file_id,
        "file_name": file.filename,
        "file_size": len(contents),
        "file_type": file.content_type
    }


@app.get("/files/list")
async def list_user_files(user_id: str):
    """List user's uploaded files."""
    if not AGENT_AVAILABLE or not file_storage:
        return {"files": []}
    
    return {"files": file_storage.get_user_files(user_id)}


# ============================================================================
# Server Startup
# ============================================================================

if __name__ == "__main__":
    port = int(os.getenv("BACKEND_PORT", 17493))
    print(f"\n{'='*60}")
    print("🚀 Voicebox AI Agent Platform (Development)")
    print(f"{'='*60}")
    print(f"Server starting on http://localhost:{port}")
    print(f"Admin credentials: Admin / Mobile@123")
    print(f"Agent available: {AGENT_AVAILABLE}")
    print(f"{'='*60}\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
