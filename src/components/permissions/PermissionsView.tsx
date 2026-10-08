import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Check,
  X,
} from 'lucide-react';
import { useSara } from '../../context/SaraContext';

export const PermissionsView: React.FC = () => {
  const { pendingPermission, resolvePermission } = useSara();

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                Security & Autonomous Permission Engine
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Strict multi-tier safety gate ensuring high-impact actions require explicit human authorization.
            </p>
          </div>
        </div>

        {/* Active Pending Approval Banner if any */}
        {pendingPermission && (
          <div className="bg-amber-950/80 border border-amber-500 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold text-amber-200 uppercase tracking-wider">
                Action Waiting For Your Approval
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tool: <span className="text-cyan-400 font-mono">{pendingPermission.tool}</span></span>
                <span className="px-2 py-0.5 rounded bg-amber-900 text-amber-200 font-mono text-[10px]">
                  {pendingPermission.riskLevel}
                </span>
              </div>
              <p className="text-slate-200 mt-1">{pendingPermission.description}</p>
            </div>
            <div className="flex items-center space-x-2 justify-end pt-2">
              <button
                onClick={() => resolvePermission('ALLOW_ONCE')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow"
              >
                Allow Once
              </button>
              <button
                onClick={() => resolvePermission('ALLOW_TASK')}
                className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-200 border border-amber-700 text-xs font-semibold transition"
              >
                Allow for This Task
              </button>
              <button
                onClick={() => resolvePermission('DENY')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition"
              >
                Deny Action
              </button>
            </div>
          </div>
        )}

        {/* Permission Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tier 1: Safe */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">Safe Actions</h3>
            </div>
            <p className="text-xs text-slate-400">Autonomous execution permitted without human disruption.</p>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
              <li>Read local project files</li>
              <li>Analyze source code syntax</li>
              <li>Run local safe unit tests</li>
              <li>Synthesize public web research</li>
              <li>Formulate execution plans</li>
            </ul>
          </div>

          {/* Tier 2: Approval Required */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">Approval Required</h3>
            </div>
            <p className="text-xs text-slate-400">SARA pauses task and requests human confirmation.</p>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
              <li>Deploying to Vercel production</li>
              <li>Pushing commits to remote Git</li>
              <li>Sending emails or Slack alerts</li>
              <li>Modifying cloud environment vars</li>
              <li>Submitting external forms</li>
            </ul>
          </div>

          {/* Tier 3: Always Explicit Confirmation */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300">Always Explicit</h3>
            </div>
            <p className="text-xs text-slate-400">Strict confirmation required; cannot be auto-whitelisted.</p>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
              <li>Financial payments or transfers</li>
              <li>Deleting databases or cloud instances</li>
              <li>Permanent secret / password revocation</li>
              <li>Irreversible data purge</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
