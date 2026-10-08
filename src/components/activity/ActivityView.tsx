import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Terminal,
  ShieldCheck,
  BrainCircuit,
  Filter,
} from 'lucide-react';
import { useSara } from '../../context/SaraContext';

export const ActivityView: React.FC = () => {
  const { activityLogs } = useSara();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredLogs = activityLogs.filter((log) => {
    if (filterType !== 'ALL' && log.type !== filterType) return false;
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'WARNING':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'ERROR':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Info className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
              <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                Activity Logs & Telemetry Audit
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Transparent audit trail of every tool execution, permission approval, and self-healing event.
            </p>
          </div>

          <div className="flex items-center space-x-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto no-scrollbar">
            {['ALL', 'TOOL_EXECUTION', 'AI_REASONING', 'PERMISSION_GRANT', 'AUTOMATION', 'SYSTEM_ERROR'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition whitespace-nowrap ${
                  filterType === t
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Feed */}
        <div className="space-y-2.5">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 shadow-sm flex items-start justify-between gap-4"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">{getStatusIcon(log.status)}</div>
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-slate-200">{log.title}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono">
                      {log.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{log.details}</p>
                </div>
              </div>

              <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
