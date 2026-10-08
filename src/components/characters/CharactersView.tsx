import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Star,
  Lock,
  Unlock,
  Check,
  Search,
  Zap,
  Award,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { useSara } from '../../context/SaraContext';
import { AICharacter } from '../../types';

export const CharactersView: React.FC = () => {
  const { characters, activeCharacter, setActiveCharacterId, unlockCompanionCharacter } = useSara();
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [inspectingChar, setInspectingChar] = useState<AICharacter | null>(null);

  const filtered = characters.filter((c) => {
    if (filterRarity !== 'all' && c.rarity.toLowerCase() !== filterRarity.toLowerCase()) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'mythic':
        return 'bg-purple-950 text-purple-300 border-purple-500/60 shadow-purple-900/40';
      case 'legendary':
        return 'bg-amber-950 text-amber-300 border-amber-500/60 shadow-amber-900/40';
      case 'epic':
        return 'bg-indigo-950 text-indigo-300 border-indigo-500/60';
      case 'rare':
        return 'bg-sky-950 text-sky-300 border-sky-500/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header & Active Companion Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wider">
                Anime AI Companions Hub
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Choose your anime AI companion. Each companion has unique personalities, specialties, voice personas, and level progression.
            </p>
          </div>

          {/* Active Companion Quick Badge */}
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <img
              src={activeCharacter.avatarUrl}
              alt={activeCharacter.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-cyan-500/50"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-100">{activeCharacter.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono">
                  Lvl {activeCharacter.level}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{activeCharacter.title}</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {['all', 'rare', 'epic', 'legendary', 'mythic'].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRarity(r)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                  filterRarity === r
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companions by name..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Character Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((char) => {
            const isActive = activeCharacter.id === char.id;

            return (
              <div
                key={char.id}
                onClick={() => char.unlocked && setActiveCharacterId(char.id)}
                className={`group relative bg-slate-900/90 border rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between ${
                  isActive
                    ? 'border-cyan-500 ring-2 ring-cyan-500/40 shadow-cyan-500/10'
                    : char.unlocked
                    ? 'border-slate-800 hover:border-slate-700 hover:-translate-y-1 cursor-pointer'
                    : 'border-slate-800/60 opacity-80'
                }`}
              >
                {/* Character Artwork Header */}
                <div className="relative h-56 overflow-hidden bg-slate-950">
                  <img
                    src={char.portraitUrl}
                    alt={char.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                  {/* Rarity & Level Badges */}
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-mono font-bold uppercase shadow ${getRarityColor(char.rarity)}`}>
                      {char.rarity}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-900/80 text-cyan-300 border border-slate-700 font-mono font-bold backdrop-blur-md">
                      Level {char.level}
                    </span>
                  </div>

                  {/* Name & Title Overlay */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-base font-extrabold text-white tracking-wide">{char.name}</h3>
                    <p className="text-xs text-cyan-300 font-medium">{char.title}</p>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-400 line-clamp-2">{char.description}</p>

                  {/* Personalities / Abilities tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {char.personality.map((p, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                        {p}
                      </span>
                    ))}
                  </div>

                  {/* Footer Action */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500 font-mono">
                      Voice: <span className="text-slate-300">{char.voiceName}</span>
                    </div>

                    {isActive ? (
                      <span className="text-xs font-bold text-cyan-400 flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Active Companion</span>
                      </span>
                    ) : char.unlocked ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCharacterId(char.id);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                      >
                        Select
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          unlockCompanionCharacter(char.id);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow transition"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Unlock Companion</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
