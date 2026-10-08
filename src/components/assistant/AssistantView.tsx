import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  BrainCircuit,
  Mic,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Terminal,
  RotateCcw,
  AlertTriangle,
  Play,
  Layers,
  Check,
} from 'lucide-react';
import { useSara } from '../../context/SaraContext';

export const AssistantView: React.FC = () => {
  const {
    chatMessages,
    sendMessage,
    isGenerating,
    thinkingMode,
    setThinkingMode,
    setLiveVoiceOpen,
    tasks,
    executeStep,
    pendingPermission,
    resolvePermission,
    activeCharacter,
  } = useSara();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    const msg = input.trim();
    setInput('');
    sendMessage(msg);
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/40 overflow-hidden relative">
      {/* Top Banner if Permission is Required */}
      {pendingPermission && (
        <div className="bg-amber-950/80 border-b border-amber-500/50 p-3.5 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md z-20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Permission Approval Required
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/60 font-mono">
                  {pendingPermission.riskLevel}
                </span>
              </div>
              <p className="text-xs text-amber-100/90">{pendingPermission.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => resolvePermission('ALLOW_ONCE')}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold shadow transition"
            >
              Allow Once
            </button>
            <button
              onClick={() => resolvePermission('ALLOW_TASK')}
              className="px-3 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-700 text-xs font-medium transition"
            >
              Allow for Task
            </button>
            <button
              onClick={() => resolvePermission('DENY')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs transition"
            >
              Deny
            </button>
          </div>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          const attachedTask = msg.taskId ? tasks.find((t) => t.id === msg.taskId) : null;

          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-900/20 rounded-tr-sm'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-md shadow-slate-950/40 rounded-tl-sm'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center space-x-2.5 mb-2.5 pb-2 border-b border-slate-800/80">
                    <img
                      src={activeCharacter.avatarUrl}
                      alt={activeCharacter.name}
                      className="w-5 h-5 rounded-md object-cover ring-1 ring-cyan-400/50"
                    />
                    <span className="text-[11px] font-bold text-cyan-400 tracking-wider">
                      {activeCharacter.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                      Lvl {activeCharacter.level}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono ml-auto">{msg.timestamp}</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Attached Task Step Tracker if task was created from this message */}
                {attachedTask && (
                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 bg-slate-950/40 rounded-xl p-3 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs font-semibold text-slate-200">{attachedTask.title}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                        {attachedTask.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${attachedTask.progress}%` }}
                      ></div>
                    </div>

                    {/* Steps list */}
                    <div className="space-y-1.5">
                      {attachedTask.steps.map((st, idx) => (
                        <div
                          key={st.id}
                          className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-900/80 border border-slate-800/80"
                        >
                          <div className="flex items-center space-x-2">
                            {st.status === 'COMPLETED' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : st.status === 'RUNNING' ? (
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                            ) : st.status === 'FAILED' ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                            )}
                            <span className="text-slate-300">
                              {idx + 1}. {st.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">({st.tool})</span>
                          </div>

                          <div>
                            {st.status === 'PENDING' && idx === attachedTask.currentStepIndex && (
                              <button
                                onClick={() => executeStep(attachedTask.id, st.id)}
                                className="px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-[10px] flex items-center space-x-1"
                              >
                                <Play className="w-2.5 h-2.5" />
                                <span>Execute</span>
                              </button>
                            )}
                            {st.status === 'COMPLETED' && (
                              <span className="text-[10px] text-emerald-400 font-mono">Verified</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <span className="text-[10px] text-slate-500 mt-1 mr-1 font-mono">{msg.timestamp}</span>
              )}
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex flex-col items-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-4 max-w-md shadow-lg">
              <div className="flex items-center space-x-2.5">
                {thinkingMode ? (
                  <BrainCircuit className="w-4 h-4 text-indigo-400 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-200">
                    {thinkingMode ? 'High Thinking Mode Reasoning...' : 'SARA is analyzing & planning...'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {thinkingMode ? 'gemini-3.1-pro-preview (ThinkingLevel.HIGH)' : 'gemini-3.8-flash'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Suggestions */}
      <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-900/30">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] text-slate-500 uppercase font-semibold flex-shrink-0">Suggestions:</span>
          {[
            'Inspect workspace and verify build pipeline',
            'Deploy web app to Vercel and verify production response',
            'Research autonomous agent operating systems',
            'Create automated daily health check workflow',
          ].map((promptText, i) => (
            <button
              key={i}
              onClick={() => handleQuickPrompt(promptText)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/70 whitespace-nowrap transition"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Input Composer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              thinkingMode
                ? 'Ask a complex question or autonomous task (High Thinking Mode ON)...'
                : 'Instruct SARA: "Deploy to Vercel", "Inspect project", "Research", "Automate"...'
            }
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-4 pr-32 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition shadow-inner"
          />

          <div className="absolute right-2 flex items-center space-x-1.5">
            {/* Thinking Pill Switcher */}
            <button
              type="button"
              onClick={() => setThinkingMode(!thinkingMode)}
              className={`p-1.5 rounded-lg transition ${
                thinkingMode
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={thinkingMode ? 'High Thinking: Active (Gemini 3.1 Pro)' : 'Enable High Thinking Mode'}
            >
              <BrainCircuit className="w-4 h-4" />
            </button>

            {/* Live Voice Trigger */}
            <button
              type="button"
              onClick={() => setLiveVoiceOpen(true)}
              className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-950/50 hover:text-emerald-300 transition"
              title="Launch Gemini 3.8 Live Voice"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className={`p-2 rounded-lg font-medium transition ${
                input.trim() && !isGenerating
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
