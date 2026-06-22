import React, { useState } from 'react';
import { Leaf, Award, Heart, HelpCircle, ArrowRight, Sun, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const EcoCompanion: React.FC = () => {
  const { stats } = useAppContext();
  const [petName, setPetName] = useState(() => localStorage.getItem('sc_pet_name') || 'Eco Bud');
  const [isEditing, setIsEditing] = useState(false);
  const [companionReaction, setCompanionReaction] = useState<string | null>(null);

  const treesPlanted = Math.floor(stats.co2SavedKg / 21);
  const companionLevel = stats.level;

  const getCompanionStage = (lvl: number) => {
    if (lvl < 3) return { emoji: '🌱', title: 'Eco Seedling', desc: 'A tiny seed starting its journey toward saving the climate!' };
    if (lvl < 6) return { emoji: '🌿', title: 'Eco Sprout', desc: 'A healthy green sprout growing stronger with every activity logged.' };
    return { emoji: '🌳', title: 'Eco Guardian Tree', desc: 'A majestic shade tree providing substantial natural offset bounds.' };
  };

  const stage = getCompanionStage(companionLevel);

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (petName.trim()) {
      localStorage.setItem('sc_pet_name', petName.trim());
      setIsEditing(false);
    }
  };

  const triggerReaction = (reaction: string, text: string) => {
    setCompanionReaction(text);
    setTimeout(() => setCompanionReaction(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-gray-900 dark:text-gray-100 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-3 bg-white/95 dark:bg-gray-900/90 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <Leaf size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Your Eco Companion</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Grow and nurture your digital eco assistant by logging daily carbon offsets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Companion mascot card */}
        <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center text-center justify-between backdrop-blur-md min-h-[350px]">
          <div className="w-full">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>Stage: {stage.title}</span>
              <span>Level {companionLevel}</span>
            </div>

            {isEditing ? (
              <form onSubmit={handleNameSave} className="flex gap-2 mt-3">
                <input 
                  type="text" 
                  value={petName} 
                  onChange={e => setPetName(e.target.value)}
                  className="flex-1 p-2 border dark:border-gray-700 text-xs rounded-xl bg-white dark:bg-gray-800 outline-none"
                  autoFocus
                />
                <button type="submit" className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">Save</button>
              </form>
            ) : (
              <h2 className="text-xl font-black mt-3 flex items-center justify-center gap-2">
                {petName}
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="text-[10px] font-bold text-gray-400 hover:text-emerald-500 cursor-pointer"
                >
                  ✏️ Edit
                </button>
              </h2>
            )}
          </div>

          <div className="my-6 relative flex flex-col items-center justify-center">
            {companionReaction && (
              <div className="absolute -top-12 bg-emerald-600 text-white text-[10px] font-bold py-1.5 px-3 rounded-xl shadow-md border border-emerald-500 animate-bounce">
                {companionReaction}
              </div>
            )}
            <div className="text-7xl animate-bounce duration-1000 select-none">
              {stage.emoji}
            </div>
            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-800/80 rounded-full blur-sm mt-2"></div>
          </div>

          <div className="space-y-3 w-full">
            <div className="flex gap-2">
              <button 
                onClick={() => triggerReaction('water', '🌿 Gulp! Thank you for the water! +5 Happy points')}
                className="flex-1 bg-blue-50 dark:bg-blue-950/20 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-950/50 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                💧 Water
              </button>
              <button 
                onClick={() => triggerReaction('sun', '☀️ Ahh! Nice solar energy! +10 growth points')}
                className="flex-1 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-950/50 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                ☀️ Sunbathe
              </button>
            </div>
            <p className="text-[10px] text-gray-400 font-bold leading-normal">{stage.desc}</p>
          </div>
        </div>

        {/* Companion statistics & tree equivalent */}
        <div className="md:col-span-2 bg-white/90 dark:bg-gray-900/90 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
              Companion Ecological Impact
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/30 rounded-2xl text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Trees Planted</p>
                <p className="text-2xl font-black text-emerald-600 dark:text-teal-400">{treesPlanted} Trees</p>
                <span className="text-[8px] text-gray-400 font-bold block mt-1">Average tree absorbs 21kg/year</span>
              </div>

              <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/30 rounded-2xl text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Electricity Saved</p>
                <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.electricitySaved} kWh</p>
                <span className="text-[8px] text-gray-400 font-bold block mt-1">From offset activities</span>
              </div>

              <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/30 rounded-2xl text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Fuel Saved</p>
                <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{Math.round(stats.co2SavedKg / 2.3)} Liters</p>
                <span className="text-[8px] text-gray-400 font-bold block mt-1">~2.3kg CO₂ per liter saved</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50/50 dark:bg-gray-950/40 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
            <h4 className="font-bold text-xs text-gray-700 dark:text-gray-300">How to Grow {petName}:</h4>
            <ul className="text-xs text-gray-500 dark:text-gray-400 list-disc list-inside space-y-1">
              <li>Log activities with negative carbon impact (walking, vegetarian meals, EV rides) to save CO₂.</li>
              <li>Complete daily recommended missions to earn green XP.</li>
              <li>Every 500 XP increases your level and helps {petName} evolve stages!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
