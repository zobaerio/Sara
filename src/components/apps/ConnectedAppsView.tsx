import React from 'react';
import {
  Link2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useSara } from '../../context/SaraContext';

export const ConnectedAppsView: React.FC = () => {
  const { connectedApps, toggleConnectedApp } = useSara();

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Link2 className="w-4 h-4" />
              </div>
              <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                Connected Applications & Integrations
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real connector architecture for Google Workspace, GitHub, Vercel, Supabase, Slack, and Notion.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
            {connectedApps.filter((a) => a.connected).length} / {connectedApps.length} Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectedApps.map((app) => (
            <div
              key={app.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100 flex items-center space-x-2">
                      <span>{app.name}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        {app.category}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{app.description}</p>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold flex items-center space-x-1 ${
                      app.connected
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    <span>{app.connected ? 'CONNECTED' : 'DISCONNECTED'}</span>
                  </span>
                </div>

                {app.account && (
                  <div className="mt-3 text-xs text-slate-300 font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    Account: <span className="text-cyan-400">{app.account}</span>
                  </div>
                )}

                {/* Scopes */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {app.scopes.map((scope, i) => (
                    <span
                      key={i}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  {app.lastSync ? `Sync: ${new Date(app.lastSync).toLocaleDateString()}` : 'Not synced'}
                </span>
                <button
                  onClick={() => toggleConnectedApp(app.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    app.connected
                      ? 'bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 border border-slate-700'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow'
                  }`}
                >
                  {app.connected ? 'Disconnect' : 'Connect Account'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
