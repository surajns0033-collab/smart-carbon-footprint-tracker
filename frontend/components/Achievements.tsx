import React from 'react';
import { Award, ShieldCheck, Flame, Zap, CheckCircle2, Lock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Achievements: React.FC = () => {
  const { stats } = useAppContext();

  // Badges lists and status calculations
  const achievementsList = [
    {
      id: 'streak_3',
      name: '7-Day Streak',
      desc: 'Maintain a 7-day daily activity logging streak.',
      icon: '🔥',
      unlocked: stats.streakDays >= 7,
      progress: stats.streakDays,
      target: 7
    },
    {
      id: 'co2_100',
      name: 'Green Commuter',
      desc: 'Save a total of 50kg CO₂ emissions.',
      icon: '🚗',
      unlocked: stats.co2SavedKg >= 50,
      progress: Math.round(stats.co2SavedKg),
      target: 50
    },
    {
      id: 'elec_saved',
      name: 'Energy Saver',
      desc: 'Save 100 kWh of home energy.',
      icon: '⚡',
      unlocked: stats.electricitySaved >= 100,
      progress: stats.electricitySaved,
      target: 100
    },
    {
      id: 'waste_recycled',
      name: 'Waste Reducer',
      desc: 'Recycle a total of 15kg waste.',
      icon: '🗑️',
      unlocked: stats.wasteRecycled >= 15,
      progress: Math.round(stats.wasteRecycled),
      target: 15
    },
    {
      id: 'level_5',
      name: 'Eco Explorer',
      desc: 'Reach green level 4.',
      icon: '🌍',
      unlocked: stats.level >= 4,
      progress: stats.level,
      target: 4
    },
    {
      id: 'xp_5000',
      name: 'Climate Champion',
      desc: 'Accumulate a total of 1,000 Green XP.',
      icon: '🏆',
      unlocked: stats.greenXP >= 1000,
      progress: stats.greenXP,
      target: 1000
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-gray-900 dark:text-gray-100">
      
      {/* Header */}
      <div className="flex items-center gap-3 bg-white/95 dark:bg-gray-900/90 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <Award size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Achievements & Unlocks</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Earn climate ribbons and medals by completing targets and offsets.</p>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {achievementsList.map((badge, idx) => {
          const progressPct = Math.min(100, Math.round((badge.progress / badge.target) * 100));
          return (
            <div 
              key={badge.id}
              className={`p-6 rounded-2xl border shadow-sm transition-all flex flex-col justify-between backdrop-blur-md relative overflow-hidden ${
                badge.unlocked
                  ? 'bg-white/95 dark:bg-gray-900/90 border-emerald-200 dark:border-emerald-950 hover:border-emerald-400'
                  : 'bg-white/60 dark:bg-gray-950/40 border-gray-200 dark:border-gray-850 opacity-70'
              }`}
            >
              {badge.unlocked && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg flex items-center gap-0.5 shadow-sm">
                  <ShieldCheck size={10} /> Unlocked
                </div>
              )}

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-2xl relative shadow-inner">
                  {badge.icon}
                  {!badge.unlocked && (
                    <div className="absolute -bottom-1 -right-1 bg-gray-500 text-white p-0.5 rounded-full border border-white">
                      <Lock size={8} />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-gray-800 dark:text-white">{badge.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-normal">{badge.desc}</p>
                </div>
              </div>

              <div className="space-y-1.5 mt-6">
                <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Progress</span>
                  <span>{badge.progress} / {badge.target}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${badge.unlocked ? 'bg-emerald-500' : 'bg-gray-400'}`} style={{ width: `${progressPct}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
