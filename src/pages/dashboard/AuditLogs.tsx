import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Upload,
  Play,
  CheckCircle,
  FileText,
  Loader2,
} from 'lucide-react';
import { getAuditLogs } from '../../api/audit';

interface AuditEntry {
  id: string;
  action: string;
  proposalId?: string;
  proposalTitle?: string;
  timestamp: string;
  details?: string;
}

const actionIcons: Record<string, any> = {
  uploaded: Upload,
  evaluation_started: Play,
  evaluation_completed: CheckCircle,
  report_generated: FileText,
};

const actionColors: Record<string, string> = {
  uploaded: '#00c6ff',
  evaluation_started: '#f59e0b',
  evaluation_completed: '#22c55e',
  report_generated: '#1e90ff',
};

function getActionLabel(action: string) {
  return action
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAuditLogs()
      .then(setLogs)
      .catch((err: any) => setError(err.message || 'Failed to load audit logs'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-prism-accent/10 border border-prism-accent/20">
          <ClipboardList className="w-5 h-5 text-prism-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-prism-text text-glow">Audit Logs</h1>
          <p className="text-sm text-prism-text-muted">Track proposal lifecycle events</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-prism-accent animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <ClipboardList className="w-12 h-12 text-prism-text-muted mx-auto mb-4 opacity-40" />
          <p className="text-prism-text-muted">No audit logs recorded yet.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-6">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-prism-accent/15" />

            <div className="space-y-6">
              {logs.map((log, index) => {
                const Icon = actionIcons[log.action] || ClipboardList;
                const color = actionColors[log.action] || '#1e90ff';
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 relative"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border z-10"
                      style={{
                        backgroundColor: `${color}15`,
                        borderColor: `${color}30`,
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium text-prism-text">
                        {getActionLabel(log.action)}
                      </p>
                      {log.proposalTitle && (
                        <p className="text-xs text-prism-accent mt-0.5">{log.proposalTitle}</p>
                      )}
                      {log.details && (
                        <p className="text-xs text-prism-text-muted mt-1">{log.details}</p>
                      )}
                      <p className="text-xs text-prism-text-muted/60 mt-1 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
