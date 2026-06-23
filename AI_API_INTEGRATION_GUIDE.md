# Voicebox AI API Integration Panel - Complete Guide

## Overview

The Voicebox application now includes a powerful AI API Integration system with a hidden admin control panel. This enables seamless integration with 10+ free AI providers without requiring credit cards or minimum credits.

## Features

### 1. Hidden Admin Authentication System
- **Access:** Press `Ctrl+Shift+A` to open the login modal
- **Default Credentials:**
  - Admin ID: `Admin`
  - Password: `Mobile@123`
- **Session Management:** 15-minute timeout with auto-refresh capability
- **Security:** Session tokens stored securely in localStorage

### 2. Admin Control Panel (5 Tabs)

#### Tab 1: Providers Management
- Add/remove AI providers from 10+ free services
- Activate/deactivate providers with one click
- View active provider count and configuration status
- Supported providers:
  - Groq (Mixtral, Llama 3)
  - Deep Infra (LLaMA 2)
  - Hugging Face (Multiple models)
  - Together AI (Mixed models)
  - Replicate (Various models)
  - Anthropic (Claude models)
  - OpenRouter (Multi-provider)
  - Mistral AI
  - LLaMA Cloud
  - Cohere

#### Tab 2: API Configuration
- Configure API keys for each provider
- Select default model for each provider
- Adjust rate limiting (100-5000 requests/min)
- Show/hide API keys for security
- Copy-to-clipboard functionality
- Built-in guide for getting free API keys

#### Tab 3: Usage Statistics
- Real-time request tracking per provider
- Token usage monitoring
- Request distribution charts
- Provider performance metrics
- Daily activity summaries
- Last used timestamps

#### Tab 4: Audit Logs
- Complete activity history
- Timestamp-based logging
- Action tracking (API calls, provider changes)
- Export logs as CSV
- Search and filter capabilities
- Up to 100 most recent logs stored

#### Tab 5: Admin Settings
- Session refresh controls
- Auto-refresh toggle
- Admin notifications configuration
- Security information dashboard
- System status monitoring
- Important security warnings

### 3. AI Playground
- **Location:** Main navigation sidebar (Lightning bolt icon)
- **URL:** `/playground`
- **Features:**
  - Real-time prompt testing
  - Model selection dropdown
  - Usage statistics display
  - Provider status indicator
  - Response streaming
  - Keyboard shortcuts (Ctrl+Enter to send)

### 4. AI Provider Framework

#### Frontend Components
- `AdminLoginModal`: Hidden login interface
- `AdminPanel`: Main control panel container
- `ProviderManagement`: Add/remove/manage providers
- `ProviderConfig`: API key and model configuration
- `UsageStats`: Real-time metrics dashboard
- `AuditLogs`: Activity history
- `SettingsPanel`: Admin preferences
- `AIPlayground`: Test interface for providers

#### Frontend Stores (Zustand)
- `adminStore`: Session management and authentication
- `aiProviderStore`: Provider configuration and state

#### Backend API Routes
- `/admin/login` - Authenticate admin user
- `/admin/logout` - End admin session
- `/admin/validate-session` - Check session validity
- `/admin/refresh-session` - Extend session timeout
- `/admin/status` - Get admin system status
- `/ai-providers/create` - Add new provider
- `/ai-providers/list` - Get all providers
- `/ai-providers/{id}` - Get specific provider
- `/ai-providers/{id}` - Update provider config
- `/ai-providers/{id}` - Delete provider
- `/ai-providers/{id}/activate` - Enable provider
- `/ai-providers/{id}/deactivate` - Disable provider
- `/ai-providers/{id}/test` - Test connectivity
- `/ai-providers/{id}/completion` - Call LLM API
- `/ai-providers/{id}/usage` - Update usage stats

## Getting Started

### Step 1: Access Admin Panel
1. Open the Voicebox application
2. Press `Ctrl+Shift+A` on your keyboard
3. Enter credentials:
   - Admin ID: `Admin`
   - Password: `Mobile@123`
4. Click "Login"

### Step 2: Add AI Provider
1. Click the "Providers" tab
2. Click "Add AI Provider" button
3. Select a provider from the grid
4. The provider appears in the active configuration

### Step 3: Configure API Key
1. Go to "Configuration" tab
2. Find your provider
3. Enter your API key in the field
4. Select your preferred model from the dropdown
5. Adjust rate limiting if needed

### Step 4: Test Provider
1. Go to "/playground" or click "AI Playground" in sidebar
2. Your active provider should be shown
3. Enter a prompt in the text area
4. Click "Send Prompt" or press Ctrl+Enter
5. View the response from the AI provider

## Free API Key Sources

### Groq
- Visit: https://console.groq.com
- Free tier: 30 requests/minute
- Models: Mixtral-8x7b, Llama-3-70b, Gemma-7b-it

### Deep Infra
- Visit: https://deepinfra.com
- $0 starter credit
- Models: Meta-Llama-2 family

### Hugging Face
- Visit: https://huggingface.co
- Free inference API
- 1000+ model options

### Together AI
- Visit: https://together.ai
- Free tier available
- Multiple open-source models

### Replicate
- Visit: https://replicate.com
- Free credits on signup
- $0.000075 per second after credits

### Anthropic
- Visit: https://console.anthropic.com
- Free trial available
- Claude models (Opus, Sonnet, Haiku)

### OpenRouter
- Visit: https://openrouter.ai
- Free tier with limits
- Access to 100+ models

### Other Providers
- Mistral AI: https://mistral.ai
- LLaMA Cloud: https://llamacloud.io
- Cohere: https://cohere.com

## Architecture

### Frontend Stack
- React 18.3 with TypeScript
- Zustand for state management
- Tailwind CSS for styling
- TanStack Router for navigation
- Lucide React for icons

### Backend Stack
- FastAPI (Python)
- Pydantic for validation
- In-memory storage (production: use database)
- CORS enabled for web access

### Session Management
- 15-minute timeout
- Auto-refresh on activity
- Secure token generation
- LocalStorage persistence

## Security Considerations

### Current Implementation
- Hardcoded credentials for demo (use environment variables in production)
- In-memory session storage (use Redis in production)
- API keys visible in configuration (implement encryption)
- No rate limiting enforcement (implement in production)

### Production Recommendations
1. Move credentials to environment variables
2. Use database for provider storage
3. Encrypt API keys at rest
4. Implement actual rate limiting
5. Add audit log persistence
6. Implement IP whitelisting
7. Use HTTPS only
8. Add request signing/authentication
9. Implement role-based access control
10. Regular security audits

## Troubleshooting

### Admin Panel Won't Open
- Ensure you pressed Ctrl+Shift+A (not Cmd+Shift+A on Mac)
- Check browser console for errors
- Try refreshing the page

### API Key Not Saving
- Verify the key is being entered correctly
- Check network tab in browser DevTools
- Ensure backend is running on correct port

### Provider Not Testing
- Verify API key is entered
- Check provider is activated (toggle the power button)
- Review audit logs for error messages
- Test provider connectivity in backend directly

### AI Playground Not Responding
- Ensure provider is activated
- Check API key is configured
- Look for error messages in the response area
- Monitor network requests in DevTools

## Performance Metrics

The AI Playground includes usage tracking:
- Requests per provider per day
- Total tokens used
- Response times
- Error rates
- Model performance comparison

## Future Enhancements

1. **Database Integration**: Persist providers and settings
2. **Encryption**: Secure API key storage
3. **Rate Limiting**: Enforce request limits
4. **Load Balancing**: Distribute across multiple providers
5. **Caching**: Cache responses for common prompts
6. **Analytics**: Advanced usage analytics
7. **Provider Health**: Automatic provider status monitoring
8. **Fallback Chain**: Failover to alternate providers
9. **Cost Tracking**: Monitor API costs
10. **Advanced Logging**: Detailed request/response logging

## Support & Resources

- GitHub: https://github.com/motherskitchenblr2/Black-Gold_Voicebox
- Issues: Report via GitHub Issues
- Documentation: Check CHANGELOG.md for updates
- Community: Discuss in GitHub Discussions

---

**Version**: 0.5.0  
**Last Updated**: June 2026  
**Status**: Fully Functional
