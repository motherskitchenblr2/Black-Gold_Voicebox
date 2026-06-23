import { useState } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { AlertCircle, Shield, Clock } from 'lucide-react';

export function SettingsPanel() {
  const { sessionExpiry, refreshSession } = useAdminStore();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const timeUntilExpiry = sessionExpiry ? Math.max(0, sessionExpiry - Date.now()) : 0;
  const minutesLeft = Math.floor(timeUntilExpiry / 60000);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Admin Settings</h2>
        <p className="text-sm text-muted-foreground">Configure admin panel behavior</p>
      </div>

      {/* Session Management */}
      <div className="p-4 border border-border rounded-lg bg-muted/20 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground">Session Management</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Current session expires in <strong>{minutesLeft} minutes</strong>
              </p>
            </div>
          </div>
          <button
            onClick={refreshSession}
            className="px-3 py-1 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Auto-Refresh Toggle */}
      <div className="p-4 border border-border rounded-lg bg-muted/20 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Auto-Refresh Session</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Automatically extend session on activity
            </p>
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
              autoRefresh ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-background transition-transform ${
                autoRefresh ? 'translate-x-6' : 'translate-x-1'
              } my-auto`}
            />
          </button>
        </div>
      </div>

      {/* Notifications Toggle */}
      <div className="p-4 border border-border rounded-lg bg-muted/20 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Admin Notifications</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Receive alerts for critical events
            </p>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
              notificationsEnabled ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-background transition-transform ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
              } my-auto`}
            />
          </button>
        </div>
      </div>

      {/* Security Info */}
      <div className="p-4 border border-accent/30 rounded-lg bg-accent/10 space-y-3">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground text-sm">Security</h3>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
              <li>✓ Session expires after 15 minutes of inactivity</li>
              <li>✓ Credentials stored securely in session storage</li>
              <li>✓ All API keys encrypted in transit</li>
              <li>✓ Admin panel requires hidden keyboard shortcut (Ctrl+Shift+A)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* API Integration Guide */}
      <div className="p-4 border border-border rounded-lg bg-muted/20 space-y-3">
        <h3 className="font-semibold text-foreground text-sm">Free AI API Providers</h3>
        <p className="text-xs text-muted-foreground">
          Currently supporting 10+ free AI API providers with no credit card required:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>• Groq (Mixtral, Llama)</div>
          <div>• Deep Infra (LLaMA 2)</div>
          <div>• Hugging Face (Multiple)</div>
          <div>• Together AI (Mixed)</div>
          <div>• Replicate (Various)</div>
          <div>• Anthropic (Claude)</div>
          <div>• OpenRouter (Multi)</div>
          <div>• Mistral AI</div>
          <div>• LLaMA Cloud</div>
          <div>• Cohere</div>
        </div>
      </div>

      {/* System Status */}
      <div className="p-4 border border-border rounded-lg bg-muted/20 space-y-3">
        <h3 className="font-semibold text-foreground text-sm">System Status</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between items-center p-2 bg-background rounded border border-border/50">
            <span>Backend Status</span>
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>
          <div className="flex justify-between items-center p-2 bg-background rounded border border-border/50">
            <span>Admin Panel</span>
            <span className="w-2 h-2 rounded-full bg-accent" />
          </div>
          <div className="flex justify-between items-center p-2 bg-background rounded border border-border/50">
            <span>Database</span>
            <span className="w-2 h-2 rounded-full bg-accent" />
          </div>
        </div>
      </div>

      {/* Warning Box */}
      <div className="p-4 border border-destructive/30 rounded-lg bg-destructive/10 flex gap-3">
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-destructive">Important</p>
          <p className="text-xs text-muted-foreground mt-1">
            Keep your admin credentials secure. Never share your login information with anyone.
          </p>
        </div>
      </div>
    </div>
  );
}
