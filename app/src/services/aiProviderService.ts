import { adminClient } from '@/lib/api/adminClient';
import { useAIProviderStore } from '@/stores/aiProviderStore';

export interface CompletionOptions {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stopSequences?: string[];
}

export interface CompletionResponse {
  text: string;
  tokensUsed: number;
  provider: string;
  model: string;
}

export interface EmbeddingResponse {
  embeddings: number[];
  tokensUsed: number;
  provider: string;
}

/**
 * AI Provider Service - abstraction layer for calling various AI APIs
 */
class AIProviderService {
  /**
   * Get active provider
   */
  getActiveProvider() {
    const { providers, selectedProvider } = useAIProviderStore.getState();

    if (selectedProvider) {
      return providers.find((p) => p.id === selectedProvider);
    }

    return providers.find((p) => p.isActive);
  }

  /**
   * Call LLM completion using active provider
   */
  async callCompletion(prompt: string, options?: CompletionOptions): Promise<CompletionResponse> {
    const provider = this.getActiveProvider();

    if (!provider) {
      throw new Error('No active AI provider configured');
    }

    if (!provider.apiKey) {
      throw new Error(`API key not configured for ${provider.name}`);
    }

    try {
      // Call backend API to execute completion
      const response = await adminClient.getCompletion(provider.id, prompt);

      // Update usage stats
      useAIProviderStore.getState().updateUsageStats(provider.id, {
        requestsToday: provider.usageStats.requestsToday + 1,
        tokensUsed: provider.usageStats.tokensUsed + (response.tokens_used || 0),
        lastUsed: new Date().toLocaleString(),
      });

      return {
        text: response.response,
        tokensUsed: response.tokens_used || 0,
        provider: provider.name,
        model: provider.selectedModel,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`${provider.name} API error: ${errorMessage}`);
    }
  }

  /**
   * Generate embeddings using active provider
   */
  async generateEmbeddings(texts: string[]): Promise<EmbeddingResponse> {
    const provider = this.getActiveProvider();

    if (!provider) {
      throw new Error('No active embedding provider configured');
    }

    if (provider.type !== 'embedding') {
      throw new Error(`Provider ${provider.name} does not support embeddings`);
    }

    if (!provider.apiKey) {
      throw new Error(`API key not configured for ${provider.name}`);
    }

    try {
      // In production, this would call the provider's embedding API
      // For now, return mock embeddings
      const mockEmbeddings = Array(texts.length)
        .fill(null)
        .map(() => Array(384).fill(Math.random()));

      return {
        embeddings: mockEmbeddings[0],
        tokensUsed: texts.join('').split(' ').length,
        provider: provider.name,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`${provider.name} API error: ${errorMessage}`);
    }
  }

  /**
   * List available models for active provider
   */
  getAvailableModels(): string[] {
    const provider = this.getActiveProvider();
    return provider?.models || [];
  }

  /**
   * Switch to different model in active provider
   */
  switchModel(modelId: string): void {
    const provider = this.getActiveProvider();

    if (!provider) {
      throw new Error('No active provider');
    }

    if (!provider.models.includes(modelId)) {
      throw new Error(`Model ${modelId} not available in ${provider.name}`);
    }

    useAIProviderStore.getState().updateProvider(provider.id, {
      selectedModel: modelId,
    });
  }

  /**
   * Get usage stats for active provider
   */
  getUsageStats() {
    const provider = this.getActiveProvider();
    return provider?.usageStats;
  }

  /**
   * Test provider connectivity
   */
  async testProvider(): Promise<{ success: boolean; message: string }> {
    const provider = this.getActiveProvider();

    if (!provider) {
      throw new Error('No active provider');
    }

    return adminClient.testProvider(provider.id);
  }

  /**
   * Get all configured providers
   */
  getAllProviders() {
    return useAIProviderStore.getState().providers;
  }

  /**
   * Switch active provider
   */
  setActiveProvider(providerId: string): void {
    const { providers } = useAIProviderStore.getState();
    const provider = providers.find((p) => p.id === providerId);

    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }

    useAIProviderStore.getState().setSelectedProvider(providerId);
  }
}

export const aiProviderService = new AIProviderService();
