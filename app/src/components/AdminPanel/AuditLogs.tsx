import { useEffect, useState } from 'react';
import { Trash2, Download } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  provider: string;
  status: 'success' | 'error' | 'info';
  details: string;
}

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>(() => {
    // Load from localStorage
    const stored = localStorage.getItem('admin-audit-logs');
    return stored ? JSON.parse(stored) : [];
  });

  // Add a log entry
  const addLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      ...log,
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  // Save logs to localStorage
  useEffect(() => {
    localStorage.setItem('admin-audit-logs', JSON.stringify(logs));
  }, [logs]);

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all audit logs?')) {
      setLogs([]);
    }
  };

  const downloadLogs = () => {
    const csv =
      'Timestamp,Action,Provider,Status,Details\n' +
      logs
        .map((log) =>
          [log.timestamp, log.action, log.provider, log.status, `"${log.details}"`].join(','),
        )
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Audit Logs</h2>
        <p className="text-sm text-muted-foreground">System activity and API calls history</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={downloadLogs}
          disabled={logs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-md text-primary font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={clearLogs}
          disabled={logs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 rounded-md text-destructive font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      {/* Logs Table */}
      {logs.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground">No logs yet</p>
          <p className="text-xs text-muted-foreground mt-2">Admin actions will appear here</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map((log) => {
            const statusColor =
              log.status === 'success'
                ? 'bg-accent/10 border-accent/30 text-accent'
                : log.status === 'error'
                  ? 'bg-destructive/10 border-destructive/30 text-destructive'
                  : 'bg-muted/30 border-border text-muted-foreground';

            return (
              <div
                key={log.id}
                className={`p-3 border rounded-lg ${statusColor} text-sm`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <p className="font-medium">
                      {log.action}
                      {log.provider && ` (${log.provider})`}
                    </p>
                    <p className="text-xs mt-1 opacity-75">{log.details}</p>
                  </div>
                  <p className="text-xs ml-2 flex-shrink-0 opacity-75">{log.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Test Log Button (for demo) */}
      <button
        onClick={() =>
          addLog({
            action: 'API Call',
            provider: 'Groq',
            status: 'success',
            details: 'Generated text using Mixtral model',
          })
        }
        className="text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded hover:bg-muted transition-colors"
      >
        + Add Test Log (Demo)
      </button>
    </div>
  );
}
