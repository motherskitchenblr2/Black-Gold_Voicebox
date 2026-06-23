# Voicebox AI Providers - Complete Guide

## 10 Free AI Providers (No Credit Card Required)

This guide covers 10 professional-grade AI API providers that offer free tiers with NO credit card requirements and NO minimum credits recharge needed.

---

## 1. **Groq** - Ultra-Fast Inference Engine

**Capabilities:** Text Generation (LLM Inference)  
**Speed:** ⚡ Fastest (45-100 tokens/sec)  
**Rate Limit:** 30 requests/minute (Free)  
**Models:**
- Mixtral-8x7b (Best for reasoning)
- Llama-3-8b (Balanced)
- Llama-3-70b (Most capable)

**Setup:**
```bash
# No credit card needed - sign up at console.groq.com
# Get API key directly
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_GROQ_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mixtral-8x7b-32768",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

**Best For:** Real-time chat, quick responses, production deployments

---

## 2. **Hugging Face** - Open Source Model Hub

**Capabilities:** Text Generation, TTS, STT, Vision, Image Generation  
**Speed:** Moderate  
**Rate Limit:** Unlimited (with free account)  
**Models:**
- **TTS:** Bark-TTS (Natural speech synthesis)
- **STT:** Whisper (Speech recognition)
- **Vision:** Llava (Image understanding)
- **Text:** Mistral, Llama-2, T5
- **Image Generation:** Stable Diffusion XL

**Setup:**
```python
from huggingface_hub import InferenceApi

hf_api = InferenceApi("YOUR_HF_TOKEN", "mistral-7b")
result = hf_api(inputs="Tell me a joke")
```

**Best For:** Multimodal tasks, open-source models, hosting flexibility

---

## 3. **Together AI** - Distributed Model Platform

**Capabilities:** Text Generation, Image Generation, TTS  
**Speed:** Very Fast  
**Rate Limit:** 200 requests/minute (Free)  
**Models:**
- Llama-2-70B
- Mistral-7B
- OpenVoice (Voice cloning)
- SDXL (Image generation)

**Setup:**
```bash
# Free account at together.ai
# No credit card required
curl https://api.together.xyz/inference \
  -X POST \
  -H "Authorization: Bearer YOUR_TOGETHER_KEY" \
  -d '{
    "model": "mistralai/Mistral-7B-Instruct-v0.1",
    "prompt": "Hello!"
  }'
```

**Best For:** Voice synthesis, ensemble models, scaling

---

## 4. **Replicate** - API for ML Models

**Capabilities:** TTS, Image Generation, Video Generation, Audio Processing  
**Speed:** Moderate  
**Rate Limit:** 50 predictions/month free  
**Models:**
- Coqui TTS (Professional voice synthesis)
- Vocos (Audio codec)
- Stable Video (Video generation)
- XTTS v2 (Multilingual TTS)

**Setup:**
```bash
# No credit card - get token at replicate.com
# Run models via API
curl -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Token YOUR_REPLICATE_TOKEN" \
  -d '{
    "version": "MODEL_VERSION_ID",
    "input": {"text": "Hello world"}
  }'
```

**Best For:** Voice synthesis, media generation, one-off tasks

---

## 5. **Deep Infra** - Community-Driven API

**Capabilities:** Text Generation, Image Generation, Embeddings  
**Speed:** Fast  
**Rate Limit:** 200 requests/day (Free tier auto-refills daily)  
**Models:**
- Llama-2-70B
- Mistral-7B
- Stable Diffusion XL
- Llava (Vision)

**Setup:**
```bash
# Free account at deepinfra.com
# No credit card needed - daily free quota
curl https://api.deepinfra.com/v1/inference/mistralai/Mistral-7B \
  -H "Authorization: bearer YOUR_DEEPINFRA_TOKEN" \
  -d '{"input": "What is AI?"}'
```

**Best For:** Quick testing, daily active usage, cost-conscious projects

---

## 6. **OctoAI** - Production-Ready Inference

**Capabilities:** Text Generation, Image Generation, Multimodal  
**Speed:** Very Fast  
**Rate Limit:** $10 free credits monthly  
**Models:**
- Mixtral-8x7B
- Llava (Vision)
- Stable Video
- Mistral, CodeLlama

**Setup:**
```bash
# Sign up at octoai.cloud (no credit card)
# Get $10 monthly free credits
export OCTOAI_TOKEN="YOUR_OCTOAI_TOKEN"
curl -X POST "https://text.octoai.run/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OCTOAI_TOKEN" \
  -d '{"model": "mixtral-8x7b", "messages": [{"role": "user", "content": "Hello"}]}'
```

**Best For:** Production deployments, vision tasks, reliable APIs

---

## 7. **Anthropic Claude** - Advanced Reasoning

**Capabilities:** Text Generation, Long Context (200K tokens)  
**Speed:** Fast  
**Rate Limit:** $5 test credits (Free)  
**Models:**
- Claude-3-Opus (Most capable)
- Claude-3-Sonnet (Balanced)
- Claude-3-Haiku (Fast, cheap)

**Setup:**
```bash
# Test credits at console.anthropic.com
# No credit card for testing
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_ANTHROPIC_KEY" \
  -d '{
    "model": "claude-3-opus-20240229",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello Claude"}]
  }'
```

**Best For:** Complex reasoning, long context documents, high-quality responses

---

## 8. **OpenRouter** - Model Aggregator

**Capabilities:** 100+ Model Access, Text Generation, Vision  
**Speed:** Variable  
**Rate Limit:** Free tier with usage-based credits  
**Models:**
- 100+ aggregated models
- OpenAI models (gpt-3.5, gpt-4)
- Anthropic Claude
- Open-source models
- Perplexity

**Setup:**
```bash
# Free account at openrouter.ai
# Instant API access to 100+ models
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_OPENROUTER_KEY" \
  -d '{
    "model": "openai/gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hi"}]
  }'
```

**Best For:** Model comparison, flexibility, accessing multiple providers

---

## 9. **Cohere** - Enterprise LLM Platform

**Capabilities:** Text Generation, Embeddings, Search  
**Speed:** Fast  
**Rate Limit:** 100 requests/minute (Free)  
**Models:**
- Command R+ (Latest, most capable)
- Command R (Production stable)
- Command Nightly (Experimental)
- Embed (Embeddings)

**Setup:**
```bash
# Free account at cohere.com
# No credit card required
curl --request POST \
  --url https://api.cohere.ai/v1/chat \
  --header "Authorization: Bearer YOUR_COHERE_TOKEN" \
  --data '{
    "message": "Hello!"
  }'
```

**Best For:** Enterprise features, embeddings, production-grade APIs

---

## 10. **Perplexity AI** - Online Search + LLM

**Capabilities:** Web Search, Real-Time Information, Text Generation  
**Speed:** Fast  
**Rate Limit:** Free research access  
**Models:**
- Sonar-Small (Fast, web-enabled)
- Sonar-Medium (Balanced)
- Sonar-Large (Most capable)

**Setup:**
```bash
# Free research API at pplx.ai
# Web search integrated
curl -X POST "https://api.perplexity.ai/chat/completions" \
  -H "Authorization: Bearer YOUR_PERPLEXITY_KEY" \
  -d '{
    "model": "pplx-sonar-small-online",
    "messages": [{"role": "user", "content": "Latest AI news"}]
  }'
```

**Best For:** Real-time information, web-aware responses, research

---

## Quick Comparison Table

| Provider | Best For | Speed | Free Limit | Setup Time |
|----------|----------|-------|------------|-----------|
| **Groq** | Fast inference | ⚡⚡⚡ | 30 req/min | 2 min |
| **Hugging Face** | Multimodal | ⚡⚡ | Unlimited | 5 min |
| **Together AI** | Voice synthesis | ⚡⚡ | 200 req/min | 3 min |
| **Replicate** | Media generation | ⚡ | 50/month | 3 min |
| **Deep Infra** | Daily usage | ⚡⚡ | 200/day | 2 min |
| **OctoAI** | Production | ⚡⚡ | $10/month | 3 min |
| **Anthropic** | Long context | ⚡ | $5 test | 5 min |
| **OpenRouter** | Model variety | ⚡⚡ | Free tier | 2 min |
| **Cohere** | Enterprise | ⚡⚡ | 100 req/min | 3 min |
| **Perplexity** | Web search | ⚡⚡ | Free | 2 min |

---

## Agentic AI Model Recommendations

### Text Generation (Agent Reasoning)
**Primary:** Groq Mixtral-8x7b or Claude-3-Sonnet
- Fast reasoning needed by the agent
- Low latency for real-time responses
- Good context understanding

**Fallback:** Llama-3-70b (Together AI) or Mistral-7b (Deep Infra)
- Reliable open-source alternatives
- Good reasoning capabilities
- Cost-effective

### Voice Processing
**TTS (Text-to-Speech):**
- **Replicate Coqui TTS** - Most natural voices
- **Hugging Face Bark** - Expressive synthesis
- **Together AI OpenVoice** - Voice cloning

**STT (Speech-to-Text):**
- **Hugging Face Whisper** - Best accuracy, multilingual
- **OpenAI Whisper** (via OpenRouter) - Gold standard

### Vision & Image Understanding
**Best:** Claude-3-Vision or Llava (Hugging Face/Together AI)
- Document understanding
- Image analysis
- OCR capabilities

### Document Processing
**Strategy:** Multi-step agent approach
1. Upload via Replicate or Hugging Face
2. Extract text with Whisper (STT for audio) or Claude (vision)
3. Process with Groq or Mixtral (fast reasoning)

---

## Recommended Agent Architecture

```
User Input (Voice/Text/File)
    ↓
[Speech-to-Text] (Hugging Face Whisper)
    ↓
[Intent Recognition] (Groq Mixtral-8x7b)
    ↓
[Tool Selection] (Agent Decision)
    ├→ Text Response: Groq/Claude
    ├→ Voice Output: Replicate Coqui TTS
    ├→ Image Analysis: Claude-3-Vision
    ├→ Web Search: Perplexity Sonar
    └→ File Processing: Hugging Face
    ↓
[Response Generation] (Fast Provider)
    ↓
[TTS Synthesis] (Replicate/Together AI)
    ↓
User Output (Audio/Text/File)
```

---

## Setup Summary

**Total time to setup all 10:** ~30 minutes

1. **Groq** → console.groq.com (2 min)
2. **Hugging Face** → huggingface.co (2 min)
3. **Together AI** → together.ai (2 min)
4. **Replicate** → replicate.com (2 min)
5. **Deep Infra** → deepinfra.com (2 min)
6. **OctoAI** → octoai.cloud (3 min)
7. **Anthropic** → console.anthropic.com (3 min)
8. **OpenRouter** → openrouter.ai (2 min)
9. **Cohere** → cohere.com (2 min)
10. **Perplexity** → pplx.ai (3 min)

**Each provider:** No credit card required, instant API key, ready to use.

---

## Implementation in Voicebox Agent

The agent automatically:
1. **Detects task type** (text/voice/image/search)
2. **Selects optimal provider** based on requirements
3. **Implements fallback strategy** if primary fails
4. **Orchestrates multiple providers** for complex tasks
5. **Caches results** to optimize costs
6. **Logs all interactions** for audit trail

See `backend_agent.py` for orchestration logic.
