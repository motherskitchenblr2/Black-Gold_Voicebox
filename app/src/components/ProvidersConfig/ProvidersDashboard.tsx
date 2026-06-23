import React, { useEffect, useState } from 'react';
import { ExternalLink, Check, X, AlertCircle, Settings, Zap } from 'lucide-react';
import { providersConfig, PROVIDERS, type ProviderName } from '@/services/providersConfigService';

export function ProvidersDashboard() {
  const [stats, setStats] = useState(providersConfig.getStatistics());
  const [activeProviders, setActiveProviders] = useState(providersConfig.getActiveProviders());
  const [allProviders, setAllProviders] = useState(providersConfig.getAllProviders());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const refreshStats = () => {
    setStats(providersConfig.getStatistics());
    setActiveProviders(providersConfig.getActiveProviders());
  };

  return (
    <div className={`flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto ${isMobile ? 'w-full' : ''}`}>
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="w-8 h-8 text-accent" />
          AI Providers Dashboard
        </h2>
        <p className="text-muted-foreground mt-1">Monitor and configure 10 free AI providers</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Configured Providers</p>
          <div className="flex items-center gap-3">
            <p className="text-4xl font-bold text-accent">{stats.activeCount}</p>
            <p className="text-2xl text-muted-foreground">/ {stats.totalCount}</p>
          </div>
          <div className="mt-3 bg-background rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${stats.configured}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{Math.round(stats.configured)}% Complete</p>
        </div>

        <div className="bg-muted border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Active Models</p>
          <p className="text-4xl font-bold text-accent">
            {stats.providers.reduce((sum, p) => sum + p.capabilities, 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-4">Total capabilities available</p>
        </div>

        <div className="bg-muted border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Speed Performance</p>
          <div className="flex gap-1 mt-2">
            {['very_fast', 'fast', 'moderate'].map((speed) => {
              const count = stats.providers.filter((p) => p.speed === speed).length;
              return count > 0 ? (
                <div
                  key={speed}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    speed === 'very_fast'
                      ? 'bg-green-500/20 text-green-600'
                      : speed === 'fast'
                      ? 'bg-blue-500/20 text-blue-600'
                      : 'bg-yellow-500/20 text-yellow-600'
                  }`}
                >
                  {count} {speed.replace('_', ' ')}
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>

      {/* Setup Guide */}
      {stats.activeCount < stats.totalCount && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-amber-600">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Missing {stats.totalCount - stats.activeCount} Providers</p>
              <p className="text-sm mt-1">Add more API keys to unlock all capabilities and provider redundancy</p>
            </div>
          </div>
        </div>
      )}

      {/* Providers Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-4">All Providers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProviders.map((provider) => {
            const isActive = providersConfig.getApiKey(provider.id as ProviderName) !== null;

            return (
              <div
                key={provider.id}
                className={`border rounded-lg p-5 transition-colors ${
                  isActive
                    ? 'bg-muted border-accent/50 hover:border-accent'
                    : 'bg-muted/50 border-border hover:border-muted-foreground'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{provider.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{provider.description}</p>
                  </div>
                  {isActive && (
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}
                  />
                  <span className={`text-xs font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {isActive ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                {/* Speed */}
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Speed</p>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    provider.speed === 'very_fast'
                      ? 'bg-green-500/20 text-green-600'
                      : provider.speed === 'fast'
                      ? 'bg-blue-500/20 text-blue-600'
                      : 'bg-yellow-500/20 text-yellow-600'
                  }`}>
                    {provider.speed.replace('_', ' ')}
                  </div>
                </div>

                {/* Capabilities */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Capabilities</p>
                  <div className="flex flex-wrap gap-1">
                    {provider.capabilities.slice(0, 3).map((cap) => (
                      <span
                        key={cap}
                        className="px-2 py-0.5 rounded text-xs bg-background border border-border"
                      >
                        {cap.replace('_', ' ')}
                      </span>
                    ))}
                    {provider.capabilities.length > 3 && (
                      <span className="px-2 py-0.5 rounded text-xs bg-background border border-border">
                        +{provider.capabilities.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate Limit:</span>
                    <span className="font-medium">{provider.rateLimit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Free:</span>
                    <span className="font-medium">{provider.freeLimit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Setup:</span>
                    <span className="font-medium">{provider.setupTime}</span>
                  </div>
                </div>

                {/* Action Button */}
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-3 py-2 text-xs font-medium rounded flex items-center justify-center gap-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {isActive ? 'Visit' : 'Get API Key'}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Providers Details */}
      {activeProviders.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Active Providers ({activeProviders.length})</h3>
          <div className="bg-muted border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Provider</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Models</th>
                    <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Speed</th>
                    <th className="px-4 py-3 text-left font-semibold">Free Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {activeProviders.map((provider) => (
                    <tr key={provider.id} className="border-b border-border hover:bg-background/50">
                      <td className="px-4 py-3 font-medium">{provider.name}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                        {provider.models.slice(0, 2).join(', ')}
                        {provider.models.length > 2 && ` +${provider.models.length - 2}`}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className={`text-xs font-medium ${
                          provider.speed === 'very_fast'
                            ? 'text-green-600'
                            : provider.speed === 'fast'
                            ? 'text-blue-600'
                            : 'text-yellow-600'
                        }`}>
                          {provider.speed.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                          {provider.freeLimit}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-600">
        <p className="font-medium mb-2">💡 All providers are free and require no credit card</p>
        <ul className="space-y-1 text-xs ml-4 list-disc">
          <li>Groq: 30 requests/minute - extremely fast</li>
          <li>Hugging Face: Unlimited - perfect for multimodal</li>
          <li>Together: 200 req/min - excellent for voice</li>
          <li>Anthropic: $5 test credits - best reasoning</li>
          <li>Perplexity: Free - web search enabled</li>
        </ul>
      </div>
    </div>
  );
}

export default ProvidersDashboard;
