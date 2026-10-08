import React, { useState, useEffect, useRef } from 'react';
import {
  CheckSquare,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Terminal,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Layers,
  Activity,
  FileCheck,
  RefreshCw,
  Zap,
  Check,
  Copy,
  Pause,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useSara } from '../../context/SaraContext';
import { Task, TaskStep, TaskStatus } from '../../types';
import { api } from '../../services/api';

export const TasksView: React.FC = () => {
  const {
    tasks,
    activeTaskId,
    setActiveTaskId,
    createAutonomousTask,
    executeStep,
    pendingPermission,
    resolvePermission,
    loadAllData,
  } = useSara();

  const [newGoal, setNewGoal] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [isRefreshingSteps, setIsRefreshingSteps] = useState(false);
  const [liveTaskSteps, setLiveTaskSteps] = useState<TaskStep[]>([]);
  const [liveTaskState, setLiveTaskState] = useState<{
    status: TaskStatus;
    progress: number;
    currentStepIndex: number;
    updatedAt: string;
  } | null>(null);

  // Real-time elapsed timer for running tasks
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedTask = tasks.find((t) => t.id === activeTaskId) || tasks[0];

  // Fetch real-time status updates from task_steps table endpoint
  const fetchRealTimeSteps = async (taskId: string) => {
    if (!taskId) return;
    try {
      const data = await api.getTaskSteps(taskId);
      if (data && data.steps) {
        setLiveTaskSteps(data.steps);
        setLiveTaskState({
          status: data.taskStatus as TaskStatus,
          progress: data.progress,
          currentStepIndex: data.currentStepIndex,
          updatedAt: data.updatedAt,
        });
      }
    } catch (err) {
      console.warn('Real-time step fetch error:', err);
    }
  };

  // Sync when selected task changes
  useEffect(() => {
    if (selectedTask) {
      setLiveTaskSteps(selectedTask.steps || []);
      setLiveTaskState({
        status: selectedTask.status,
        progress: selectedTask.progress,
        currentStepIndex: selectedTask.currentStepIndex,
        updatedAt: selectedTask.updatedAt,
      });
      fetchRealTimeSteps(selectedTask.id);
    }
  }, [selectedTask?.id]);

  // Real-time polling when task is running or planning or verifying
  useEffect(() => {
    const isTaskActive =
      selectedTask?.status === 'RUNNING' ||
      selectedTask?.status === 'PLANNING' ||
      selectedTask?.status === 'VERIFYING' ||
      liveTaskState?.status === 'RUNNING';

    let pollInterval: NodeJS.Timeout | null = null;
    if (selectedTask?.id && (isTaskActive || isRunningAll)) {
      pollInterval = setInterval(() => {
        fetchRealTimeSteps(selectedTask.id);
      }, 1500);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [selectedTask?.id, selectedTask?.status, liveTaskState?.status, isRunningAll]);

  // Timer counter when active
  useEffect(() => {
    const isRunning =
      selectedTask?.status === 'RUNNING' ||
      liveTaskState?.status === 'RUNNING' ||
      isRunningAll;

    if (isRunning) {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000);
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (selectedTask?.status === 'COMPLETED') {
        // Keep elapsed display stable
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [selectedTask?.status, liveTaskState?.status, isRunningAll]);

  const handleManualRefresh = async () => {
    if (!selectedTask) return;
    setIsRefreshingSteps(true);
    try {
      await fetchRealTimeSteps(selectedTask.id);
      await loadAllData();
    } finally {
      setIsRefreshingSteps(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    setIsCreating(true);
    setElapsedSeconds(0);
    try {
      const created = await createAutonomousTask(newGoal.trim());
      setNewGoal('');
      if (created) {
        setLiveTaskSteps(created.steps || []);
        setLiveTaskState({
          status: created.status,
          progress: created.progress,
          currentStepIndex: created.currentStepIndex,
          updatedAt: created.updatedAt,
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Run all remaining steps autonomously one by one
  const handleRunAllAutonomous = async () => {
    if (!selectedTask) return;
    setIsRunningAll(true);
    try {
      const stepsToRun = [...(liveTaskSteps.length > 0 ? liveTaskSteps : selectedTask.steps)];
      for (let i = 0; i < stepsToRun.length; i++) {
        const step = stepsToRun[i];
        if (step.status === 'COMPLETED') continue;

        // Execute step
        await executeStep(selectedTask.id, step.id);
        // Refresh real-time status from server
        await fetchRealTimeSteps(selectedTask.id);

        // Check if stopped by permission
        if (step.requiresPermission && !step.permissionApproved) {
          break;
        }

        // Slight visual pacing for smooth observation
        await new Promise((r) => setTimeout(r, 600));
      }
      await loadAllData();
    } finally {
      setIsRunningAll(false);
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-600/60 shadow-sm shadow-emerald-900/30';
      case 'RUNNING':
        return 'bg-cyan-950/80 text-cyan-400 border-cyan-500/80 shadow-md shadow-cyan-900/40 animate-pulse';
      case 'WAITING_FOR_PERMISSION':
        return 'bg-amber-950/80 text-amber-300 border-amber-600/70 shadow-sm shadow-amber-900/30';
      case 'FAILED':
        return 'bg-rose-950/80 text-rose-400 border-rose-600/70 shadow-sm shadow-rose-900/30';
      case 'PLANNING':
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-600/60';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const displayStatus = liveTaskState?.status || selectedTask?.status || 'PLANNING';
  const displayProgress = liveTaskState ? liveTaskState.progress : selectedTask?.progress || 0;
  const currentStepIdx = liveTaskState ? liveTaskState.currentStepIndex : selectedTask?.currentStepIndex || 0;
  const stepsList = liveTaskSteps.length > 0 ? liveTaskSteps : selectedTask?.steps || [];
  const completedStepsCount = stepsList.filter((s) => s.status === 'COMPLETED').length;

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-slate-950/40">
      {/* Left List of Tasks */}
      <div className="w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-900/40">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-100">Tasks Center</h2>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
            {tasks.length} Total
          </span>
        </div>

        {/* Create Task Input */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/50">
          <form onSubmit={handleCreateTask} className="space-y-2">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Define an autonomous goal..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!newGoal.trim() || isCreating}
              className="w-full py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isCreating ? 'Planning Task...' : 'Plan Autonomous Task'}</span>
            </button>
          </form>
        </div>

        {/* Task Cards List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
          {tasks.map((task) => {
            const isSelected = selectedTask?.id === task.id;
            const isRunning = task.status === 'RUNNING';
            return (
              <div
                key={task.id}
                onClick={() => setActiveTaskId(task.id)}
                className={`p-3 rounded-xl border cursor-pointer transition relative overflow-hidden ${
                  isSelected
                    ? 'bg-cyan-950/30 border-cyan-500/50 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                {isRunning && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400 animate-pulse"></div>
                )}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-xs font-semibold text-slate-200 line-clamp-1">{task.title}</h3>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded border font-mono font-bold uppercase flex-shrink-0 ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">{task.description}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{task.steps?.length || 0} Steps</span>
                  <div className="flex items-center space-x-1.5">
                    {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>}
                    <span className="text-cyan-400 font-semibold">{task.progress}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Task Details Inspector with Real-Time Indicators */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-950/20">
        {selectedTask ? (
          <div className="max-w-3xl space-y-6">
            {/* Header info & Real-time Progress Bar */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              {/* Active Running Top Gradient Accent */}
              {(displayStatus === 'RUNNING' || isRunningAll) && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 animate-pulse"></div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full border font-mono font-bold uppercase flex items-center space-x-1.5 ${getStatusColor(
                        displayStatus
                      )}`}
                    >
                      {displayStatus === 'RUNNING' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping mr-1"></span>
                      )}
                      <span>{displayStatus.replace('_', ' ')}</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">ID: {selectedTask.id}</span>
                  </div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-100">{selectedTask.title}</h1>
                  <p className="text-xs text-slate-400 mt-1">{selectedTask.description}</p>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Elapsed Timer when Running */}
                  {elapsedSeconds > 0 && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Elapsed</span>
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
                      </span>
                    </div>
                  )}

                  {/* Real-Time Progress Percentage Indicator */}
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[11px] text-slate-500 block">Progress</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xl font-extrabold text-cyan-400 font-mono">{displayProgress}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Real-Time Progress Bar with Glowing Pulse */}
              <div className="w-full bg-slate-950/80 border border-slate-800 rounded-full h-3 overflow-hidden p-0.5 mb-2 relative">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 transition-all duration-500 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                  style={{ width: `${Math.max(2, displayProgress)}%` }}
                />
              </div>

              {/* Progress Subtext Stats */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>
                  Completed: <strong className="text-slate-200">{completedStepsCount}</strong> of{' '}
                  <strong className="text-slate-200">{stepsList.length}</strong> steps
                </span>
                <span className="flex items-center space-x-1.5 text-cyan-400">
                  <Activity className="w-3 h-3 animate-pulse" />
                  <span>
                    {displayStatus === 'COMPLETED'
                      ? 'Execution Complete & Verified'
                      : displayStatus === 'WAITING_FOR_PERMISSION'
                      ? 'Waiting for Permission Approval'
                      : displayStatus === 'RUNNING'
                      ? `Executing Step ${currentStepIdx + 1}: ${stepsList[currentStepIdx]?.name || 'Tool Action'}`
                      : 'Ready for Autonomous Run'}
                  </span>
                </span>
              </div>

              {/* Controls bar: Run All Autonomously & Refresh Steps */}
              <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRunAllAutonomous}
                    disabled={isRunningAll || displayStatus === 'COMPLETED'}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-md shadow-cyan-900/30 transition disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{isRunningAll ? 'Running Autonomously...' : 'Run All Steps Autonomously'}</span>
                  </button>

                  <button
                    onClick={handleManualRefresh}
                    disabled={isRefreshingSteps}
                    className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition"
                    title="Fetch latest step statuses from task_steps table"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingSteps ? 'animate-spin text-cyan-400' : ''}`} />
                    <span>Sync Steps</span>
                  </button>
                </div>

                {liveTaskState?.updatedAt && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    Last sync: {new Date(liveTaskState.updatedAt).toLocaleTimeString()}
                  </span>
                )}
              </div>

              {/* Verified Result Banner if task is COMPLETED */}
              {displayStatus === 'COMPLETED' && selectedTask.result && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-200">Outcome Truthfully Verified</h4>
                    <p className="text-xs text-emerald-300/90 mt-0.5">{selectedTask.result.summary}</p>
                    {selectedTask.result.verificationDetails && (
                      <p className="text-[11px] text-slate-400 mt-1 font-mono">
                        {selectedTask.result.verificationDetails}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Waiting for Permission Alert in Inspector */}
              {displayStatus === 'WAITING_FOR_PERMISSION' && pendingPermission && (
                <div className="mt-4 p-4 rounded-xl bg-amber-950/60 border border-amber-500/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <ShieldAlert className="w-5 h-5 text-amber-400 animate-pulse flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wide">Approval Gate Engaged</h4>
                      <p className="text-xs text-amber-100/90">{pendingPermission.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => resolvePermission('ALLOW_ONCE')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow"
                    >
                      Allow Once
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
            </div>

            {/* Steps Timeline & Sub-step Executions (Fetched from task_steps) */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    task_steps Table Records
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {completedStepsCount} / {stepsList.length} Completed
                </span>
              </div>

              <div className="space-y-3">
                {stepsList.map((step, idx) => {
                  const isCurrent = idx === currentStepIdx && displayStatus === 'RUNNING';
                  const isPendingCurrent = idx === currentStepIdx && displayStatus !== 'COMPLETED';

                  return (
                    <div
                      key={step.id}
                      className={`p-4 rounded-xl border transition relative overflow-hidden ${
                        step.status === 'COMPLETED'
                          ? 'bg-slate-950/40 border-slate-800/90'
                          : step.status === 'RUNNING' || isCurrent
                          ? 'bg-cyan-950/30 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
                          : isPendingCurrent
                          ? 'bg-slate-900 border-slate-700'
                          : 'bg-slate-950/20 border-slate-800/60 opacity-80'
                      }`}
                    >
                      {/* Left status color bar */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 ${
                          step.status === 'COMPLETED'
                            ? 'bg-emerald-500'
                            : step.status === 'RUNNING' || isCurrent
                            ? 'bg-cyan-400 animate-pulse'
                            : step.status === 'FAILED'
                            ? 'bg-rose-500'
                            : 'bg-slate-700'
                        }`}
                      />

                      <div className="flex items-start justify-between gap-3 pl-1">
                        <div className="flex items-start space-x-3">
                          <div className="mt-0.5">
                            {step.status === 'COMPLETED' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : step.status === 'RUNNING' || isCurrent ? (
                              <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                            ) : step.status === 'FAILED' ? (
                              <AlertTriangle className="w-4 h-4 text-rose-400" />
                            ) : (
                              <Clock className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                              <span className="text-xs font-semibold text-slate-200">
                                {idx + 1}. {step.name}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700 font-mono">
                                {step.tool}
                              </span>
                              {step.requiresPermission && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                                  Approval Required
                                </span>
                              )}
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold uppercase ${
                                  step.status === 'COMPLETED'
                                    ? 'bg-emerald-950/80 text-emerald-400'
                                    : step.status === 'RUNNING' || isCurrent
                                    ? 'bg-cyan-950 text-cyan-300 animate-pulse'
                                    : 'bg-slate-900 text-slate-500'
                                }`}
                              >
                                {step.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{step.description}</p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {step.status === 'PENDING' && (
                            <button
                              onClick={() => executeStep(selectedTask.id, step.id)}
                              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow transition"
                            >
                              <Play className="w-3 h-3" />
                              <span>Execute Step</span>
                            </button>
                          )}
                          {step.status === 'COMPLETED' && (
                            <span className="text-xs text-emerald-400 font-mono flex items-center space-x-1">
                              <FileCheck className="w-3.5 h-3.5" />
                              <span>Verified</span>
                            </span>
                          )}
                          {step.status === 'FAILED' && (
                            <button
                              onClick={() => executeStep(selectedTask.id, step.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-900 hover:bg-rose-800 text-rose-200 border border-rose-700 text-xs font-semibold flex items-center space-x-1 transition"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Retry Step</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Step Execution Output Details */}
                      {step.output && (
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 bg-slate-950/60 rounded-lg p-2.5 text-[11px] font-mono text-slate-300">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-slate-500 text-[10px] uppercase font-sans">
                              Real-Time Step Output Verified
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono">200 OK</span>
                          </div>
                          <pre className="overflow-x-auto custom-scrollbar text-[11px] leading-relaxed">
                            {JSON.stringify(step.output, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <CheckSquare className="w-12 h-12 mb-3 text-slate-600" />
            <p className="text-sm">Select or plan an autonomous task to inspect state.</p>
          </div>
        )}
      </div>
    </div>
  );
};
