export type TaskStatus =
  | 'PLANNING'
  | 'WAITING_FOR_PERMISSION'
  | 'RUNNING'
  | 'VERIFYING'
  | 'COMPLETED'
  | 'FAILED'
  | 'BLOCKED'
  | 'CANCELLED';

export type PermissionLevel = 'SAFE' | 'APPROVAL_REQUIRED' | 'ALWAYS_EXPLICIT';

export type PermissionDecision = 'ALLOW_ONCE' | 'ALLOW_TASK' | 'ALWAYS_ALLOW' | 'DENY' | 'CANCEL';

export interface TaskStep {
  id: string;
  name: string;
  tool: string;
  description: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  requiresPermission: boolean;
  permissionApproved?: boolean;
  input?: Record<string, any>;
  output?: any;
  error?: string;
  startTime?: string;
  endTime?: string;
  recoveryAttempts?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
  steps: TaskStep[];
  currentStepIndex: number;
  result?: {
    summary: string;
    verified: boolean;
    verificationDetails?: string;
    artifacts?: Array<{ name: string; url?: string; content?: string }>;
  };
  error?: {
    code: string;
    message: string;
    recoverable: boolean;
    recoveryAttempts?: number;
  };
  projectId?: string;
}

export interface PermissionRequest {
  id: string;
  taskId: string;
  stepId: string;
  action: string;
  tool: string;
  description: string;
  riskLevel: PermissionLevel;
  params: Record<string, any>;
  timestamp: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
}

export interface ConnectedApp {
  id: string;
  name: string;
  category: 'Google' | 'Development' | 'Productivity' | 'Communication';
  icon: string;
  description: string;
  connected: boolean;
  account?: string;
  scopes: string[];
  lastSync?: string;
  config?: Record<string, string>;
}

export interface MemoryItem {
  id: string;
  category: 'preference' | 'personal_info' | 'project_context' | 'workflow' | 'fact';
  key: string;
  value: string;
  confidence: number;
  updatedAt: string;
}

export interface ProjectWorkspace {
  id: string;
  name: string;
  description: string;
  githubRepo?: string;
  vercelDeployment?: string;
  environment: 'development' | 'staging' | 'production';
  activeTasksCount: number;
  createdAt: string;
  filesCount: number;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: {
    type: 'SCHEDULE' | 'GITHUB_EVENT' | 'WEBHOOK' | 'APP_EVENT' | 'MANUAL';
    schedule?: string; // cron expression
    event?: string;
  };
  condition?: string;
  actions: Array<{
    tool: string;
    description: string;
    params: Record<string, any>;
  }>;
  lastRun?: {
    timestamp: string;
    status: 'SUCCESS' | 'FAILED';
    output: string;
  };
  nextRun?: string;
  runsCount: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'TOOL_EXECUTION' | 'PERMISSION_GRANT' | 'DEPLOYMENT' | 'GITHUB' | 'AUTOMATION' | 'SYSTEM_ERROR' | 'AI_REASONING';
  title: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';
  metadata?: Record<string, any>;
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'sara';
  text: string;
  timestamp: string;
  thinking?: string; // Content of thinking / reasoning
  taskId?: string;
  toolCall?: {
    name: string;
    params: Record<string, any>;
    status: 'calling' | 'done' | 'failed';
    result?: any;
  };
  permissionRequest?: PermissionRequest;
  artifacts?: Array<{ title: string; content: string; type: string }>;
}

export interface ToolDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  permissionLevel: PermissionLevel;
  parameters: Record<string, { type: string; description: string; required?: boolean }>;
}

export interface AICharacter {
  id: string;
  name: string;
  title: string;
  description: string;
  avatarUrl: string;
  portraitUrl: string;
  personality: string[];
  speakingStyle: string;
  voiceName: string; // 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr'
  level: number;
  xp: number;
  rank: string; // 'Novice' | 'Companion' | 'Advanced' | 'Elite' | 'Master' | 'Legendary'
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  unlocked: boolean;
  abilities: string[];
  greeting: string;
}

