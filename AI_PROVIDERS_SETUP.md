# AI Providers Setup Guide - Complete Configuration

This guide provides step-by-step setup instructions for all 10 free AI providers integrated into Voicebox.

---

## Quick Setup Summary

| Provider | Setup Link | API Key | Time | Status |
|----------|-----------|---------|------|--------|
| Groq | console.groq.com | ✅ Free | 2 min | ✅ |
| Hugging Face | huggingface.co | ✅ Free | 2 min | ✅ |
| Together AI | together.ai | ✅ Free | 3 min | ✅ |
| Replicate | replicate.com | ✅ Free | 2 min | ✅ |
| Deep Infra | deepinfra.com | ✅ Free | 2 min | ✅ |
| OctoAI | octoai.cloud | ✅ Free | 3 min | ✅ |
| Anthropic | console.anthropic.com | ✅ Free | 3 min | ✅ |
| OpenRouter | openrouter.ai | ✅ Free | 2 min | ✅ |
| Cohere | cohere.com | ✅ Free | 2 min | ✅ |
| Perplexity | pplx.ai | ✅ Free | 2 min | ✅ |

---

## 1. Groq - Ultra-Fast LLM Inference

**URL:** https://console.groq.com

### Features
- **Speed:** Ultra-fast (45-100 tokens/sec)
- **Models:** Mixtral-8x7b, Llama-3-8b, Llama-3-70b
- **Rate Limit:** 30 requests/minute
- **Cost:** Free tier available

### Setup Steps

1. Go to console.groq.com
2. Click "Sign Up" or "Sign In"
3. Create account (email + password, no credit card required)
4. Navigate to API Keys section
5. Click "Create API Key"
6. Copy your API key

### Environment Variable
```bash
GROQ_API_KEY=gsk_your_key_here
```

### Code Example
```typescript
const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_GROQ_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'mixtral-8x7b-32768',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});
```

---

## 2. Hugging Face - Open Source Hub

**URL:** https://huggingface.co

### Features
- **Models:** 1000+ including Bark TTS, Whisper STT, Llava Vision
- **Rate Limit:** Unlimited (free tier)
- **Cost:** Free tier available
- **Multimodal:** Text, Voice, Vision, Images

### Setup Steps

1. Go to huggingface.co
2. Click "Sign up"
3. Create account with email (no credit card)
4. Go to Settings > Access Tokens
5. Click "New token"
6. Create read/write token
7. Copy token

### Environment Variable
```bash
HUGGINGFACE_API_KEY=hf_your_token_here
```

### Models Available
- **TTS:** facebook/bark, coqui/XTTS-v2
- **STT:** openai/whisper-large-v3
- **Vision:** llava-hf/llava-1.5-7b-hf
- **Text:** mistralai/Mistral-7B-Instruct-v0.1

---

## 3. Together AI - Distributed Model Platform

**URL:** https://www.together.ai

### Features
- **Models:** Llama-2, Mistral, OpenVoice (TTS)
- **Rate Limit:** 200 requests/minute
- **Cost:** Free tier available
- **Specialty:** Voice synthesis

### Setup Steps

1. Go to together.ai
2. Click "Get Started"
3. Sign up with email (no credit card)
4. Accept terms
5. Go to Settings > API Keys
6. Copy your API key

### Environment Variable
```bash
TOGETHER_API_KEY=your_key_here
```

### Code Example
```typescript
const response = await fetch('https://api.together.xyz/inference', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer YOUR_TOGETHER_KEY`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'mistralai/Mistral-7B-Instruct-v0.1',
    prompt: 'Hello!'
  })
});
```

---

## 4. Replicate - ML Model API

**URL:** https://replicate.com

### Features
- **Models:** Coqui TTS, Vocos, Stable Video, XTTS v2
- **Rate Limit:** 50 predictions/month free
- **Cost:** Free tier + pay-per-prediction
- **Specialty:** Media generation (voice, video, images)

### Setup Steps

1. Go to replicate.com
2. Click "Sign up"
3. Create account with GitHub or email (no credit card)
4. Go to API Tokens
5. Click "Create token"
6. Copy your token

### Environment Variable
```bash
REPLICATE_API_TOKEN=your_token_here
```

### Code Example
```typescript
const prediction = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': `Token YOUR_REPLICATE_TOKEN`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    version: 'MODEL_VERSION_ID',
    input: { text: 'Hello world' }
  })
});
```

---

## 5. Deep Infra - Community API

**URL:** https://deepinfra.com

### Features
- **Models:** Llama-2, Mistral, Stable Diffusion XL
- **Rate Limit:** 200 requests/day (auto-resets)
- **Cost:** Free tier available
- **Features:** Text, Images, Embeddings

### Setup Steps

1. Go to deepinfra.com
2. Click "Sign In"
3. Create account (email, no credit card)
4. Go to Admin > API Key
5. Copy your API token

### Environment Variable
```bash
DEEPINFRA_API_KEY=your_token_here
```

### Code Example
```typescript
const response = await fetch('https://api.deepinfra.com/v1/inference/mistralai/Mistral-7B', {
  method: 'POST',
  headers: {
    'Authorization': `bearer YOUR_DEEPINFRA_KEY`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input: 'What is AI?'
  })
});
```

---

## 6. OctoAI - Production Inference

**URL:** https://octoai.cloud

### Features
- **Models:** Mixtral, Llava Vision, Stable Video
- **Rate Limit:** Unlimited (with $10 monthly credits)
- **Cost:** $10 free monthly credits
- **Specialty:** Production-grade APIs

### Setup Steps

1. Go to octoai.cloud
2. Click "Start Building"
3. Create account (no credit card)
4. Get $10 monthly free credits automatically
5. Go to Settings > API Tokens
6. Copy your API token

### Environment Variable
```bash
OCTOAI_TOKEN=your_token_here
```

---

## 7. Anthropic Claude - Advanced AI

**URL:** https://console.anthropic.com

### Features
- **Models:** Claude-3-Opus, Claude-3-Sonnet, Claude-3-Haiku
- **Context:** Up to 200K tokens
- **Cost:** $5 test credits (free)
- **Specialty:** Advanced reasoning

### Setup Steps

1. Go to console.anthropic.com
2. Click "Get Access"
3. Create account (no credit card initially)
4. Verify email
5. Go to API Keys
6. Create key (you'll get $5 test credits)
7. Copy your API key

### Environment Variable
```bash
ANTHROPIC_API_KEY=sk_ant_your_key_here
```

### Code Example
```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': 'YOUR_ANTHROPIC_KEY',
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'Hello Claude!' }]
  })
});
```

---

## 8. OpenRouter - Model Aggregator

**URL:** https://openrouter.ai

### Features
- **Models:** 100+ aggregated models
- **Includes:** OpenAI, Anthropic, Open-source
- **Rate Limit:** Free tier with usage
- **Cost:** Free tier available
- **Specialty:** Model comparison and flexibility

### Setup Steps

1. Go to openrouter.ai
2. Click "Sign In"
3. Create account (no credit card)
4. Go to Settings > Keys
5. Create API key
6. Copy your key

### Environment Variable
```bash
OPENROUTER_API_KEY=your_key_here
```

### Code Example
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer YOUR_OPENROUTER_KEY`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});
```

---

## 9. Cohere - Enterprise LLM

**URL:** https://cohere.com

### Features
- **Models:** Command R+, Command R, Embeddings
- **Rate Limit:** 100 requests/minute
- **Cost:** Free tier available
- **Specialty:** Enterprise features, embeddings

### Setup Steps

1. Go to cohere.com
2. Click "Get Started"
3. Create account (no credit card)
4. Go to API Keys
5. Click "Create API Key"
6. Copy your key

### Environment Variable
```bash
COHERE_API_KEY=your_key_here
```

### Code Example
```typescript
const response = await fetch('https://api.cohere.ai/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_COHERE_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'Hello!'
  })
});
```

---

## 10. Perplexity - Web Search + LLM

**URL:** https://pplx.ai

### Features
- **Models:** Sonar Small, Sonar Medium, Sonar Large
- **Specialty:** Web-aware responses with citations
- **Rate Limit:** Free research access
- **Cost:** Free tier available

### Setup Steps

1. Go to pplx.ai
2. Click "Research"
3. Sign up or continue with GitHub
4. Create account (no credit card)
5. Navigate to API section
6. Create API key
7. Copy your key

### Environment Variable
```bash
PERPLEXITY_API_KEY=your_key_here
```

---

## Environment Variables Setup

### Option 1: Create `.env.local` file

```bash
# .env.local (in project root)
GROQ_API_KEY=gsk_your_key_here
HUGGINGFACE_API_KEY=hf_your_token_here
TOGETHER_API_KEY=your_key_here
REPLICATE_API_TOKEN=your_token_here
DEEPINFRA_API_KEY=your_token_here
OCTOAI_TOKEN=your_token_here
ANTHROPIC_API_KEY=sk_ant_your_key_here
OPENROUTER_API_KEY=your_key_here
COHERE_API_KEY=your_key_here
PERPLEXITY_API_KEY=your_key_here
```

### Option 2: Set in Shell

```bash
export GROQ_API_KEY=gsk_your_key_here
export HUGGINGFACE_API_KEY=hf_your_token_here
# ... etc
```

### Option 3: Load Environment Variables in Code

```typescript
// In your component or service
const providers = {
  groq: process.env.GROQ_API_KEY,
  huggingface: process.env.HUGGINGFACE_API_KEY,
  together: process.env.TOGETHER_API_KEY,
  replicate: process.env.REPLICATE_API_TOKEN,
  deepinfra: process.env.DEEPINFRA_API_KEY,
  octoai: process.env.OCTOAI_TOKEN,
  anthropic: process.env.ANTHROPIC_API_KEY,
  openrouter: process.env.OPENROUTER_API_KEY,
  cohere: process.env.COHERE_API_KEY,
  perplexity: process.env.PERPLEXITY_API_KEY
};
```

---

## Testing Your Setup

### Test Individual Providers

```bash
# Test Groq
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"mixtral-8x7b-32768","messages":[{"role":"user","content":"Hello"}]}'

# Test Hugging Face
curl -X POST https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1 \
  -H "Authorization: Bearer YOUR_HUGGINGFACE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"inputs":"Hello"}'
```

### Test in Voicebox

1. Go to `/agent` route
2. Type a message
3. Observe the agent selecting optimal provider
4. Check the browser console for orchestration details

---

## Troubleshooting

### API Key Not Working
- Verify key is copied correctly (no extra spaces)
- Check that environment variables are loaded
- Ensure .env.local is in the project root

### Rate Limit Exceeded
- Groq: 30 req/min - wait before retrying
- Deep Infra: 200 req/day - resets daily
- Others: Usually have generous free limits

### Provider Not Responding
1. Check internet connection
2. Verify API endpoint URL
3. Check provider status page
4. Try fallback provider

### No API Key Required
- These providers work without API keys:
  - Browser Web Speech API (STT)
  - Browser Speech Synthesis (TTS)
  - Local audio processing

---

## Provider Selection Strategy

The agent uses this priority order:

1. **Speed Priority:** Groq > OctoAI > Deep Infra
2. **Quality Priority:** Claude > Mixtral > Llama
3. **Cost Priority:** Free > Trial > Paid
4. **Fallback:** Browser APIs (always available)

---

## Cost Analysis

| Provider | Monthly Free | Cost if Exceeded |
|----------|-------------|-----------------|
| Groq | Unlimited | N/A |
| Hugging Face | Unlimited | N/A |
| Together | Unlimited | $0.01/1K tokens |
| Replicate | 50/month | $0.001 per prediction |
| Deep Infra | 200/day | $0.001-0.05 |
| OctoAI | $10/month | $0.002-0.05 |
| Anthropic | $5 test | $0.003-0.075 |
| OpenRouter | Free tier | Variable |
| Cohere | Unlimited | $0.000375/token |
| Perplexity | Free | $0.0075-0.075 |

**Average Monthly Cost for Agent:** $0 (all free tiers sufficient)

---

## Next Steps

1. ✅ Get all 10 API keys (30 minutes)
2. ✅ Add to `.env.local`
3. ✅ Restart dev server: `bun run dev`
4. ✅ Visit `/agent` route
5. ✅ Start using the agent

All 10 providers are now integrated and ready to use!
