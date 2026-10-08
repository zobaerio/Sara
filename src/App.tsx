import React, { useState } from 'react';
import { SaraProvider, useSara } from './context/SaraContext';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AssistantView } from './components/assistant/AssistantView';
import { TasksView } from './components/tasks/TasksView';
import { AutomationsView } from './components/automations/AutomationsView';
import { DevelopmentView } from './components/development/DevelopmentView';
import { BrowserResearchView } from './components/browser/BrowserResearchView';
import { ProjectsView } from './components/projects/ProjectsView';
import { ConnectedAppsView } from './components/apps/ConnectedAppsView';
import { MemoryView } from './components/memory/MemoryView';
import { ActivityView } from './components/activity/ActivityView';
import { PermissionsView } from './components/permissions/PermissionsView';
import { SettingsView } from './components/settings/SettingsView';
import { CharactersView } from './components/characters/CharactersView';
import { LiveVoiceModal } from './components/voice/LiveVoiceModal';
import { Mic, Sparkles, Radio } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('assistant');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { liveVoiceOpen, setLiveVoiceOpen } = useSara();

  const getTitle = () => {
    switch (currentTab) {
      case 'assistant':
        return 'SARA Autonomous Agent';
      case 'voice':
        return 'Gemini 3.8 Live Voice';
      case 'tasks':
        return 'Task Operating Center';
      case 'automations':
        return 'Autonomous Workflows';
      case 'development':
        return 'Software Development Agent';
      case 'research':
        return 'Research & Browser Agent';
      case 'projects':
        return 'Project Workspaces';
      case 'apps':
        return 'Connected Applications';
      case 'memory':
        return 'Persistent Memory Engine';
      case 'activity':
        return 'Activity & Telemetry Logs';
      case 'permissions':
        return 'Permissions & Security';
      case 'characters':
        return 'Anime AI Companions Hub';
      case 'settings':
        return 'Engine Settings';
      default:
        return 'SARA Platform';
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          title={getTitle()}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {currentTab === 'assistant' && <AssistantView />}
          {currentTab === 'voice' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950/60 text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/20">
                <Radio className="w-10 h-10 animate-pulse" />
              </div>
              <div className="max-w-md space-y-2">
                <h2 className="text-xl font-bold text-slate-100">Real-Time Duplex Voice with SARA</h2>
                <p className="text-xs text-slate-400">
                  Powered by <span className="text-emerald-400 font-mono">gemini-3.8-live</span>. Speak naturally and get immediate spoken audio responses with real-time interruption detection.
                </p>
              </div>
              <button
                onClick={() => setLiveVoiceOpen(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center space-x-2.5 transition"
              >
                <Mic className="w-5 h-5" />
                <span>Launch Live Voice Conversation</span>
              </button>
            </div>
          )}
          {currentTab === 'tasks' && <TasksView />}
          {currentTab === 'automations' && <AutomationsView />}
          {currentTab === 'development' && <DevelopmentView />}
          {currentTab === 'research' && <BrowserResearchView />}
          {currentTab === 'projects' && <ProjectsView />}
          {currentTab === 'apps' && <ConnectedAppsView />}
          {currentTab === 'memory' && <MemoryView />}
          {currentTab === 'activity' && <ActivityView />}
          {currentTab === 'permissions' && <PermissionsView />}
          {currentTab === 'characters' && <CharactersView />}
          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Real-Time Live Voice Duplex Modal */}
      <LiveVoiceModal isOpen={liveVoiceOpen} onClose={() => setLiveVoiceOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <SaraProvider>
      <AppContent />
    </SaraProvider>
  );
}
