import { useState } from 'react';
import { useAIProviderStore } from '@/stores/aiProviderStore';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';

export function ProviderConfig() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { providers, updateProvider } = useAIProviderStore();

  const handleCopyKey = (id: string, apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-2">API Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Configure API keys and endpoints for each provider
        </p>
      </div>

      {providers.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground">No providers to configure</p>
          <p className="text-xs text-muted-foreground mt-2">Add providers from the Providers tab</p>
        </div>
      ) : (
        <div className="space-y-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="p-4 border border-border rounded-lg bg-muted/20 space-y-4"
            >
              <div>
                <h3 className="font-semibold text-foreground mb-3">{provider.name}</h3>

                {/* API Key Input */}
                <div className="space-y-2 mb-4">
                  <label className="block text-xs font-medium text-muted-foreground">
                    API Key
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type={showKeys[provider.id] ? 'text' : 'password'}
                        value={provider.apiKey}
                        onChange={(e) =>
                          updateProvider(provider.id, { apiKey: e.target.value })
                        }
                        placeholder="Enter API key..."
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <button
                      onClick={() =>
                        setShowKeys({
                          ...showKeys,
                          [provider.id]: !showKeys[provider.id],
                        })
                      }
                      className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-md text-muted-foreground transition-colors"
                      title={showKeys[provider.id] ? 'Hide' : 'Show'}
                    >
                      {showKeys[provider.id] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCopyKey(provider.id, provider.apiKey)}
                      className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-md text-muted-foreground transition-colors"
                      title="Copy"
                    >
                      {copiedId === provider.id ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Model Selection */}
                <div className="space-y-2 mb-4">
                  <label className="block text-xs font-medium text-muted-foreground">
                    Selected Model
                  </label>
                  <select
                    value={provider.selectedModel}
                    onChange={(e) =>
                      updateProvider(provider.id, { selectedModel: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {provider.models.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rate Limit */}
                {provider.rateLimit && (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-muted-foreground">
                      Rate Limit (requests/min): {provider.rateLimit}
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="5000"
                      step="100"
                      value={provider.rateLimit}
                      onChange={(e) =>
                        updateProvider(provider.id, {
                          rateLimit: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-primary"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Free API Providers Guide */}
      <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
        <h3 className="font-semibold text-sm text-accent mb-3">Getting Free API Keys</h3>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li>• <strong>Groq:</strong> console.groq.com - Free tier with 30 requests/minute</li>
          <li>• <strong>DeepInfra:</strong> deepinfra.com - $0 starter credit</li>
          <li>• <strong>Hugging Face:</strong> huggingface.co - Free inference API</li>
          <li>• <strong>Together AI:</strong> together.ai - Free tier available</li>
          <li>• <strong>Replicate:</strong> replicate.com - Free credits on signup</li>
          <li>• <strong>OpenRouter:</strong> openrouter.ai - Free tier with limits</li>
        </ul>
      </div>
    </div>
  );
}
