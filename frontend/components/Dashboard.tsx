import React from 'react';
import { useAppContext } from '../context/AppContext';
import { getLevelName } from '../constants';
import { Leaf, Zap, Droplets, Trophy, TrendingDown, Activity, CheckCircle2, Circle, Flame, Globe2, DollarSign, Recycle, Settings2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tutorial } from './Tutorial';
import { DailyMotivation } from './DailyMotivation';
import { useTranslation } from '../services/translation';

const mockChartData = [
  { name: 'Mon', co2: 12 }, { name: 'Tue', co2: 10 }, { name: 'Wed', co2: 15 },
  { name: 'Thu', co2: 8 }, { name: 'Fri', co2: 9 }, { name: 'Sat', co2: 5 }, { name: 'Sun', co2: 7 },
];

export const Dashboard: React.FC = () => {
  const { profile, updateProfile, stats, missions, completeMission, isLoadingMissions } = useAppContext();
  const { t } = useTranslation();

  const handleModeToggle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateProfile({ trackerMode: e.target.value });
  };

  return (
    <div className="space-y-6 animate-fade-in relative text-gray-900 dark:text-gray-100">
      {!profile?.hasSeenTutorial && <Tutorial />}
      <DailyMotivation />

      {/* Header & Mode Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 dark:bg-gray-900/80 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-gray-850 dark:text-gray-100">{t('welcome')}, {profile?.userName}!</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('impact_today')} {profile?.country}.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-gray-50/50 dark:bg-gray-800/50 p-2 rounded-xl border border-gray-200 dark:border-gray-700 flex-1 md:flex-none">
            <Settings2 size={18} className="text-gray-500 dark:text-gray-400" />
            <select 
              className="bg-transparent font-bold text-eco-700 dark:text-teal-400 outline-none w-full cursor-pointer text-sm"
              value={profile?.trackerMode}
              onChange={handleModeToggle}
            >
              <option value="🤖 AI Automatic Tracker" className="bg-white dark:bg-gray-900">{t('ai_automatic')}</option>
              <option value="✍️ Manual Tracker" className="bg-white dark:bg-gray-900">{t('manual')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Grid - 2 rows of 4 cards */}
      <div className="grid grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={<Leaf className="text-eco-500"/>} title={t('carbon_score')} value={`${stats.carbonScore} kg`} color="bg-eco-50 dark:bg-emerald-950/40" />
        <StatCard icon={<Activity className="text-blue-500"/>} title={t('health_score')} value={`${stats.healthyLivingScore}/100`} color="bg-blue-50 dark:bg-blue-950/40" />
        <StatCard icon={<TrendingDown className="text-green-500"/>} title={t('co2_saved')} value={`${stats.co2SavedKg.toFixed(1)} kg`} color="bg-green-50 dark:bg-green-950/40" />
        <StatCard icon={<Zap className="text-yellow-500"/>} title={t('green_xp')} value={stats.greenXP.toString()} color="bg-yellow-50 dark:bg-yellow-950/40" />
        <StatCard icon={<DollarSign className="text-emerald-500"/>} title={t('money_saved')} value={`$${stats.moneySaved.toFixed(2)}`} color="bg-emerald-50 dark:bg-emerald-950/40" />
        <StatCard icon={<Zap className="text-purple-500"/>} title={t('electricity_saved')} value={`${stats.electricitySaved.toFixed(1)} kWh`} color="bg-purple-50 dark:bg-purple-950/40" />
        <StatCard icon={<Droplets className="text-cyan-500"/>} title={t('water_saved')} value={`${stats.waterSaved.toFixed(1)} L`} color="bg-cyan-50 dark:bg-cyan-950/40" />
        <StatCard icon={<Recycle className="text-orange-500"/>} title={t('waste_recycled')} value={`${stats.wasteRecycled.toFixed(1)} kg`} color="bg-orange-50 dark:bg-orange-950/40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <TrendingDown className="text-eco-500"/> {t('co2_control')}
              </h2>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#1f2937', color: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="co2" stroke="#22c55e" strokeWidth={3} dot={{r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* My Climate Contribution */}
          <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-md">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <Globe2 className="text-blue-500"/> {t('climate_contribution')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('city')} ({profile?.city !== 'Not Specified' ? profile?.city : 'Local'})</p>
                <p className="font-bold text-gray-800 dark:text-gray-100">{stats.cityContribution.toFixed(4)}%</p>
              </div>
              <div className="p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('state')} ({profile?.state !== 'Not Specified' ? profile?.state : 'Region'})</p>
                <p className="font-bold text-gray-800 dark:text-gray-100">{stats.stateContribution.toFixed(4)}%</p>
              </div>
              <div className="p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('country')} ({profile?.country})</p>
                <p className="font-bold text-gray-800 dark:text-gray-100">{stats.countryContribution.toFixed(5)}%</p>
              </div>
              <div className="p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('global')}</p>
                <p className="font-bold text-gray-800 dark:text-gray-100">{stats.globalContribution.toFixed(6)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Right Column based on Tracker Mode */}
        <div className="space-y-6">
          {profile?.trackerMode === '🤖 AI Automatic Tracker' ? (
            <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-md flex flex-col h-[350px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  🤖 {t('daily_missions')}
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {isLoadingMissions ? (
                  <div className="flex justify-center items-center h-full text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-500"></div>
                  </div>
                ) : missions.length > 0 ? (
                  missions.map(mission => (
                    <div key={mission.id} className={`p-4 rounded-xl border transition-all ${mission.completed ? 'bg-gray-50/30 border-gray-200 opacity-75 dark:border-gray-750' : 'bg-white/70 dark:bg-gray-800/70 border-eco-200 dark:border-emerald-900 hover:border-eco-400 dark:hover:border-emerald-600 shadow-sm'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-semibold text-sm ${mission.completed ? 'text-gray-500 line-through dark:text-gray-400' : 'text-gray-850 dark:text-gray-100'}`}>{mission.title}</h3>
                        <button onClick={() => completeMission(mission.id)} disabled={mission.completed} className="text-eco-500 dark:text-teal-400 hover:text-eco-700 disabled:text-gray-300 transition-colors cursor-pointer">
                          {mission.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{mission.description}</p>
                      <div className="flex gap-2 text-xs font-medium">
                        <span className="bg-green-100 dark:bg-emerald-950 text-green-700 dark:text-emerald-300 px-2 py-1 rounded-md">-{mission.expectedCo2Save}kg</span>
                        <span className="bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-md">+{mission.xpReward} XP</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-10">{t('no_missions')}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-md flex flex-col h-[350px] justify-center items-center text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Zap size={32} className="text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">{t('manual_mode_active')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('go_to_tracker_tip')}</p>
              <button 
                onClick={() => {
                  const event = new CustomEvent('navigate-tracker');
                  window.dispatchEvent(event);
                }} 
                className="bg-eco-100 dark:bg-emerald-950/70 text-eco-700 dark:text-emerald-300 hover:bg-eco-200 transition-colors font-bold py-2 px-6 rounded-xl cursor-pointer text-sm"
              >
                {t('go_to_tracker')}
              </button>
            </div>
          )}

          {/* Healthy Living Assistant */}
          <div className="bg-gradient-to-br from-blue-50/90 to-cyan-50/90 dark:from-blue-950/40 dark:to-cyan-950/40 p-6 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-900/50 backdrop-blur-md">
            <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2"><Activity size={20}/> {t('living_assistant')}</h2>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">Status: <span className="font-bold text-green-600 dark:text-emerald-400">🌱 Excellent</span></p>
            <div className="space-y-2">
              <div className="bg-white/90 dark:bg-gray-800/90 p-3 rounded-xl text-sm flex justify-between items-center shadow-sm">
                <span className="text-gray-800 dark:text-gray-100">🚶 Walking</span>
                <span className="text-green-600 dark:text-emerald-400 font-medium">⭐⭐⭐⭐⭐ Excellent</span>
              </div>
              <div className="bg-white/90 dark:bg-gray-800/90 p-3 rounded-xl text-sm flex justify-between items-center shadow-sm">
                <span className="text-gray-800 dark:text-gray-100">🚗 Petrol Car</span>
                <span className="text-red-500 dark:text-red-400 font-medium">⭐⭐ Low</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-100/70 dark:bg-blue-950/60 rounded-xl text-sm text-blue-800 dark:text-blue-200">
              <strong>🤖 AI Guide:</strong> {t('guide_tip')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }: any) => (
  <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-md flex flex-col items-center justify-center text-center gap-2 aspect-square transition-all duration-300 hover:scale-[1.03] hover:shadow-md">
    <div className={`p-3.5 rounded-full ${color} flex items-center justify-center`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div className="space-y-1">
      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{title}</p>
      <h3 className="text-xl font-black text-gray-850 dark:text-gray-100">{value}</h3>
    </div>
  </div>
);
