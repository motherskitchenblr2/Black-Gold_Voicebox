import { useState } from 'react';
import { useAIProviderStore } from '@/stores/aiProviderStore';
import { aiProviderService } from '@/services/aiProviderService';
import { Send, Zap, Loader } from 'lucide-react';

export function AIPlayground() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const { providers, selectedProvider } = useAIProviderStore();

  const activeProvider = providers.find((p) => p.id === selectedProvider);
  const availableModels = activeProvider?.models || [];

  const handleSendPrompt = async () => {
    if (!activeProvider) {
      setError('No active provider selected');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await aiProviderService.callCompletion(prompt);
      setResponse(result.text);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <div className="p-8 border-b border-border/50">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Zap className="w-8 h-8 text-primary" />
            AI Playground
          </h1>
          <p className="text-muted-foreground">Test your AI providers in real-time</p>

          {/* Provider Selection */}
          {activeProvider && (
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Active Provider</p>
              <p className="text-lg font-semibold text-foreground mb-4">{activeProvider.name}</p>

              {/* Model Selection */}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">
                  Model
                </label>
                <select
                  value={selectedModel || activeProvider.selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value);
                    aiProviderService.switchModel(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {availableModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              {/* Usage Stats */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="p-2 bg-accent/10 rounded text-center">
                  <p className="text-xs text-muted-foreground">Requests Today</p>
                  <p className="text-lg font-bold text-accent">
                    {activeProvider.usageStats.requestsToday}
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded text-center">
                  <p className="text-xs text-muted-foreground">Tokens Used</p>
                  <p className="text-lg font-bold text-primary">
                    {activeProvider.usageStats.tokensUsed}
                  </p>
                </div>
                <div className="p-2 bg-secondary/10 rounded text-center">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-lg font-bold text-secondary">
                    {activeProvider.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!activeProvider && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-center">
              <p className="text-destructive text-sm font-medium">
                No active AI provider configured. Configure one in the Admin Panel (Ctrl+Shift+A)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="max-w-2xl mx-auto w-full h-full p-8 flex flex-col">
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-3">Your Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                  handleSendPrompt();
                }
              }}
              placeholder="Enter your prompt here... (Ctrl+Enter to send)"
              className="w-full h-24 px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Response Section */}
          <div className="flex-1 mb-6 flex flex-col">
            <label className="block text-sm font-semibold text-foreground mb-3">Response</label>
            <div className="flex-1 p-4 bg-muted/20 border border-border rounded-lg overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full gap-2">
                  <Loader className="w-5 h-5 text-primary animate-spin" />
                  <p className="text-muted-foreground">Generating response...</p>
                </div>
              ) : error ? (
                <div className="text-destructive text-sm">
                  <p className="font-medium mb-1">Error:</p>
                  <p>{error}</p>
                </div>
              ) : response ? (
                <p className="text-foreground whitespace-pre-wrap">{response}</p>
              ) : (
                <p className="text-muted-foreground text-sm">Response will appear here...</p>
              )}
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendPrompt}
            disabled={isLoading || !activeProvider}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            <Send className="w-4 h-4" />
            {isLoading ? 'Generating...' : 'Send Prompt'}
          </button>
        </div>
      </div>
    </div>
  );
}
