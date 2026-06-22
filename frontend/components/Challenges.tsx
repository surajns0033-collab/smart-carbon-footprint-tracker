import React from 'react';
import { Trophy, Target, Flame, CheckCircle2, Circle, AlertCircle, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Challenges: React.FC = () => {
  const { stats, missions, completeMission, isLoadingMissions } = useAppContext();

  // Streak calculations and details
  const streakRewards = [
    { target: 3, label: '3-Day Starter', bonus: '+10 XP', active: stats.streakDays >= 3 },
    { target: 7, label: '7-Day Eco Warrior', bonus: '+50 XP', active: stats.streakDays >= 7 },
    { target: 14, label: '14-Day Carbon Zero', bonus: '+150 XP', active: stats.streakDays >= 14 },
    { target: 30, label: '30-Day Climate Hero', bonus: '+500 XP', active: stats.streakDays >= 30 }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-gray-900 dark:text-gray-100">
      
      {/* Header */}
      <div className="flex items-center gap-3 bg-white/95 dark:bg-gray-900/90 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md">
        <div className="p-3 bg-yellow-100 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400 rounded-xl">
          <Trophy size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Streaks & Challenges</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Earn bonus Green XP and level titles by completing daily missions and building streaks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Streak Counter widget */}
        <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between items-center text-center backdrop-blur-md">
          <div className="space-y-1">
            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest">Active Streak</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Log activity daily to grow your streak!</p>
          </div>
          
          <div className="my-6 relative flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center text-5xl animate-pulse">
              🔥
            </div>
            <span className="absolute bottom-0 bg-orange-500 text-white font-black px-3 py-1 rounded-full text-xs shadow-md border border-orange-400">
              {stats.streakDays} Days
            </span>
          </div>

          <p className="text-xs text-orange-500 font-bold flex items-center gap-1">
            <Sparkles size={12} fill="currentColor" />
            1.2x Green XP Multiplier active!
          </p>
        </div>

        {/* Streak Milestones */}
        <div className="md:col-span-2 bg-white/90 dark:bg-gray-900/90 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 backdrop-blur-md">
          <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Flame size={16} className="text-orange-500 fill-orange-500" />
            Streak Milestones & Bonuses
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {streakRewards.map((reward, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                  reward.active 
                    ? 'bg-orange-50/40 dark:bg-orange-950/15 border-orange-200/50 dark:border-orange-900/40' 
                    : 'bg-white dark:bg-gray-950/30 border-gray-200 dark:border-gray-850 opacity-60'
                }`}
              >
                <div>
                  <h4 className={`font-bold text-xs ${reward.active ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {reward.label}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1">Target: {reward.target} consecutive days</p>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                  reward.active ? 'bg-orange-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                }`}>
                  {reward.bonus}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Daily Recommendations / Missions */}
      <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-4 flex items-center gap-2">
          <Target size={16} className="text-blue-500" />
          Your Daily Sustainability Missions
        </h3>

        <div className="space-y-4">
          {isLoadingMissions ? (
            <div className="flex justify-center items-center py-10 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          ) : missions.length > 0 ? (
            missions.map(mission => (
              <div 
                key={mission.id} 
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                  mission.completed 
                    ? 'bg-gray-50/50 dark:bg-gray-950/20 border-gray-100 dark:border-gray-900 opacity-65' 
                    : 'bg-white dark:bg-gray-950/50 border-emerald-200 dark:border-emerald-950 hover:border-emerald-300 dark:hover:border-emerald-800 shadow-sm'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                      {mission.category}
                    </span>
                    <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      mission.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-emerald-950 dark:text-emerald-400' :
                      mission.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400' :
                      'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                    }`}>
                      {mission.difficulty}
                    </span>
                  </div>
                  <h4 className={`font-bold text-sm ${mission.completed ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-white'}`}>
                    {mission.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
                    {mission.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between border-t md:border-t-0 border-gray-100 dark:border-gray-900 pt-3 md:pt-0">
                  <div className="flex gap-2 text-[10px] font-bold">
                    <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg">
                      -{mission.expectedCo2Save} kg CO₂
                    </span>
                    <span className="bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-lg">
                      +{mission.xpReward} XP
                    </span>
                  </div>
                  <button 
                    onClick={() => completeMission(mission.id)} 
                    disabled={mission.completed}
                    className="text-teal-500 dark:text-teal-400 hover:text-teal-700 disabled:text-gray-300 transition-colors cursor-pointer"
                  >
                    {mission.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-center text-xs text-gray-400 flex flex-col items-center gap-2">
              <AlertCircle size={24} />
              No active daily missions. Make sure AI Tracker Mode is active in your Settings page!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
