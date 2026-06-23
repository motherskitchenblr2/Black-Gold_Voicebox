import { useState } from 'react';
import { useAIProviderStore } from '@/stores/aiProviderStore';
import { Trash2, Plus, Power, PowerOff } from 'lucide-react';

const FREE_PROVIDERS = [
  {
    id: 'groq',
    name: 'Groq',
    type: 'llm' as const,
    models: ['mixtral-8x7b-32768', 'llama-3-70b', 'gemma-7b-it'],
  },
  {
    id: 'deep-infra',
    name: 'Deep Infra',
    type: 'llm' as const,
    models: ['meta-llama/Llama-2-70b-chat-hf', 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO'],
  },
  {
    id: 'hugging-face',
    name: 'Hugging Face',
    type: 'llm' as const,
    models: ['meta-llama/Llama-2-7b-chat', 'mistralai/Mistral-7B-Instruct-v0.1'],
  },
  {
    id: 'together-ai',
    name: 'Together AI',
    type: 'llm' as const,
    models: ['togethercomputer/llama-2-70b-chat', 'NousResearch/Nous-Hermes-2-Mixtral-8x7B'],
  },
  {
    id: 'replicate',
    name: 'Replicate',
    type: 'llm' as const,
    models: ['meta/llama-2-70b-chat', 'mistralai/mistral-7b-instruct-v0.2'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    type: 'llm' as const,
    models: ['claude-opus-4', 'claude-sonnet-3.5'],
  },
  {
    id: 'open-router',
    name: 'OpenRouter',
    type: 'llm' as const,
    models: ['openai/gpt-4-turbo', 'anthropic/claude-opus'],
  },
  {
    id: 'mistral-ai',
    name: 'Mistral AI',
    type: 'llm' as const,
    models: ['mistral-medium', 'mistral-small'],
  },
  {
    id: 'llama-cloud',
    name: 'LLaMA Cloud',
    type: 'llm' as const,
    models: ['llama-2-70b', 'llama-2-13b'],
  },
  {
    id: 'cohere',
    name: 'Cohere',
    type: 'llm' as const,
    models: ['command', 'command-light'],
  },
];

export function ProviderManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { providers, addProvider, deleteProvider, activateProvider, deactivateProvider } =
    useAIProviderStore();

  const handleAddProvider = (providerTemplate: (typeof FREE_PROVIDERS)[0]) => {
    const newProvider = {
      id: `${providerTemplate.id}_${Date.now()}`,
      name: providerTemplate.name,
      type: providerTemplate.type,
      apiKey: '',
      isActive: false,
      models: providerTemplate.models,
      selectedModel: providerTemplate.models[0],
      rateLimit: 3000,
      usageStats: {
        requestsToday: 0,
        tokensUsed: 0,
      },
    };
    addProvider(newProvider);
    setShowAddModal(false);
  };

  const activeCount = providers.filter((p) => p.isActive).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-2">AI Providers</h2>
        <p className="text-sm text-muted-foreground">
          Manage {activeCount} active provider{activeCount !== 1 ? 's' : ''} out of {providers.length}
        </p>
      </div>

      {/* Add Provider Button */}
      <button
        onClick={() => setShowAddModal(!showAddModal)}
        className="w-full flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-md text-primary font-medium transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add AI Provider
      </button>

      {/* Provider Selection Modal */}
      {showAddModal && (
        <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-lg border border-border">
          {FREE_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleAddProvider(provider)}
              className="p-3 text-left bg-background border border-border rounded-md hover:border-primary hover:bg-primary/5 transition-all"
            >
              <p className="font-medium text-sm text-foreground">{provider.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{provider.models.length} models</p>
            </button>
          ))}
        </div>
      )}

      {/* Active Providers List */}
      {providers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Active Configuration</h3>
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="p-4 bg-muted/30 border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-foreground">{provider.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Using: {provider.selectedModel}
                  </p>
                </div>
                <div className="flex gap-2">
                  {provider.isActive ? (
                    <button
                      onClick={() => deactivateProvider(provider.id)}
                      className="p-2 bg-accent/20 hover:bg-accent/30 rounded-md text-accent transition-colors"
                      title="Deactivate"
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => activateProvider(provider.id)}
                      className="p-2 bg-muted hover:bg-muted/80 rounded-md text-muted-foreground transition-colors"
                      title="Activate"
                    >
                      <PowerOff className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteProvider(provider.id)}
                    className="p-2 bg-destructive/10 hover:bg-destructive/20 rounded-md text-destructive transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!provider.apiKey && (
                <div className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded">
                  ⚠️ API Key not configured
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {providers.length === 0 && (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground">No providers configured yet</p>
          <p className="text-xs text-muted-foreground mt-2">Add one to get started</p>
        </div>
      )}
    </div>
  );
}
