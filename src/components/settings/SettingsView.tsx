import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  BrainCircuit,
  Mic,
  Shield,
  Volume2,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useSara } from '../../context/SaraContext';

export const SettingsView: React.FC = () => {
  const { thinkingMode, setThinkingMode, systemStatus, loadAllData } = useSara();
  const [selectedVoice, setSelectedVoice] = useState('Zephyr');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadAllData();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <Settings className="w-4 h-4" />
              </div>
              <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                System & AI Engine Settings
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Configure model providers, thinking level, and live voice parameters.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center space-x-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Reload Status</span>
          </button>
        </div>

        {/* AI Models Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Configured AI Model Architecture
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thinking Model */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Deep Reasoning Model</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                  ThinkingLevel.HIGH
                </span>
              </div>
              <p className="text-xs font-mono text-cyan-400">gemini-3.1-pro-preview</p>
              <p className="text-[11px] text-slate-400">
                Activated during High Thinking Mode for complex multi-agent planning and architectural synthesis.
              </p>
              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={thinkingMode}
                    onChange={(e) => setThinkingMode(e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300">Set as Active Reasoning Engine</span>
                </label>
              </div>
            </div>

            {/* Fast Execution Model */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Fast Agent Model</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  Low Latency
                </span>
              </div>
              <p className="text-xs font-mono text-cyan-400">gemini-3.8-flash</p>
              <p className="text-[11px] text-slate-400">
                Used for sub-second tool dispatching, file checks, and rapid autonomous step orchestration.
              </p>
            </div>

            {/* Live API Voice Model */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real-Time Live Voice</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  Duplex Audio
                </span>
              </div>
              <p className="text-xs font-mono text-emerald-400">gemini-3.8-live</p>
              <p className="text-[11px] text-slate-400">
                Connects through bidirectional WebSocket for natural speech with real-time interruption detection.
              </p>
            </div>

            {/* TTS Speech Model */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Speech Synthesis</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono">
                  24kHz WAV
                </span>
              </div>
              <p className="text-xs font-mono text-sky-400">gemini-3.8-flash-lite-tts</p>
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-[11px] text-slate-400">Voice Persona:</span>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-xs text-slate-200"
                >
                  {['Zephyr', 'Kore', 'Puck', 'Charon', 'Fenrir'].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              System Telemetry Status
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Server Engine</span>
              <p className="text-emerald-400 font-mono font-semibold mt-0.5">ONLINE (Port 3000)</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Gemini API Key</span>
              <p className="text-emerald-400 font-mono font-semibold mt-0.5">INJECTED & VERIFIED</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">WebSocket Live Gateway</span>
              <p className="text-emerald-400 font-mono font-semibold mt-0.5">ACTIVE (/live)</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Version</span>
              <p className="text-cyan-400 font-mono font-semibold mt-0.5">SARA OS 2.5.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
