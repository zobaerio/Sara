import { Task, AutomationWorkflow, MemoryItem, ProjectWorkspace, ConnectedApp, ActivityLog, AICharacter } from '../types';

export const api = {
  async getStatus() {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Failed to fetch status');
    return res.json();
  },

  async sendChat(params: {
    message: string;
    thinkingMode: boolean;
    projectId?: string;
    history?: Array<{ sender: string; text: string }>;
  }) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || 'Chat request failed');
    }
    return res.json();
  },

  async planTask(goal: string, projectId?: string): Promise<{ task: Task }> {
    const res = await fetch('/api/agent/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, projectId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Plan failed' }));
      throw new Error(err.error || 'Failed to generate plan');
    }
    return res.json();
  },

  async executeStep(taskId: string, stepId: string, forceApproval: boolean = false): Promise<{ status: string; task: Task; permissionNeeded?: any }> {
    const res = await fetch('/api/agent/execute-step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, stepId, forceApproval }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Execution failed' }));
      throw new Error(err.error || 'Failed to execute step');
    }
    return res.json();
  },

  async makePermissionDecision(taskId: string, stepId: string, decision: 'ALLOW_ONCE' | 'ALLOW_TASK' | 'ALWAYS_ALLOW' | 'DENY'): Promise<{ task: Task }> {
    const res = await fetch('/api/permissions/decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, stepId, decision }),
    });
    if (!res.ok) throw new Error('Permission decision failed');
    return res.json();
  },

  async getTasks(): Promise<Task[]> {
    const res = await fetch('/api/tasks');
    return res.json();
  },

  async getTask(id: string): Promise<Task> {
    const res = await fetch(`/api/tasks/${id}`);
    if (!res.ok) throw new Error('Failed to fetch task');
    return res.json();
  },

  async getTaskSteps(id: string): Promise<{
    taskId: string;
    taskStatus: string;
    progress: number;
    currentStepIndex: number;
    steps: any[];
    updatedAt: string;
  }> {
    const res = await fetch(`/api/tasks/${id}/steps`);
    if (!res.ok) throw new Error('Failed to fetch task steps');
    return res.json();
  },

  async createTask(data: { title: string; description: string; projectId?: string }): Promise<Task> {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async getAutomations(): Promise<AutomationWorkflow[]> {
    const res = await fetch('/api/automations');
    return res.json();
  },

  async createAutomation(data: Partial<AutomationWorkflow>): Promise<AutomationWorkflow> {
    const res = await fetch('/api/automations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async triggerAutomation(id: string): Promise<AutomationWorkflow> {
    const res = await fetch(`/api/automations/${id}/trigger`, { method: 'POST' });
    return res.json();
  },

  async getMemories(): Promise<MemoryItem[]> {
    const res = await fetch('/api/memory');
    return res.json();
  },

  async saveMemory(data: { category: string; key: string; value: string }): Promise<MemoryItem> {
    const res = await fetch('/api/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteMemory(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/memory/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async getProjects(): Promise<ProjectWorkspace[]> {
    const res = await fetch('/api/projects');
    return res.json();
  },

  async createProject(data: Partial<ProjectWorkspace>): Promise<ProjectWorkspace> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getConnectedApps(): Promise<ConnectedApp[]> {
    const res = await fetch('/api/apps');
    return res.json();
  },

  async toggleApp(id: string): Promise<ConnectedApp> {
    const res = await fetch('/api/apps/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return res.json();
  },

  async getActivity(): Promise<ActivityLog[]> {
    const res = await fetch('/api/activity');
    return res.json();
  },

  async getCharacters(): Promise<AICharacter[]> {
    const res = await fetch('/api/characters');
    return res.json();
  },

  async unlockCharacter(id: string): Promise<AICharacter> {
    const res = await fetch('/api/characters/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return res.json();
  },
};
