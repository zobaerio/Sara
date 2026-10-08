import React from 'react';
import {
  Mic,
  BrainCircuit,
  ShieldAlert,
  Play,
  RotateCcw,
  Sparkles,
  Activity,
  Layers,
  CheckCircle2,
  Menu,
} from 'lucide-react';
import { useSara } from '../../context/SaraContext';

interface HeaderProps {
  title: string;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onToggleMobileSidebar }) => {
  const {
    thinkingMode,
    setThinkingMode,
    setLiveVoiceOpen,
    pendingPermission,
    resolvePermission,
    activeTask,
  } = useSara();

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-10">
      {/* Title & Context */}
      <div className="flex items-center space-x-2.5 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 flex-shrink-0"
          title="Open menu"
        >
          <Menu className="w-4 h-4" />
        </button>
        <h1 className="text-xs sm:text-sm font-semibold text-slate-100 uppercase tracking-wider truncate">{title}</h1>
        {activeTask && (
          <div className="hidden lg:flex items-center space-x-2 text-xs px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-slate-400">Active Task:</span>
            <span className="text-slate-200 font-medium truncate max-w-[200px]">{activeTask.title}</span>
            <span className="text-[10px] text-cyan-400 font-mono">({activeTask.progress}%)</span>
          </div>
        )}
      </div>

      {/* Controls & Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
        {/* Thinking Mode Toggle */}
        <div
          onClick={() => setThinkingMode(!thinkingMode)}
          className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-200 select-none ${
            thinkingMode
              ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300 shadow-md shadow-indigo-500/10'
              : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
          }`}
          title="Enable deep thinking mode with gemini-3.1-pro-preview at ThinkingLevel.HIGH for complex reasoning"
        >
          <BrainCircuit className={`w-3.5 h-3.5 ${thinkingMode ? 'text-indigo-400' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">High Thinking</span>
          <span
            className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
              thinkingMode ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'
            }`}
          >
            {thinkingMode ? 'PRO' : 'OFF'}
          </span>
        </div>

        {/* Live Voice Launcher Button */}
        <button
          onClick={() => setLiveVoiceOpen(true)}
          className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-medium shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400/30 transition-all duration-150"
          title="Start real-time duplex voice conversation with Gemini 3.8 Live API"
        >
          <Mic className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Live Voice</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-ping"></span>
        </button>

        {/* Pending Permission Indicator if any */}
        {pendingPermission && (
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 bg-amber-950/70 border border-amber-600/70 rounded-lg text-amber-300 text-xs animate-bounce">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">Approval Required</span>
          </div>
        )}
      </div>
    </header>
  );
};

