#!/usr/bin/env python3
"""Autonomous Agentic AI System for Voicebox.

This module implements a multi-modal aggregator agent that can:
- Understand voice, text, files, images, and documents
- Control all app features autonomously
- Orchestrate multiple AI providers
- Process and manage user conversations
- Handle file uploads and document parsing
"""

import json
import os
from datetime import datetime
from typing import Optional, List, Dict, Any
import hashlib
import secrets

# ============================================================================
# Data Models for Agent
# ============================================================================

class AgentMessage:
    """Represents a message in the agent conversation."""
    
    def __init__(self, role: str, content: str, metadata: Dict[str, Any] = None):
        self.role = role  # 'user', 'agent', 'system'
        self.content = content
        self.metadata = metadata or {}
        self.timestamp = datetime.now().isoformat()
    
    def to_dict(self):
        return {
            'role': self.role,
            'content': self.content,
            'metadata': self.metadata,
            'timestamp': self.timestamp
        }


class AgentTool:
    """Definition of a tool the agent can use."""
    
    def __init__(self, name: str, description: str, parameters: Dict[str, Any]):
        self.name = name
        self.description = description
        self.parameters = parameters
    
    def to_dict(self):
        return {
            'name': self.name,
            'description': self.description,
            'parameters': self.parameters
        }


class User:
    """User model with zero-cost file-based storage."""
    
    def __init__(self, username: str, password_hash: str, email: str = "", is_admin: bool = False):
        self.id = secrets.token_urlsafe(16)
        self.username = username
        self.password_hash = password_hash
        self.email = email
        self.is_admin = is_admin
        self.created_at = datetime.now().isoformat()
        self.last_login = None
        self.settings = {}
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'password_hash': self.password_hash,
            'email': self.email,
            'is_admin': self.is_admin,
            'created_at': self.created_at,
            'last_login': self.last_login,
            'settings': self.settings
        }
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using SHA-256."""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def verify_password(self, password: str) -> bool:
        """Verify password against hash."""
        return self.password_hash == self.hash_password(password)


# ============================================================================
# Agent Tools Definition
# ============================================================================

AGENT_TOOLS = [
    AgentTool(
        name="select_ai_provider",
        description="Select or switch to a specific AI provider (Groq, Hugging Face, Together AI, etc)",
        parameters={
            "provider_id": "str - ID of the provider",
            "task_type": "str - Type of task (text_generation, voice_synthesis, image_understanding, etc)"
        }
    ),
    AgentTool(
        name="process_text",
        description="Process user text input and generate AI response",
        parameters={
            "text": "str - Text to process",
            "provider_id": "str - Which provider to use",
            "context": "str - Conversation context for better understanding"
        }
    ),
    AgentTool(
        name="process_voice",
        description="Convert speech to text (STT) or generate speech from text (TTS)",
        parameters={
            "audio_data": "bytes - Audio data or text to convert",
            "mode": "str - 'stt' for speech-to-text or 'tts' for text-to-speech",
            "provider_id": "str - Which provider to use"
        }
    ),
    AgentTool(
        name="process_file",
        description="Upload and process files (PDF, DOCX, images, audio)",
        parameters={
            "file_path": "str - Path to uploaded file",
            "file_type": "str - Type of file (pdf, docx, image, audio, etc)",
            "action": "str - What to do with file (parse, analyze, extract, etc)"
        }
    ),
    AgentTool(
        name="process_image",
        description="Understand and analyze images using vision models",
        parameters={
            "image_path": "str - Path to image file",
            "provider_id": "str - Provider with vision capabilities",
            "question": "str - What to ask about the image"
        }
    ),
    AgentTool(
        name="search_web",
        description="Search the web for information using Perplexity or similar",
        parameters={
            "query": "str - Search query",
            "include_citations": "bool - Whether to include sources"
        }
    ),
    AgentTool(
        name="manage_files",
        description="Manage user uploaded files (list, delete, share)",
        parameters={
            "action": "str - list, delete, share, download",
            "file_id": "str - File ID for specific actions"
        }
    ),
    AgentTool(
        name="manage_users",
        description="Manage users (create, update password, delete)",
        parameters={
            "action": "str - create, update_password, delete, list",
            "username": "str - Username",
            "password": "str - New password for update action"
        }
    ),
    AgentTool(
        name="get_conversation_history",
        description="Retrieve conversation history with context",
        parameters={
            "limit": "int - Number of messages to retrieve (default 10)",
            "include_metadata": "bool - Include metadata in response"
        }
    ),
    AgentTool(
        name="orchestrate_providers",
        description="Automatically select best provider based on task requirements",
        parameters={
            "task": "str - Task description",
            "required_capabilities": "list - Required capabilities (tts, stt, vision, etc)",
            "fallback_strategy": "str - Strategy if primary fails"
        }
    )
]


# ============================================================================
# File-Based Storage (Zero Cost)
# ============================================================================

class FileBasedStorage:
    """Zero-cost file-based storage for users, conversations, and data."""
    
    def __init__(self, data_dir: str = "./data"):
        self.data_dir = data_dir
        self.users_file = os.path.join(data_dir, "users.json")
        self.conversations_file = os.path.join(data_dir, "conversations.json")
        self.files_metadata_file = os.path.join(data_dir, "files_metadata.json")
        self.usage_stats_file = os.path.join(data_dir, "usage_stats.json")
        self.audit_logs_file = os.path.join(data_dir, "audit_logs.json")
        
        # Ensure directories exist
        os.makedirs(data_dir, exist_ok=True)
        os.makedirs(os.path.join(data_dir, "files"), exist_ok=True)
        os.makedirs(os.path.join(data_dir, "uploads"), exist_ok=True)
        
        # Initialize JSON files if they don't exist
        self._ensure_files()
    
    def _ensure_files(self):
        """Ensure all JSON storage files exist."""
        files = [
            self.users_file,
            self.conversations_file,
            self.files_metadata_file,
            self.usage_stats_file,
            self.audit_logs_file
        ]
        for file_path in files:
            if not os.path.exists(file_path):
                with open(file_path, 'w') as f:
                    json.dump({} if 'files_metadata' in file_path or 'usage_stats' in file_path 
                             else [], f)
    
    def save_user(self, user: User):
        """Save user data."""
        with open(self.users_file, 'r') as f:
            users = json.load(f)
        users[user.id] = user.to_dict()
        with open(self.users_file, 'w') as f:
            json.dump(users, f, indent=2)
    
    def get_user(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        with open(self.users_file, 'r') as f:
            users = json.load(f)
        if user_id in users:
            data = users[user_id]
            user = User(data['username'], data['password_hash'], data.get('email', ''))
            user.id = user_id
            user.is_admin = data.get('is_admin', False)
            return user
        return None
    
    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username."""
        with open(self.users_file, 'r') as f:
            users = json.load(f)
        for user_id, data in users.items():
            if data['username'] == username:
                user = User(data['username'], data['password_hash'], data.get('email', ''))
                user.id = user_id
                user.is_admin = data.get('is_admin', False)
                return user
        return None
    
    def save_conversation(self, user_id: str, messages: List[Dict]):
        """Save conversation messages."""
        with open(self.conversations_file, 'r') as f:
            conversations = json.load(f)
        if user_id not in conversations:
            conversations[user_id] = []
        conversations[user_id].extend(messages)
        with open(self.conversations_file, 'w') as f:
            json.dump(conversations, f, indent=2)
    
    def get_conversation(self, user_id: str, limit: int = 10) -> List[Dict]:
        """Get conversation history."""
        with open(self.conversations_file, 'r') as f:
            conversations = json.load(f)
        if user_id in conversations:
            return conversations[user_id][-limit:]
        return []
    
    def save_audit_log(self, action: str, user_id: str, details: Dict):
        """Save audit log entry."""
        with open(self.audit_logs_file, 'r') as f:
            logs = json.load(f)
        log_entry = {
            'id': secrets.token_urlsafe(8),
            'action': action,
            'user_id': user_id,
            'timestamp': datetime.now().isoformat(),
            'details': details
        }
        logs.append(log_entry)
        with open(self.audit_logs_file, 'w') as f:
            json.dump(logs, f, indent=2)
    
    def save_usage_stats(self, provider_id: str, tokens_used: int, user_id: str):
        """Save provider usage statistics."""
        with open(self.usage_stats_file, 'r') as f:
            stats = json.load(f)
        
        key = f"{user_id}:{provider_id}"
        if key not in stats:
            stats[key] = {
                'provider': provider_id,
                'user_id': user_id,
                'total_requests': 0,
                'total_tokens': 0,
                'last_used': None
            }
        
        stats[key]['total_requests'] += 1
        stats[key]['total_tokens'] += tokens_used
        stats[key]['last_used'] = datetime.now().isoformat()
        
        with open(self.usage_stats_file, 'w') as f:
            json.dump(stats, f, indent=2)
    
    def get_user_files(self, user_id: str) -> List[Dict]:
        """Get files uploaded by user."""
        with open(self.files_metadata_file, 'r') as f:
            files_metadata = json.load(f)
        
        user_files = []
        for file_id, metadata in files_metadata.items():
            if metadata.get('user_id') == user_id:
                user_files.append({**metadata, 'id': file_id})
        return user_files


# ============================================================================
# Provider Orchestration
# ============================================================================

class ProviderOrchestrator:
    """Intelligently select and orchestrate AI providers based on task type."""
    
    # Provider capabilities mapping
    PROVIDER_CAPABILITIES = {
        'groq': {
            'capabilities': ['text_generation', 'fast_inference'],
            'models': ['mixtral-8x7b', 'llama-3-8b', 'llama-3-70b'],
            'speed': 'very_fast',
            'free_tier': True,
            'rate_limit': 30  # req/min
        },
        'hugging_face': {
            'capabilities': ['text_generation', 'tts', 'stt', 'image_generation', 'vision'],
            'models': ['Bark-TTS', 'Stable-Audio', 'Llava', 'Whisper'],
            'speed': 'moderate',
            'free_tier': True,
            'rate_limit': 1000  # unlimited basically
        },
        'together_ai': {
            'capabilities': ['text_generation', 'tts', 'image_generation'],
            'models': ['Llama-2', 'Mistral', 'OpenVoice'],
            'speed': 'moderate',
            'free_tier': True,
            'rate_limit': 200
        },
        'replicate': {
            'capabilities': ['tts', 'image_generation', 'video_generation'],
            'models': ['Coqui-TTS', 'Vocos', 'Stable-Video'],
            'speed': 'moderate',
            'free_tier': True,
            'rate_limit': 50  # per month free
        },
        'deep_infra': {
            'capabilities': ['text_generation', 'image_generation'],
            'models': ['Llama', 'Mistral', 'Stable-Diffusion'],
            'speed': 'fast',
            'free_tier': True,
            'rate_limit': 200  # per day
        },
        'octoai': {
            'capabilities': ['text_generation', 'image_generation', 'video'],
            'models': ['Mixtral', 'Stable-Video', 'Llava'],
            'speed': 'very_fast',
            'free_tier': True,  # $10 free credits
            'rate_limit': 1000
        },
        'anthropic': {
            'capabilities': ['text_generation', 'vision', 'long_context'],
            'models': ['Claude-3-Opus', 'Claude-3-Sonnet'],
            'speed': 'fast',
            'free_tier': True,  # $5 test credits
            'rate_limit': 500
        },
        'openrouter': {
            'capabilities': ['text_generation', 'vision', 'multimodal'],
            'models': ['100+ aggregated models'],
            'speed': 'moderate',
            'free_tier': True,
            'rate_limit': 100
        },
        'cohere': {
            'capabilities': ['text_generation', 'embeddings', 'search'],
            'models': ['Command-R', 'Command-Nightly'],
            'speed': 'fast',
            'free_tier': True,
            'rate_limit': 100  # req/min
        },
        'perplexity': {
            'capabilities': ['web_search', 'text_generation', 'citations'],
            'models': ['Sonar-Small', 'Sonar-Medium'],
            'speed': 'moderate',
            'free_tier': True,
            'rate_limit': 50
        }
    }
    
    @staticmethod
    def orchestrate(task: str, required_capabilities: List[str], 
                   fallback_strategy: str = 'best_match') -> Dict[str, str]:
        """Select best provider(s) for the task."""
        
        # Analyze task and required capabilities
        suitable_providers = []
        
        for provider_id, info in ProviderOrchestrator.PROVIDER_CAPABILITIES.items():
            provider_capabilities = set(info['capabilities'])
            required = set(required_capabilities)
            
            if required.issubset(provider_capabilities):
                suitable_providers.append({
                    'provider_id': provider_id,
                    'score': len(required) / len(provider_capabilities),
                    'speed': info['speed'],
                    'models': info['models']
                })
        
        if not suitable_providers:
            # Fallback: find provider with most capabilities
            suitable_providers = [
                {
                    'provider_id': p_id,
                    'score': len(set(required_capabilities) & set(info['capabilities'])) / len(required_capabilities) if required_capabilities else 0.5,
                    'speed': info['speed'],
                    'models': info['models']
                }
                for p_id, info in ProviderOrchestrator.PROVIDER_CAPABILITIES.items()
            ]
        
        # Sort by score and speed
        suitable_providers.sort(key=lambda x: (-x['score'], x['speed']))
        
        return {
            'primary': suitable_providers[0]['provider_id'] if suitable_providers else 'groq',
            'alternatives': [p['provider_id'] for p in suitable_providers[1:3]],
            'reason': f"Selected for capabilities: {', '.join(required_capabilities)}"
        }


# ============================================================================
# Main Agent Class
# ============================================================================

class VoiceboxAgent:
    """Main autonomous agentic AI system."""
    
    def __init__(self):
        self.storage = FileBasedStorage()
        self.conversation_history = []
        self.current_user_id = None
        self.active_provider = None
        self.tools = {tool.name: tool for tool in AGENT_TOOLS}
    
    def process_input(self, user_id: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process multimodal input (text, voice, files, images)."""
        
        input_type = input_data.get('type', 'text')  # text, voice, file, image
        content = input_data.get('content', '')
        
        # Log the input
        self.storage.save_audit_log(
            action=f"input_{input_type}",
            user_id=user_id,
            details={'input_length': len(content)}
        )
        
        # Create agent message
        message = AgentMessage('user', content, {'type': input_type})
        self.conversation_history.append(message.to_dict())
        
        # Analyze and route to appropriate handler
        if input_type == 'text':
            return self._handle_text_input(user_id, content)
        elif input_type == 'voice':
            return self._handle_voice_input(user_id, content)
        elif input_type == 'file':
            return self._handle_file_input(user_id, content)
        elif input_type == 'image':
            return self._handle_image_input(user_id, content)
        else:
            return {'error': f'Unknown input type: {input_type}'}
    
    def _handle_text_input(self, user_id: str, text: str) -> Dict[str, Any]:
        """Handle text input - orchestrate appropriate provider."""
        
        # Determine best provider for this task
        orchestration = ProviderOrchestrator.orchestrate(
            task=text,
            required_capabilities=['text_generation'],
            fallback_strategy='best_match'
        )
        
        return {
            'status': 'processed',
            'type': 'text',
            'provider_selected': orchestration['primary'],
            'alternatives': orchestration['alternatives'],
            'next_step': 'send_to_provider'
        }
    
    def _handle_voice_input(self, user_id: str, audio_data: str) -> Dict[str, Any]:
        """Handle voice input - convert to text, then process."""
        
        orchestration = ProviderOrchestrator.orchestrate(
            task='speech_to_text',
            required_capabilities=['stt'],
            fallback_strategy='best_match'
        )
        
        return {
            'status': 'processed',
            'type': 'voice',
            'provider_selected': orchestration['primary'],
            'action': 'convert_stt',
            'next_step': 'send_to_provider'
        }
    
    def _handle_file_input(self, user_id: str, file_path: str) -> Dict[str, Any]:
        """Handle file upload and processing."""
        
        # Determine file type and required capabilities
        orchestration = ProviderOrchestrator.orchestrate(
            task='file_processing',
            required_capabilities=['text_generation', 'vision'],
            fallback_strategy='best_match'
        )
        
        return {
            'status': 'processed',
            'type': 'file',
            'provider_selected': orchestration['primary'],
            'action': 'parse_and_analyze',
            'next_step': 'send_to_provider'
        }
    
    def _handle_image_input(self, user_id: str, image_path: str) -> Dict[str, Any]:
        """Handle image input - use vision models."""
        
        orchestration = ProviderOrchestrator.orchestrate(
            task='image_understanding',
            required_capabilities=['vision'],
            fallback_strategy='best_match'
        )
        
        return {
            'status': 'processed',
            'type': 'image',
            'provider_selected': orchestration['primary'],
            'action': 'analyze_image',
            'next_step': 'send_to_provider'
        }
    
    def get_tools(self) -> List[Dict[str, Any]]:
        """Get list of available tools for the agent."""
        return [tool.to_dict() for tool in AGENT_TOOLS]
    
    def execute_tool(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a tool based on agent request."""
        
        if tool_name == 'select_ai_provider':
            self.active_provider = parameters.get('provider_id')
            return {'status': 'success', 'provider': self.active_provider}
        
        elif tool_name == 'get_conversation_history':
            history = self.storage.get_conversation(self.current_user_id)
            return {'status': 'success', 'messages': history}
        
        elif tool_name == 'orchestrate_providers':
            result = ProviderOrchestrator.orchestrate(
                task=parameters.get('task', ''),
                required_capabilities=parameters.get('required_capabilities', []),
                fallback_strategy=parameters.get('fallback_strategy', 'best_match')
            )
            return {'status': 'success', **result}
        
        elif tool_name == 'manage_users':
            action = parameters.get('action')
            username = parameters.get('username')
            password = parameters.get('password')
            
            if action == 'create':
                user = User(username, User.hash_password(password))
                self.storage.save_user(user)
                return {'status': 'success', 'user_id': user.id}
            
            elif action == 'update_password':
                user = self.storage.get_user_by_username(username)
                if user:
                    user.password_hash = User.hash_password(password)
                    self.storage.save_user(user)
                    return {'status': 'success', 'message': 'Password updated'}
                return {'status': 'error', 'message': 'User not found'}
            
            return {'status': 'error', 'message': f'Unknown action: {action}'}
        
        else:
            return {'status': 'error', 'message': f'Tool not implemented: {tool_name}'}


# Export for use in FastAPI backend
if __name__ == '__main__':
    agent = VoiceboxAgent()
    print("Agent initialized successfully")
    print(f"Available tools: {len(agent.get_tools())}")
