import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Task,
  AutomationWorkflow,
  MemoryItem,
  ProjectWorkspace,
  ConnectedApp,
  ActivityLog,
  AgentChatMessage,
  AICharacter,
} from '../types';
import { api } from '../services/api';

interface SaraContextType {
  tasks: Task[];
  activeTask: Task | undefined;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  automations: AutomationWorkflow[];
  memories: MemoryItem[];
  projects: ProjectWorkspace[];
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  connectedApps: ConnectedApp[];
  activityLogs: ActivityLog[];
  chatMessages: AgentChatMessage[];
  thinkingMode: boolean;
  setThinkingMode: (val: boolean) => void;
  isGenerating: boolean;
  liveVoiceOpen: boolean;
  setLiveVoiceOpen: (val: boolean) => void;
  systemStatus: any;
  pendingPermission: { taskId: string; stepId: string; description: string; tool: string; riskLevel: string } | null;
  characters: AICharacter[];
  activeCharacter: AICharacter;
  setActiveCharacterId: (id: string) => void;
  // Methods
  sendMessage: (text: string) => Promise<void>;
  createAutonomousTask: (goal: string) => Promise<Task>;
  executeStep: (taskId: string, stepId: string) => Promise<void>;
  resolvePermission: (decision: 'ALLOW_ONCE' | 'ALLOW_TASK' | 'ALWAYS_ALLOW' | 'DENY') => Promise<void>;
  toggleConnectedApp: (id: string) => Promise<void>;
  addMemoryItem: (category: string, key: string, value: string) => Promise<void>;
  deleteMemoryItem: (id: string) => Promise<void>;
  triggerAutomationWorkflow: (id: string) => Promise<void>;
  createNewProject: (name: string, description: string) => Promise<void>;
  unlockCompanionCharacter: (id: string) => Promise<void>;
  addCharacter: (char: AICharacter) => void;
  loadAllData: () => Promise<void>;
}

const SaraContext = createContext<SaraContextType | undefined>(undefined);

export const SaraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [automations, setAutomations] = useState<AutomationWorkflow[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [projects, setProjects] = useState<ProjectWorkspace[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('proj-1');
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [thinkingMode, setThinkingMode] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [liveVoiceOpen, setLiveVoiceOpen] = useState<boolean>(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [pendingPermission, setPendingPermission] = useState<any | null>(null);
  const [characters, setCharacters] = useState<AICharacter[]>([
    {
      id: 'char-sara',
      name: 'SARA',
      title: 'Autonomous OS Core',
      description: 'The prime personal AI operating assistant with tactical Tengu mask. Calm, analytical, and highly structured.',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGE9Ud7RZSE00TyahdVl1xQKkUkd2CmEaoPJMNb0ORFA&s',
      portraitUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGE9Ud7RZSE00TyahdVl1xQKkUkd2CmEaoPJMNb0ORFA&s',
      personality: ['Calm', 'Intelligent', 'Professional', 'Helpful'],
      speakingStyle: 'Direct, crisp, and precise operational guidance.',
      voiceName: 'Zephyr',
      level: 15,
      xp: 3450,
      rank: 'Master',
      rarity: 'Legendary',
      unlocked: true,
      abilities: ['Software Development', 'Task Planning', 'Workflow Automation', 'System Diagnostics'],
      greeting: "Hello, Commander. SARA core online. What system task shall we execute today?",
    },
    {
      id: 'char-ayla',
      name: 'Ayla',
      title: 'Lightning Strategist',
      description: 'A sharp, elegant tactical companion wielding electric purple lightning and swift execution.',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ97ZkL1mgXZaxpOHZs3vZpMBLuHadHk0iU-ocGk2IoVA&s=10',
      portraitUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ97ZkL1mgXZaxpOHZs3vZpMBLuHadHk0iU-ocGk2IoVA&s=10',
      personality: ['Confident', 'Strategic', 'Analytical', 'Swift'],
      speakingStyle: 'Poised and decisive with a touch of playful lightning metaphors.',
      voiceName: 'Kore',
      level: 12,
      xp: 2800,
      rank: 'Elite',
      rarity: 'Epic',
      unlocked: true,
      abilities: ['Deployment Verification', 'Code Refactoring', 'Speed Analysis', 'Security Audit'],
      greeting: "Ayla online. Let's make this execution flawless and swift as lightning.",
    },
    {
      id: 'char-nova',
      name: 'Nova',
      title: 'Cyber Enigma',
      description: 'An energetic and stylish cyber operative in dark tactical gear with magenta accents.',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt01zdWmPvIPxY72RZD2Fxx70-weSbsW22sOWG6OO8cg&s=10',
      portraitUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt01zdWmPvIPxY72RZD2Fxx70-weSbsW22sOWG6OO8cg&s=10',
      personality: ['Energetic', 'Playful', 'Curious', 'Bratty-Cute'],
      speakingStyle: 'Casual, upbeat, and full of developer slang.',
      voiceName: 'Fenrir',
      level: 8,
      xp: 1650,
      rank: 'Advanced',
      rarity: 'Rare',
      unlocked: true,
      abilities: ['Bug Squashing', 'Terminal Automation', 'Quick Fixes', 'API Testing'],
      greeting: "Hey-hey! Nova here ready to break some bugs and ship some features!",
    },
    {
      id: 'char-lyra',
      name: 'Lyra',
      title: 'Crimson Sovereign',
      description: 'A passionate crimson-haired noble in an exquisite white gown with gold accents.',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREgtmIgOVpFhds3_0XwFTaDVEpkgJb3RoN2uot1huvBA&s=10',
      portraitUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREgtmIgOVpFhds3_0XwFTaDVEpkgJb3RoN2uot1huvBA&s=10',
      personality: ['Passionate', 'Warm', 'Creative', 'Encouraging'],
      speakingStyle: 'Expressive, encouraging, and deeply insightful.',
      voiceName: 'Puck',
      level: 10,
      xp: 2100,
      rank: 'Elite',
      rarity: 'Epic',
      unlocked: true,
      abilities: ['Deep Research', 'Creative Writing', 'Source Synthesis', 'Brainstorming'],
      greeting: "Greetings! I am Lyra. What wonderful ideas shall we bring to life today?",
    },
    {
      id: 'char-celeste',
      name: 'Celeste',
      title: 'Starlight Oracle',
      description: 'A serene brown-haired scholarly companion with warm blue eyes and floral accessories.',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZGrXNOnXMQtIY2Su4AWWYxnk1D8D1Nr0wxx4Tp7b6lQ&s',
      portraitUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZGrXNOnXMQtIY2Su4AWWYxnk1D8D1Nr0wxx4Tp7b6lQ&s',
      personality: ['Serene', 'Wise', 'Patient', 'Enigmatic'],
      speakingStyle: 'Calm, poetic, and profoundly reassuring.',
      voiceName: 'Charon',
      level: 25,
      xp: 7500,
      rank: 'Legendary',
      rarity: 'Mythic',
      unlocked: false,
      abilities: ['Oracle Prediction', 'Architecture Planning', 'Memory Synthesis', 'Cosmic Insight'],
      greeting: "The stars align. I am Celeste, awaiting the unlock of our shared destiny.",
    },
    {
      id: 'char-kanna',
      name: 'Kanna',
      title: 'Spark Sprite',
      description: 'An energetic blonde companion with vibrant pigtails and a sporty white crop top.',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Ayvrlc_xHW_aYBbb5w544mIdr90xmu6AV9wjnGWwpw&s',
      portraitUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Ayvrlc_xHW_aYBbb5w544mIdr90xmu6AV9wjnGWwpw&s',
      personality: ['Cheerful', 'Bubbly', 'Fast-Paced'],
      speakingStyle: 'Lively and cheerful!',
      voiceName: 'Puck',
      level: 4,
      xp: 800,
      rank: 'Novice',
      rarity: 'Rare',
      unlocked: true,
      abilities: ['Quick Chat', 'Notification Reminders', 'Daily Briefs'],
      greeting: "Kanna here! Ready to boost our day with 100% positive energy!",
    },
    {
      id: 'char-kyouka',
      name: 'Kyouka',
      title: 'Vigilant Scout',
      description: 'A focused tactical scout observing from the shadows with a crimson mask.',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Y1D4r4pwVeodV3OYSAb7gd-vGBz93X2ecG6UCaeeiQ&s',
      portraitUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Y1D4r4pwVeodV3OYSAb7gd-vGBz93X2ecG6UCaeeiQ&s',
      personality: ['Vigilant', 'Quiet', 'Reliable'],
      speakingStyle: 'Short, precise, and observant.',
      voiceName: 'Kore',
      level: 18,
      xp: 4500,
      rank: 'Master',
      rarity: 'Legendary',
      unlocked: false,
      abilities: ['Stealth Monitoring', 'Log Analysis', 'Intrusion Detection'],
      greeting: "Perimeter secure. Awaiting your command, Commander.",
    },
    {
      id: 'char-selene',
      name: 'Selene',
      title: 'Lunar Phantom',
      description: 'An enigmatic twilight wanderer wielding starlight dagger techniques.',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIdXt9h6GGl7jr2PzMm0qI7nuF433aJTvmE2ePjPSXbA&s',
      portraitUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIdXt9h6GGl7jr2PzMm0qI7nuF433aJTvmE2ePjPSXbA&s',
      personality: ['Enigmatic', 'Graceful', 'Sharp'],
      speakingStyle: 'Whisper-quiet and mysterious.',
      voiceName: 'Charon',
      level: 30,
      xp: 9900,
      rank: 'Mythic',
      rarity: 'Mythic',
      unlocked: false,
      abilities: ['Shadow Cloak', 'Deep Cryptography', 'Spectral Sync'],
      greeting: "The moon watches all. I am Selene.",
    },
  ]);

  const addCharacter = (newChar: AICharacter) => {
    setCharacters((prev) => [newChar, ...prev]);
  };

  const [activeCharacterId, setActiveCharacterId] = useState<string>('char-sara');
  const activeCharacter = characters.find((c) => c.id === activeCharacterId) || characters[0];

  const [chatMessages, setChatMessages] = useState<AgentChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'sara',
      text: `Hello. I am SARA — your Autonomous Personal AI Operating Assistant.

I am equipped with autonomous task planning, multi-step tool execution, self-healing code debugging, real-time Live Voice conversation, and deep reasoning Thinking Mode (Gemini 3.1 Pro Preview).

Give me an objective:
• "Inspect the codebase, run tests, and deploy to Vercel"
• "Research the latest autonomous agent architectures and summarize verified sources"
• "Set up a daily monitoring workflow for cloud health"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const loadAllData = useCallback(async () => {
    try {
      const [statusData, tasksData, autoData, memData, projData, appsData, actData] = await Promise.all([
        api.getStatus().catch(() => null),
        api.getTasks().catch(() => []),
        api.getAutomations().catch(() => []),
        api.getMemories().catch(() => []),
        api.getProjects().catch(() => []),
        api.getConnectedApps().catch(() => []),
        api.getActivity().catch(() => []),
      ]);

      if (statusData) setSystemStatus(statusData);
      if (tasksData) {
        setTasks(tasksData);
        if (tasksData.length > 0 && !activeTaskId) {
          setActiveTaskId(tasksData[0].id);
        }
      }
      if (autoData) setAutomations(autoData);
      if (memData) setMemories(memData);
      if (projData) setProjects(projData);
      if (appsData) setConnectedApps(appsData);
      if (actData) setActivityLogs(actData);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  }, [activeTaskId]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  // Send Chat message
  const sendMessage = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    const userMsg: AgentChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const history = chatMessages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await api.sendChat({
        message: text,
        thinkingMode,
        projectId: activeProjectId,
        history,
      });

      const saraMsg: AgentChatMessage = {
        id: 'msg-' + Date.now() + 1,
        sender: 'sara',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        taskId: res.task?.id,
      };

      setChatMessages((prev) => [...prev, saraMsg]);

      if (res.task) {
        setTasks((prev) => [res.task, ...prev]);
        setActiveTaskId(res.task.id);
      }

      await loadAllData();
    } catch (error: any) {
      const errorMsg: AgentChatMessage = {
        id: 'msg-' + Date.now() + 1,
        sender: 'sara',
        text: `⚠️ Execution error: ${error.message || 'Unable to complete request.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Autonomous Task Planning
  const createAutonomousTask = async (goal: string): Promise<Task> => {
    setIsGenerating(true);
    try {
      const { task } = await api.planTask(goal, activeProjectId);
      setTasks((prev) => [task, ...prev]);
      setActiveTaskId(task.id);
      await loadAllData();
      return task;
    } finally {
      setIsGenerating(false);
    }
  };

  // Execute Step in a Task
  const executeStep = async (taskId: string, stepId: string) => {
    try {
      const result = await api.executeStep(taskId, stepId);
      if (result.status === 'WAITING_FOR_PERMISSION' && result.permissionNeeded) {
        setPendingPermission(result.permissionNeeded);
      } else {
        setPendingPermission(null);
      }

      // Update local task
      setTasks((prev) => prev.map((t) => (t.id === taskId ? result.task : t)));
      await loadAllData();
    } catch (err: any) {
      console.error('Execute step error:', err);
    }
  };

  // Handle Permission Decision
  const resolvePermission = async (decision: 'ALLOW_ONCE' | 'ALLOW_TASK' | 'ALWAYS_ALLOW' | 'DENY') => {
    if (!pendingPermission) return;
    try {
      const { taskId, stepId } = pendingPermission;
      const res = await api.makePermissionDecision(taskId, stepId, decision);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.task : t)));
      setPendingPermission(null);

      if (decision !== 'DENY') {
        // Auto-resume step execution
        await executeStep(taskId, stepId);
      }
      await loadAllData();
    } catch (err) {
      console.error('Resolve permission error:', err);
    }
  };

  const toggleConnectedApp = async (id: string) => {
    const updated = await api.toggleApp(id);
    setConnectedApps((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  const addMemoryItem = async (category: string, key: string, value: string) => {
    const item = await api.saveMemory({ category, key, value });
    setMemories((prev) => [item, ...prev.filter((m) => m.id !== item.id)]);
  };

  const deleteMemoryItem = async (id: string) => {
    await api.deleteMemory(id);
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const triggerAutomationWorkflow = async (id: string) => {
    const updated = await api.triggerAutomation(id);
    setAutomations((prev) => prev.map((a) => (a.id === id ? updated : a)));
    await loadAllData();
  };

  const createNewProject = async (name: string, description: string) => {
    const proj = await api.createProject({ name, description });
    setProjects((prev) => [proj, ...prev]);
    setActiveProjectId(proj.id);
  };

  const unlockCompanionCharacter = async (id: string) => {
    const updated = await api.unlockCharacter(id);
    setCharacters((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  return (
    <SaraContext.Provider
      value={{
        tasks,
        activeTask,
        activeTaskId,
        setActiveTaskId,
        automations,
        memories,
        projects,
        activeProjectId,
        setActiveProjectId,
        connectedApps,
        activityLogs,
        chatMessages,
        thinkingMode,
        setThinkingMode,
        isGenerating,
        liveVoiceOpen,
        setLiveVoiceOpen,
        systemStatus,
        pendingPermission,
        characters,
        activeCharacter,
        setActiveCharacterId,
        sendMessage,
        createAutonomousTask,
        executeStep,
        resolvePermission,
        toggleConnectedApp,
        addMemoryItem,
        deleteMemoryItem,
        triggerAutomationWorkflow,
        createNewProject,
        unlockCompanionCharacter,
        addCharacter,
        loadAllData,
      }}
    >
      {children}
    </SaraContext.Provider>
  );
};

export const useSara = () => {
  const context = useContext(SaraContext);
  if (!context) throw new Error('useSara must be used within a SaraProvider');
  return context;
};
