import { useAIProviderStore, type AIProvider } from '@/stores/aiProviderStore';
import { TrendingUp, Calendar, Zap } from 'lucide-react';

interface UsageStatsProps {
  providers: AIProvider[];
}

export function UsageStats({ providers }: UsageStatsProps) {
  const activeProviders = providers.filter((p) => p.isActive);

  const totalRequests = providers.reduce((sum, p) => sum + p.usageStats.requestsToday, 0);
  const totalTokens = providers.reduce((sum, p) => sum + p.usageStats.tokensUsed, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Usage Statistics</h2>
        <p className="text-sm text-muted-foreground">Real-time metrics and usage analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <p className="text-xs font-medium text-muted-foreground">Active Providers</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{activeProviders.length}</p>
        </div>

        <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <p className="text-xs font-medium text-muted-foreground">Requests Today</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalRequests}</p>
        </div>

        <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-secondary" />
            <p className="text-xs font-medium text-muted-foreground">Tokens Used</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalTokens.toLocaleString()}</p>
        </div>
      </div>

      {/* Provider Stats */}
      {providers.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground">No usage data available</p>
          <p className="text-xs text-muted-foreground mt-2">Add and use providers to see stats</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Provider Breakdown</h3>
          {providers.map((provider) => {
            const requestPercent =
              totalRequests > 0
                ? Math.round((provider.usageStats.requestsToday / totalRequests) * 100)
                : 0;
            const tokenPercent =
              totalTokens > 0
                ? Math.round((provider.usageStats.tokensUsed / totalTokens) * 100)
                : 0;

            return (
              <div
                key={provider.id}
                className="p-4 border border-border rounded-lg bg-muted/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      {provider.name}
                      {provider.isActive && (
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      )}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {provider.selectedModel}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {provider.usageStats.requestsToday}
                    </p>
                    <p className="text-xs text-muted-foreground">requests</p>
                  </div>
                </div>

                {/* Request Progress */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Requests</span>
                    <span className="text-xs font-medium text-foreground">{requestPercent}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${requestPercent}%` }}
                    />
                  </div>
                </div>

                {/* Token Progress */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Tokens</span>
                    <span className="text-xs font-medium text-foreground">{tokenPercent}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${tokenPercent}%` }}
                    />
                  </div>
                </div>

                {provider.usageStats.lastUsed && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Last used: {provider.usageStats.lastUsed}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
