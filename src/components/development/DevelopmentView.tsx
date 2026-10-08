import React, { useState } from 'react';
import {
  Code2,
  GitBranch,
  Triangle,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Terminal,
  ShieldCheck,
  Bug,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useSara } from '../../context/SaraContext';

export const DevelopmentView: React.FC = () => {
  const { createAutonomousTask } = useSara();
  const [activeTab, setActiveTab] = useState<'self-healing' | 'github' | 'vercel'>('self-healing');
  const [loopState, setLoopState] = useState<'IDLE' | 'ANALYZING' | 'DETECTED_ERROR' | 'SELF_HEALING' | 'PASSED' | 'VERIFIED'>('IDLE');
  const [deploying, setDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);

  const startSelfHealingLoop = () => {
    setLoopState('ANALYZING');
    setTimeout(() => {
      setLoopState('DETECTED_ERROR');
      setTimeout(() => {
        setLoopState('SELF_HEALING');
        setTimeout(() => {
          setLoopState('PASSED');
          setTimeout(() => {
            setLoopState('VERIFIED');
          }, 1200);
        }, 1500);
      }, 1500);
    }, 1200);
  };

  const handleVercelDeploy = () => {
    setDeploying(true);
    setDeployUrl(null);
    setTimeout(() => {
      setDeploying(false);
      setDeployUrl('https://sara-autonomous-preview.vercel.app');
    }, 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Code2 className="w-4 h-4" />
              </div>
              <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                Software Development Agent
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Autonomous self-healing code engine, Git workflow manager, and Vercel verified deployments.
            </p>
          </div>

          <div className="flex items-center space-x-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('self-healing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'self-healing'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Self-Healing Loop
            </button>
            <button
              onClick={() => setActiveTab('github')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'github'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              GitHub Agent
            </button>
            <button
              onClick={() => setActiveTab('vercel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'vercel'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Vercel Agent
            </button>
          </div>
        </div>

        {/* Tab 1: Self Healing Development Loop */}
        {activeTab === 'self-healing' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Autonomous Self-Healing Loop</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Continuous test-driven recovery: ANALYZE → TEST → FIX → RE-TEST → VERIFY.
                  </p>
                </div>
                <button
                  onClick={startSelfHealingLoop}
                  disabled={loopState !== 'IDLE' && loopState !== 'VERIFIED'}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-2 transition disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>
                    {loopState === 'IDLE' || loopState === 'VERIFIED' ? 'Run Self-Healing Diagnostic' : 'Healing in progress...'}
                  </span>
                </button>
              </div>

              {/* Loop Stepper Visualization */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 pt-2">
                {[
                  { id: 'ANALYZING', label: '1. Syntax Analysis', desc: 'Running tsc & eslint' },
                  { id: 'DETECTED_ERROR', label: '2. Error Capture', desc: 'Parsing stack trace' },
                  { id: 'SELF_HEALING', label: '3. Patch Synthesis', desc: 'Applying model fix' },
                  { id: 'PASSED', label: '4. Re-Validation', desc: 'Zero diagnostics' },
                  { id: 'VERIFIED', label: '5. Production Ready', desc: 'Verified clean' },
                ].map((step, idx) => {
                  const isCurrent = loopState === step.id;
                  const isDone =
                    (loopState === 'DETECTED_ERROR' && idx === 0) ||
                    (loopState === 'SELF_HEALING' && idx <= 1) ||
                    (loopState === 'PASSED' && idx <= 2) ||
                    (loopState === 'VERIFIED' && idx <= 4);

                  return (
                    <div
                      key={step.id}
                      className={`p-3 rounded-xl border transition ${
                        isCurrent
                          ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-md ring-1 ring-cyan-500/30'
                          : isDone
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                          : 'bg-slate-950/40 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold">{step.label}</span>
                        {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {isCurrent && <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />}
                      </div>
                      <p className="text-[10px] text-slate-400">{step.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Terminal Execution Log */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                <div className="flex items-center space-x-2 pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-500">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SARA SELF-HEALING DEBUGGER TERMINAL</span>
                </div>
                {loopState === 'IDLE' && <p className="text-slate-500">Ready to run code diagnostic.</p>}
                {loopState === 'ANALYZING' && (
                  <p className="text-cyan-400">$ tsc --noEmit: Scanning workspace files for compiler diagnostics...</p>
                )}
                {loopState === 'DETECTED_ERROR' && (
                  <>
                    <p className="text-rose-400">Error TS2345: Argument of type string is not assignable to parameter.</p>
                    <p className="text-amber-400">Captured: SARA identified type discrepancy in task payload schema.</p>
                  </>
                )}
                {loopState === 'SELF_HEALING' && (
                  <p className="text-indigo-400">
                    Applying automated patch: Generated type-safe schema refactor and re-running build...
                  </p>
                )}
                {(loopState === 'PASSED' || loopState === 'VERIFIED') && (
                  <>
                    <p className="text-emerald-400">Build passed! 0 errors, 0 warnings in 380ms.</p>
                    <p className="text-slate-300">Verification confirmed: All 14 tests passing.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: GitHub Agent */}
        {activeTab === 'github' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">Repository State: sara-core/agent-os</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                Branch: main
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Latest Commit</span>
                <p className="text-slate-200 font-mono mt-1 font-semibold truncate">feat: agent orchestrator</p>
                <span className="text-[10px] text-slate-500 font-mono">hash: 9f4a18e (Verified)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Pull Requests</span>
                <p className="text-slate-200 font-mono mt-1 font-semibold">PR #42 (Open)</p>
                <span className="text-[10px] text-emerald-400 font-mono">CI Checks Passed 4/4</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Working Tree</span>
                <p className="text-emerald-400 font-mono mt-1 font-semibold">Clean (0 uncommitted)</p>
                <span className="text-[10px] text-slate-500 font-mono">Up to date with origin</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">Destructive Git actions require user approval tier.</span>
              <button
                onClick={() => createAutonomousTask('Review open GitHub PRs and inspect CI results')}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <span>Automated PR Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Vercel Agent */}
        {activeTab === 'vercel' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <Triangle className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">Vercel Deployment Verification</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                Production: READY
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200">Production URL:</span>
                  <p className="text-cyan-400 font-mono text-xs mt-0.5">https://sara-os.vercel.app</p>
                </div>
                <button
                  onClick={handleVercelDeploy}
                  disabled={deploying}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white text-xs font-semibold flex items-center space-x-2 transition disabled:opacity-50"
                >
                  <Triangle className="w-3.5 h-3.5 fill-current" />
                  <span>{deploying ? 'Deploying & Verifying...' : 'Deploy Preview & Verify'}</span>
                </button>
              </div>

              {deployUrl && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Deployment verified with 200 OK response (latency 84ms)</span>
                  </div>
                  <a
                    href={deployUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 text-cyan-400 hover:underline font-mono text-[11px]"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
