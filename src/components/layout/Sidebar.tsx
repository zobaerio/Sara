import React from 'react';
import {
  MessageSquare,
  Mic,
  CheckSquare,
  Zap,
  Code2,
  Globe,
  FolderGit2,
  Link2,
  Brain,
  Activity,
  ShieldCheck,
  Settings,
  Sparkles,
  ChevronRight,
  Radio,
  Cpu,
  X,
} from 'lucide-react';
import { useSara } from '../../context/SaraContext';

export type NavTab =
  | 'assistant'
  | 'voice'
  | 'tasks'
  | 'automations'
  | 'development'
  | 'research'
  | 'projects'
  | 'apps'
  | 'memory'
  | 'activity'
  | 'permissions'
  | 'characters'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, mobileOpen, setMobileOpen }) => {
  const {
    thinkingMode,
    pendingPermission,
    projects,
    activeProjectId,
    setActiveProjectId,
    tasks,
  } = useSara();

  const activeTasksCount = tasks.filter((t) => t.status === 'RUNNING' || t.status === 'PLANNING' || t.status === 'WAITING_FOR_PERMISSION').length;

  const navItems: Array<{ id: NavTab; label: string; icon: any; badge?: string | number; badgeColor?: string }> = [
    { id: 'assistant', label: 'Assistant', icon: MessageSquare },
    { id: 'voice', label: 'Live Voice', icon: Mic, badge: 'Live API', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'tasks', label: 'Task Center', icon: CheckSquare, badge: activeTasksCount > 0 ? activeTasksCount : undefined, badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    { id: 'automations', label: 'Automations', icon: Zap },
    { id: 'development', label: 'Software Agent', icon: Code2, badge: 'Git/Vercel' },
    { id: 'research', label: 'Research & Browser', icon: Globe },
    { id: 'projects', label: 'Workspaces', icon: FolderGit2 },
    { id: 'apps', label: 'Connected Apps', icon: Link2 },
    { id: 'memory', label: 'Memory Bank', icon: Brain },
    { id: 'activity', label: 'Activity Logs', icon: Activity },
    { id: 'characters', label: 'Anime Companions', icon: Sparkles, badge: 'Hub', badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
    {
      id: 'permissions',
      label: 'Security & Rules',
      icon: ShieldCheck,
      badge: pendingPermission ? '1 Alert' : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse',
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen select-none transform transition-transform duration-300 md:translate-x-0 md:static ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & SARA Title */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base tracking-wider text-slate-100">SARA</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-medium">OS 2.5</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[130px]">Autonomous Agent</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/50"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="hidden md:flex relative h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        </div>

        {/* Active Workspace Selector */}
        <div className="px-3 pt-3 pb-2">
          <label className="text-[10px] uppercase font-semibold text-slate-400 px-2 tracking-wider">Project Workspace</label>
          <div className="mt-1 relative">
            <select
              value={activeProjectId}
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  if (setMobileOpen) setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${
                      item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Engine Status Pill */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/60 flex flex-col space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Engine</span>
              </span>
              <span className="text-slate-300 font-mono text-[10px]">
                {thinkingMode ? 'Pro Thinking' : 'Flash'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Model:</span>
              <span className="text-cyan-400 font-mono text-[9px] truncate max-w-[110px]">
                {thinkingMode ? 'gemini-3.1-pro-preview' : 'gemini-3.8-flash'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

