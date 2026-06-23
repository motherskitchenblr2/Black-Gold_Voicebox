/**
 * AI Providers Configuration Service
 * Manages all 10 free AI providers with intelligent orchestration
 */

export type ProviderName = 
  | 'groq'
  | 'huggingface'
  | 'together'
  | 'replicate'
  | 'deepinfra'
  | 'octoai'
  | 'anthropic'
  | 'openrouter'
  | 'cohere'
  | 'perplexity';

export interface ProviderConfig {
  id: ProviderName;
  name: string;
  description: string;
  website: string;
  apiKeyEnv: string;
  baseUrl: string;
  models: string[];
  capabilities: string[];
  rateLimit: string;
  freeLimit: string;
  speed: 'very_fast' | 'fast' | 'moderate' | 'slow';
  bestFor: string[];
  setupTime: string;
  requiresAuth: boolean;
  fallbackOrder: number;
}

export const PROVIDERS: Record<ProviderName, ProviderConfig> = {
  groq: {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast LLM inference engine',
    website: 'https://console.groq.com',
    apiKeyEnv: 'GROQ_API_KEY',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: ['mixtral-8x7b-32768', 'llama-3-8b', 'llama-3-70b'],
    capabilities: ['text_generation', 'fast_inference', 'reasoning'],
    rateLimit: '30 requests/minute',
    freeLimit: 'Unlimited',
    speed: 'very_fast',
    bestFor: ['real-time chat', 'streaming', 'quick responses'],
    setupTime: '2 minutes',
    requiresAuth: true,
    fallbackOrder: 1
  },
  huggingface: {
    id: 'huggingface',
    name: 'Hugging Face',
    description: 'Open source model hub with 1000+ models',
    website: 'https://huggingface.co',
    apiKeyEnv: 'HUGGINGFACE_API_KEY',
    baseUrl: 'https://api-inference.huggingface.co/models',
    models: ['Mistral-7B', 'Llama-2-70B', 'Bark-TTS', 'Whisper', 'Llava'],
    capabilities: ['text_generation', 'tts', 'stt', 'vision', 'image_generation'],
    rateLimit: 'Unlimited',
    freeLimit: 'Unlimited',
    speed: 'fast',
    bestFor: ['multimodal', 'voice synthesis', 'image analysis', 'open source'],
    setupTime: '2 minutes',
    requiresAuth: true,
    fallbackOrder: 2
  },
  together: {
    id: 'together',
    name: 'Together AI',
    description: 'Distributed model platform with voice synthesis',
    website: 'https://together.ai',
    apiKeyEnv: 'TOGETHER_API_KEY',
    baseUrl: 'https://api.together.xyz/inference',
    models: ['Llama-2-70B', 'Mistral-7B', 'OpenVoice'],
    capabilities: ['text_generation', 'tts', 'image_generation'],
    rateLimit: '200 requests/minute',
    freeLimit: 'Unlimited',
    speed: 'fast',
    bestFor: ['voice synthesis', 'ensemble models', 'high throughput'],
    setupTime: '3 minutes',
    requiresAuth: true,
    fallbackOrder: 3
  },
  replicate: {
    id: 'replicate',
    name: 'Replicate',
    description: 'ML model API for media generation',
    website: 'https://replicate.com',
    apiKeyEnv: 'REPLICATE_API_TOKEN',
    baseUrl: 'https://api.replicate.com/v1',
    models: ['Coqui-TTS', 'Vocos', 'Stable-Video', 'XTTS-v2'],
    capabilities: ['tts', 'image_generation', 'video_generation', 'audio'],
    rateLimit: '50 predictions/month',
    freeLimit: '50 per month',
    speed: 'moderate',
    bestFor: ['media generation', 'one-off tasks', 'specialized models'],
    setupTime: '2 minutes',
    requiresAuth: true,
    fallbackOrder: 5
  },
  deepinfra: {
    id: 'deepinfra',
    name: 'Deep Infra',
    description: 'Community-driven API with daily resets',
    website: 'https://deepinfra.com',
    apiKeyEnv: 'DEEPINFRA_API_KEY',
    baseUrl: 'https://api.deepinfra.com/v1/inference',
    models: ['Llama-2-70B', 'Mistral-7B', 'Stable-Diffusion-XL'],
    capabilities: ['text_generation', 'image_generation', 'embeddings'],
    rateLimit: '200 requests/day',
    freeLimit: '200 per day',
    speed: 'fast',
    bestFor: ['daily usage', 'cost-conscious', 'embeddings'],
    setupTime: '2 minutes',
    requiresAuth: true,
    fallbackOrder: 4
  },
  octoai: {
    id: 'octoai',
    name: 'OctoAI',
    description: 'Production-ready inference platform',
    website: 'https://octoai.cloud',
    apiKeyEnv: 'OCTOAI_TOKEN',
    baseUrl: 'https://text.octoai.run/v1',
    models: ['Mixtral-8x7b', 'Llava', 'Stable-Video'],
    capabilities: ['text_generation', 'image_generation', 'vision', 'multimodal'],
    rateLimit: 'Unlimited with $10 credits',
    freeLimit: '$10/month free',
    speed: 'very_fast',
    bestFor: ['production', 'vision tasks', 'reliable APIs'],
    setupTime: '3 minutes',
    requiresAuth: true,
    fallbackOrder: 6
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Advanced AI with 200K context window',
    website: 'https://console.anthropic.com',
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['Claude-3-Opus', 'Claude-3-Sonnet', 'Claude-3-Haiku'],
    capabilities: ['text_generation', 'vision', 'long_context', 'reasoning'],
    rateLimit: '500 requests/minute',
    freeLimit: '$5 test credits',
    speed: 'fast',
    bestFor: ['complex reasoning', 'long documents', 'high quality responses'],
    setupTime: '3 minutes',
    requiresAuth: true,
    fallbackOrder: 7
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Model aggregator with 100+ models',
    website: 'https://openrouter.ai',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: ['100+ aggregated models', 'GPT-3.5', 'Claude', 'Mistral'],
    capabilities: ['text_generation', 'vision', 'multimodal'],
    rateLimit: 'Free tier',
    freeLimit: 'Free tier available',
    speed: 'moderate',
    bestFor: ['model comparison', 'flexibility', 'mixed providers'],
    setupTime: '2 minutes',
    requiresAuth: true,
    fallbackOrder: 8
  },
  cohere: {
    id: 'cohere',
    name: 'Cohere',
    description: 'Enterprise LLM platform',
    website: 'https://cohere.com',
    apiKeyEnv: 'COHERE_API_KEY',
    baseUrl: 'https://api.cohere.ai/v1',
    models: ['Command-R+', 'Command-R', 'Embeddings'],
    capabilities: ['text_generation', 'embeddings', 'search'],
    rateLimit: '100 requests/minute',
    freeLimit: 'Unlimited',
    speed: 'fast',
    bestFor: ['enterprise features', 'embeddings', 'semantic search'],
    setupTime: '2 minutes',
    requiresAuth: true,
    fallbackOrder: 9
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity AI',
    description: 'Web search + LLM with real-time info',
    website: 'https://pplx.ai',
    apiKeyEnv: 'PERPLEXITY_API_KEY',
    baseUrl: 'https://api.perplexity.ai/chat/completions',
    models: ['Sonar-Small', 'Sonar-Medium', 'Sonar-Large'],
    capabilities: ['web_search', 'text_generation', 'real_time_info', 'citations'],
    rateLimit: 'Free research access',
    freeLimit: 'Free tier available',
    speed: 'moderate',
    bestFor: ['real-time information', 'web search', 'research'],
    setupTime: '2 minutes',
    requiresAuth: true,
    fallbackOrder: 10
  }
};

export const ALL_PROVIDER_IDS: ProviderName[] = [
  'groq',
  'huggingface',
  'together',
  'deepinfra',
  'octoai',
  'anthropic',
  'openrouter',
  'cohere',
  'perplexity',
  'replicate'
];

class ProvidersConfigService {
  private apiKeys: Map<ProviderName, string> = new Map();
  private activeProviders: Set<ProviderName> = new Set();

  constructor() {
    this.loadEnvironmentVariables();
  }

  /**
   * Load API keys from environment variables
   */
  private loadEnvironmentVariables(): void {
    ALL_PROVIDER_IDS.forEach((providerId) => {
      const provider = PROVIDERS[providerId];
      const envKey = provider.apiKeyEnv;
      const envValue = process.env[envKey];

      if (envValue) {
        this.apiKeys.set(providerId, envValue);
        this.activeProviders.add(providerId);
        console.log(`[v0] Loaded API key for ${provider.name}`);
      } else {
        console.warn(`[v0] ${provider.name}: ${envKey} not found in environment`);
      }
    });
  }

  /**
   * Get provider config
   */
  getProvider(providerId: ProviderName): ProviderConfig | null {
    return PROVIDERS[providerId] || null;
  }

  /**
   * Get all providers
   */
  getAllProviders(): ProviderConfig[] {
    return ALL_PROVIDER_IDS.map((id) => PROVIDERS[id]);
  }

  /**
   * Get active providers (with API keys configured)
   */
  getActiveProviders(): ProviderConfig[] {
    return Array.from(this.activeProviders).map((id) => PROVIDERS[id]);
  }

  /**
   * Get API key for provider
   */
  getApiKey(providerId: ProviderName): string | null {
    return this.apiKeys.get(providerId) || null;
  }

  /**
   * Set API key for provider
   */
  setApiKey(providerId: ProviderName, apiKey: string): void {
    this.apiKeys.set(providerId, apiKey);
    this.activeProviders.add(providerId);
    console.log(`[v0] API key set for ${PROVIDERS[providerId].name}`);
  }

  /**
   * Select best provider for task
   */
  selectBestProvider(
    task: string,
    requiredCapabilities: string[] = []
  ): ProviderName | null {
    const activeConfigs = this.getActiveProviders();

    if (activeConfigs.length === 0) {
      console.warn('[v0] No active providers configured');
      return null;
    }

    // Score providers based on capabilities and speed
    const scored = activeConfigs.map((provider) => {
      let score = 0;

      // Check capabilities
      const matchedCapabilities = requiredCapabilities.filter((cap) =>
        provider.capabilities.includes(cap)
      );
      score += matchedCapabilities.length * 10;

      // Speed bonus
      if (provider.speed === 'very_fast') score += 5;
      if (provider.speed === 'fast') score += 3;

      // Task-specific scoring
      if (task.toLowerCase().includes('reason')) {
        if (provider.capabilities.includes('reasoning')) score += 5;
      }
      if (task.toLowerCase().includes('vision') || task.toLowerCase().includes('image')) {
        if (provider.capabilities.includes('vision')) score += 5;
      }
      if (task.toLowerCase().includes('voice') || task.toLowerCase().includes('tts')) {
        if (provider.capabilities.includes('tts')) score += 5;
      }
      if (task.toLowerCase().includes('search')) {
        if (provider.capabilities.includes('web_search')) score += 5;
      }

      return {
        provider: provider.id,
        config: provider,
        score
      };
    });

    // Sort by score (highest first)
    scored.sort((a, b) => b.score - a.score);

    console.log(`[v0] Selected ${scored[0].config.name} for task: ${task}`);
    return scored[0].provider;
  }

  /**
   * Get provider recommendations for specific tasks
   */
  getRecommendedProviders(task: string): ProviderName[] {
    const recommendations: ProviderName[] = [];

    // Task-specific recommendations
    if (task.includes('fast') || task.includes('streaming')) {
      recommendations.push('groq', 'octoai', 'deepinfra');
    }
    if (task.includes('voice') || task.includes('tts')) {
      recommendations.push('huggingface', 'together', 'replicate');
    }
    if (task.includes('image') || task.includes('vision')) {
      recommendations.push('huggingface', 'octoai', 'replicate');
    }
    if (task.includes('reasoning') || task.includes('complex')) {
      recommendations.push('anthropic', 'openrouter');
    }
    if (task.includes('search') || task.includes('web')) {
      recommendations.push('perplexity');
    }
    if (task.includes('embedding') || task.includes('semantic')) {
      recommendations.push('cohere', 'huggingface');
    }

    // Add default recommendations
    if (recommendations.length === 0) {
      recommendations.push(...['groq', 'huggingface', 'together']);
    }

    // Filter to active providers
    return recommendations.filter((p) => this.activeProviders.has(p));
  }

  /**
   * Get provider statistics
   */
  getStatistics() {
    const activeCount = this.activeProviders.size;
    const totalCount = ALL_PROVIDER_IDS.length;
    const providers = this.getActiveProviders();

    return {
      activeCount,
      totalCount,
      configured: (activeCount / totalCount) * 100,
      providers: providers.map((p) => ({
        name: p.name,
        capabilities: p.capabilities.length,
        speed: p.speed
      }))
    };
  }

  /**
   * Check if all providers are configured
   */
  isFullyConfigured(): boolean {
    return this.activeProviders.size === ALL_PROVIDER_IDS.length;
  }

  /**
   * Get setup guide
   */
  getSetupGuide(): string {
    const unconfigured = ALL_PROVIDER_IDS.filter(
      (id) => !this.activeProviders.has(id)
    );

    if (unconfigured.length === 0) {
      return 'All providers are configured!';
    }

    const guide = unconfigured
      .map((id) => {
        const provider = PROVIDERS[id];
        return `${provider.name}: ${provider.website}`;
      })
      .join('\n');

    return `Setup these providers:\n${guide}`;
  }
}

export const providersConfig = new ProvidersConfigService();

export default ProvidersConfigService;
