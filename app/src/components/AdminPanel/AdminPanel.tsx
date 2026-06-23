import { useState } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { useAIProviderStore } from '@/stores/aiProviderStore';
import { ProviderManagement } from './ProviderManagement';
import { ProviderConfig } from './ProviderConfig';
import { UsageStats } from './UsageStats';
import { AuditLogs } from './AuditLogs';
import { SettingsPanel } from './SettingsPanel';
import { LogOut, BarChart3, Settings, FileText, Zap } from 'lucide-react';

type Tab = 'providers' | 'config' | 'usage' | 'logs' | 'settings';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('providers');
  const { isAuthenticated, logout, adminId } = useAdminStore();
  const { providers } = useAIProviderStore();

  if (!isAuthenticated) {
    return null;
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'providers', label: 'Providers', icon: <Zap className="w-4 h-4" /> },
    { id: 'config', label: 'Configuration', icon: <Settings className="w-4 h-4" /> },
    { id: 'usage', label: 'Usage Stats', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'logs', label: 'Audit Logs', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed right-0 top-0 bottom-0 w-1/3 bg-background border-l border-border shadow-2xl overflow-hidden flex flex-col z-40">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground mt-1">Logged in as: {adminId}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 pt-4 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-t-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary/10 text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {activeTab === 'providers' && <ProviderManagement />}
          {activeTab === 'config' && <ProviderConfig />}
          {activeTab === 'usage' && <UsageStats providers={providers} />}
          {activeTab === 'logs' && <AuditLogs />}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
}
