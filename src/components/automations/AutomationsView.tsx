import React, { useState } from 'react';
import {
  Zap,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Calendar,
  GitBranch,
  Bell,
  Code,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useSara } from '../../context/SaraContext';

export const AutomationsView: React.FC = () => {
  const { automations, triggerAutomationWorkflow } = useSara();
  const [runningId, setRunningId] = useState<string | null>(null);

  const handleRun = async (id: string) => {
    setRunningId(id);
    try {
      await triggerAutomationWorkflow(id);
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
              <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                Autonomous Workflows
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Trigger + Condition + Action execution engine with verified outputs and audit history.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
            {automations.length} Active Workflows
          </span>
        </div>

        {/* Workflows List */}
        <div className="space-y-4">
          {automations.map((auto) => {
            const isRunning = runningId === auto.id;

            return (
              <div
                key={auto.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4"
              >
                {/* Title & Trigger Badge */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        auto.enabled ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-slate-600'
                      }`}
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100">{auto.name}</h3>
                      <p className="text-xs text-slate-400">{auto.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRun(auto.id)}
                      disabled={isRunning}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow transition disabled:opacity-50"
                    >
                      <Play className="w-3 h-3" />
                      <span>{isRunning ? 'Executing...' : 'Run Now'}</span>
                    </button>
                  </div>
                </div>

                {/* Pipeline Flow (Trigger -> Condition -> Actions) */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Trigger */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>Trigger</span>
                    </span>
                    <p className="text-slate-200 font-mono font-medium">
                      {auto.trigger.type === 'SCHEDULE' ? `Cron: ${auto.trigger.schedule}` : `Event: ${auto.trigger.event}`}
                    </p>
                  </div>

                  {/* Condition */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center space-x-1">
                      <Layers className="w-3 h-3 text-indigo-400" />
                      <span>Condition</span>
                    </span>
                    <p className="text-slate-200 font-mono">
                      {auto.condition || 'Always True (Unconditional)'}
                    </p>
                  </div>

                  {/* Actions count */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Actions ({auto.actions.length})</span>
                    </span>
                    <p className="text-slate-300 truncate">
                      {auto.actions.map((a) => a.tool).join(' → ')}
                    </p>
                  </div>
                </div>

                {/* Last Run verified outcome */}
                {auto.lastRun && (
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Last Result:</span>
                      <span className="text-slate-300 font-mono">{auto.lastRun.output}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(auto.lastRun.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
