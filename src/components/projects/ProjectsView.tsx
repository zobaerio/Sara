import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  GitBranch,
  Triangle,
  ExternalLink,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useSara } from '../../context/SaraContext';

export const ProjectsView: React.FC = () => {
  const { projects, activeProjectId, setActiveProjectId, createNewProject } = useSara();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsCreating(true);
    try {
      await createNewProject(name.trim(), desc.trim());
      setName('');
      setDesc('');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                Project Workspaces
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Isolated context workspaces with dedicated GitHub repos, Vercel deployments, and files.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
            {projects.length} Workspaces
          </span>
        </div>

        {/* Create Project Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Create New Project Workspace</span>
          </h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project Name: e.g. Smart Khulna City..."
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description of the workspace..."
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!name.trim() || isCreating}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
            >
              <span>{isCreating ? 'Creating...' : 'Create Workspace'}</span>
            </button>
          </form>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => {
            const isActive = proj.id === activeProjectId;
            return (
              <div
                key={proj.id}
                className={`bg-slate-900/80 border rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition ${
                  isActive ? 'border-cyan-500 ring-1 ring-cyan-500/20' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100 flex items-center space-x-2">
                        <span>{proj.name}</span>
                        {isActive && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                            ACTIVE
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{proj.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    {proj.githubRepo && (
                      <div className="flex items-center space-x-2 text-slate-300 font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                        <GitBranch className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{proj.githubRepo}</span>
                      </div>
                    )}
                    {proj.vercelDeployment && (
                      <div className="flex items-center space-x-2 text-slate-300 font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                        <Triangle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{proj.vercelDeployment}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">{proj.filesCount} workspace files</span>
                  {!isActive && (
                    <button
                      onClick={() => setActiveProjectId(proj.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                    >
                      Switch to Workspace
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
