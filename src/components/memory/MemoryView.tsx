import React, { useState } from 'react';
import {
  Brain,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Tag,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useSara } from '../../context/SaraContext';

export const MemoryView: React.FC = () => {
  const { memories, addMemoryItem, deleteMemoryItem } = useSara();
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const [newCategory, setNewCategory] = useState<string>('preference');
  const [newKey, setNewKey] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;
    setIsAdding(true);
    try {
      await addMemoryItem(newCategory, newKey.trim(), newValue.trim());
      setNewKey('');
      setNewValue('');
    } finally {
      setIsAdding(false);
    }
  };

  const filtered = memories.filter((m) => {
    if (filter !== 'all' && m.category !== filter) return false;
    if (search && !m.key.toLowerCase().includes(search.toLowerCase()) && !m.value.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Brain className="w-4 h-4" />
              </div>
              <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                SARA Long-Term Memory Engine
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              User-controlled persistent knowledge, preferences, and project facts injected into reasoning.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
            {memories.length} Stored Memories
          </span>
        </div>

        {/* Add Memory Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Store New Knowledge / Preference</span>
          </h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="preference">User Preference</option>
              <option value="personal_info">Personal Information</option>
              <option value="project_context">Project Context</option>
              <option value="workflow">Workflow Policy</option>
              <option value="fact">Fact / Knowledge</option>
            </select>
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Key: e.g. preferred_stack"
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Value / Rule definition..."
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!newKey.trim() || !newValue.trim() || isAdding}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
            >
              <span>{isAdding ? 'Saving...' : 'Add Memory'}</span>
            </button>
          </form>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {['all', 'preference', 'project_context', 'workflow', 'fact'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                  filter === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search memories..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Memory Items List */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-cyan-400 font-mono">{item.key}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700 capitalize">
                    {item.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Conf: {Math.round(item.confidence * 100)}%
                  </span>
                </div>
                <p className="text-xs text-slate-200">{item.value}</p>
                <span className="text-[10px] text-slate-500 font-mono block">
                  Last updated: {new Date(item.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <button
                onClick={() => deleteMemoryItem(item.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                title="Delete memory"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
