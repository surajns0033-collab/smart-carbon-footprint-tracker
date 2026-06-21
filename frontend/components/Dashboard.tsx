import React from 'react';
import { useAppContext } from '../context/AppContext';
import { getLevelName } from '../constants';
import {
  Leaf, Zap, Droplets, TrendingDown, Activity, CheckCircle2, Circle,
  Globe2, DollarSign, Recycle, Settings2, ChevronLeft, ChevronRight,
  Flame, Trophy, Wind, TreePine, Bolt, ArrowUp, ArrowDown, Target
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';
import { Tutorial } from './Tutorial';
import { DailyMotivation } from './DailyMotivation';
import { useTranslation } from '../services/translation';

const mockChartData = [
  { name: 'Mon', co2: 12, saved: 4 },
  { name: 'Tue', co2: 10, saved: 6 },
  { name: 'Wed', co2: 15, saved: 2 },
  { name: 'Thu', co2: 8,  saved: 9 },
  { name: 'Fri', co2: 9,  saved: 7 },
  { name: 'Sat', co2: 5,  saved: 11 },
  { name: 'Sun', co2: 7,  saved: 8 },
];

const slides = [
  [
    { key: 'carbon',      icon: Leaf,       label: 'carbon_score',      color: 'from-emerald-400 to-green-600',   bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', iconColor: 'text-emerald-500', progressColor: '#22c55e', progress: 65 },
    { key: 'health',      icon: Activity,   label: 'health_score',      color: 'from-blue-400 to-blue-600',       bg: 'bg-blue-500/10 dark:bg-blue-500/20',       iconColor: 'text-blue-500',    progressColor: '#3b82f6', progress: 50 },
    { key: 'co2saved',    icon: TrendingDown,label: 'co2_saved',        color: 'from-green-400 to-teal-600',      bg: 'bg-teal-500/10 dark:bg-teal-500/20',       iconColor: 'text-teal-500',    progressColor: '#14b8a6', progress: 42 },
    { key: 'xp',          icon: Zap,        label: 'green_xp',          color: 'from-yellow-400 to-orange-500',   bg: 'bg-yellow-500/10 dark:bg-yellow-500/20',   iconColor: 'text-yellow-500',  progressColor: '#f59e0b', progress: 78 },
  ],
  [
    { key: 'money',       icon: DollarSign, label: 'money_saved',       color: 'from-lime-400 to-emerald-600',    bg: 'bg-lime-500/10 dark:bg-lime-500/20',       iconColor: 'text-lime-500',    progressColor: '#84cc16', progress: 33 },
    { key: 'electricity', icon: Bolt,       label: 'electricity_saved', color: 'from-purple-400 to-violet-600',   bg: 'bg-purple-500/10 dark:bg-purple-500/20',   iconColor: 'text-purple-500',  progressColor: '#a855f7', progress: 55 },
    { key: 'water',       icon: Droplets,   label: 'water_saved',       color: 'from-cyan-400 to-blue-600',       bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',       iconColor: 'text-cyan-500',    progressColor: '#06b6d4', progress: 60 },
    { key: 'waste',       icon: Recycle,    label: 'waste_recycled',    color: 'from-orange-400 to-red-500',      bg: 'bg-orange-500/10 dark:bg-orange-500/20',   iconColor: 'text-orange-500',  progressColor: '#f97316', progress: 78 },
  ],
];

export const Dashboard: React.FC = () => {
  const { profile, updateProfile, stats, missions, completeMission, isLoadingMissions, viewMode } = useAppContext();
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const isMobile = viewMode === 'mobile';

  const getStatValue = (key: string): string => {
    switch (key) {
      case 'carbon':      return `${stats.carbonScore} kg`;
      case 'health':      return `${stats.healthyLivingScore}/100`;
      case 'co2saved':    return `${stats.co2SavedKg.toFixed(1)} kg`;
      case 'xp':          return `${stats.greenXP} XP`;
      case 'money':       return `$${stats.moneySaved.toFixed(2)}`;
      case 'electricity': return `${stats.electricitySaved.toFixed(1)} kWh`;
      case 'water':       return `${stats.waterSaved.toFixed(1)} L`;
      case 'waste':       return `${stats.wasteRecycled.toFixed(1)} kg`;
      default:            return '0';
    }
  };

  const getSubtitle = (key: string): string => {
    switch (key) {
      case 'carbon':      return 'Daily Target: 500 kg';
      case 'health':      return 'Status: Excellent';
      case 'co2saved':    return '+14.2% this week';
      case 'xp':          return `Level ${stats.level} Active`;
      case 'money':       return 'Lifetime Savings';
      case 'electricity': return 'Equivalent Clean Energy';
      case 'water':       return 'Household Conserved';
      case 'waste':       return 'Recycling Ratio: 78%';
      default:            return '';
    }
  };

  const handleModeToggle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateProfile({ trackerMode: e.target.value });
  };

  const currentCards = slides[currentSlide];

  return (
    <div className="flex flex-col gap-4 animate-fade-in text-gray-900 dark:text-gray-100 h-full">
      {!profile?.hasSeenTutorial && <Tutorial />}

      {/* ── Hero Header Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-800 p-5 shadow-xl">
        {/* decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-sm" />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/10 blur-sm" />
        <div className="absolute top-4 right-20 w-16 h-16 rounded-full bg-white/10" />

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🌿</span>
              <h1 className="text-xl md:text-2xl font-black text-white drop-shadow">
                {t('welcome')}, {profile?.userName}!
              </h1>
            </div>
            <p className="text-emerald-100 text-sm">{t('impact_today')} <span className="font-semibold text-white">{profile?.country}</span></p>
            {/* Streak badge */}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                <Flame size={12} className="text-orange-300" /> {stats.streakDays} Day Streak
              </span>
              <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                <Trophy size={12} className="text-yellow-300" /> {getLevelName(stats.level)}
              </span>
              <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                <TreePine size={12} className="text-green-300" /> {stats.treesEquivalent ?? 0} Trees Saved
              </span>
            </div>
          </div>

          {/* Mode selector */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/30 min-w-[180px]">
            <Settings2 size={16} className="text-white shrink-0" />
            <select
              className="bg-transparent font-bold text-white outline-none w-full cursor-pointer text-sm"
              value={profile?.trackerMode}
              onChange={handleModeToggle}
            >
              <option value="🤖 AI Automatic Tracker" className="bg-gray-800 text-white">{t('ai_automatic')}</option>
              <option value="✍️ Manual Tracker"        className="bg-gray-800 text-white">{t('manual')}</option>
            </select>
          </div>
        </div>

        {/* XP Progress bar */}
        <div className="relative mt-4">
          <div className="flex justify-between text-xs text-white/80 mb-1">
            <span>XP Progress to Level {stats.level + 1}</span>
            <span>{stats.greenXP} / {(stats.level) * 500} XP</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (stats.greenXP / ((stats.level) * 500)) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Daily Motivation (compact) ── */}
      <DailyMotivation />

      {/* ── Scorecard Carousel ── */}
      <div className="relative px-6">
        <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
          {currentCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                className={`relative overflow-hidden rounded-2xl border border-white/20 dark:border-gray-700/60 p-4 flex flex-col gap-3 shadow-lg backdrop-blur-md bg-white/80 dark:bg-gray-900/80 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group`}
              >
                {/* gradient accent strip */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} rounded-t-2xl`} />

                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${card.bg}`}>
                    <Icon size={20} className={card.iconColor} />
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                    <ArrowUp size={9} /> +{card.progress}%
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">{t(card.label)}</p>
                  <h3 className="text-xl font-black text-gray-900 dark:text-gray-100">{getStatValue(card.key)}</h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{getSubtitle(card.key)}</p>
                </div>

                {/* mini progress bar */}
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${card.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={() => setCurrentSlide(p => p === 0 ? 1 : 0)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg p-2 rounded-full hover:scale-110 transition-all cursor-pointer z-10"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => setCurrentSlide(p => p === 0 ? 1 : 0)}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg p-2 rounded-full hover:scale-110 transition-all cursor-pointer z-10"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-3">
          {[0, 1].map(i => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-6 bg-emerald-500' : 'w-2 bg-gray-300 dark:bg-gray-700'}`}
            />
          ))}
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className={`grid gap-4 flex-1 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>

        {/* ── CO2 Chart (spans 2 cols on desktop) ── */}
        <div className={`${isMobile ? '' : 'col-span-2'} bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col gap-3`}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <TrendingDown className="text-emerald-500" size={18} /> {t('co2_control')}
            </h2>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><span className="w-3 h-1 bg-emerald-500 rounded-full inline-block" /> Emitted</span>
              <span className="flex items-center gap-1"><span className="w-3 h-1 bg-blue-400 rounded-full inline-block" /> Saved</span>
            </div>
          </div>
          <div className="flex-1 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="savedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb44" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#111827', color: '#fff', fontSize: 12 }}
                  cursor={{ stroke: '#22c55e44', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="co2"   stroke="#22c55e" strokeWidth={2.5} fill="url(#co2Grad)"   dot={false} activeDot={{ r: 5 }} />
                <Area type="monotone" dataKey="saved" stroke="#60a5fa" strokeWidth={2.5} fill="url(#savedGrad)" dot={false} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Daily Missions / Right Column ── */}
        <div className="flex flex-col gap-4">
          {profile?.trackerMode === '🤖 AI Automatic Tracker' ? (
            <div className="flex-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col">
              <h2 className="text-base font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100 mb-3">
                🤖 {t('daily_missions')}
              </h2>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {isLoadingMissions ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
                  </div>
                ) : missions.length > 0 ? (
                  missions.map(mission => (
                    <div key={mission.id} className={`p-3 rounded-xl border transition-all ${mission.completed ? 'opacity-50 bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700' : 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 hover:border-emerald-400'}`}>
                      <div className="flex justify-between items-start">
                        <h3 className={`font-semibold text-sm ${mission.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}>{mission.title}</h3>
                        <button onClick={() => completeMission(mission.id)} disabled={mission.completed} className="text-emerald-500 hover:text-emerald-700 disabled:text-gray-300 transition-colors cursor-pointer ml-2 shrink-0">
                          {mission.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">{mission.description}</p>
                      <div className="flex gap-2 text-[10px] font-bold">
                        <span className="bg-green-100 dark:bg-emerald-950 text-green-700 dark:text-emerald-300 px-2 py-0.5 rounded-md">-{mission.expectedCo2Save}kg CO₂</span>
                        <span className="bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-md">+{mission.xpReward} XP</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center mt-6">{t('no_missions')}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col justify-center items-center text-center gap-3">
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Zap size={28} className="text-yellow-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100">{t('manual_mode_active')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('go_to_tracker_tip')}</p>
              </div>
              <button
                onClick={() => { window.dispatchEvent(new CustomEvent('navigate-tracker')); }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-xl cursor-pointer text-sm transition-colors shadow-md"
              >
                {t('go_to_tracker')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Row: Climate Contribution + Health Assistant ── */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>

        {/* Climate Contribution */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <h2 className="text-base font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <Globe2 className="text-blue-500" size={18} /> {t('climate_contribution')}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: `🏙️ ${profile?.city !== 'Not Specified' ? profile?.city : 'City'}`, value: `${stats.cityContribution.toFixed(4)}%`, color: 'from-blue-400 to-blue-600' },
              { label: `🗺️ ${profile?.state !== 'Not Specified' ? profile?.state : 'State'}`, value: `${stats.stateContribution.toFixed(4)}%`, color: 'from-purple-400 to-purple-600' },
              { label: `🌏 ${profile?.country}`, value: `${stats.countryContribution.toFixed(5)}%`, color: 'from-emerald-400 to-teal-600' },
              { label: '🌍 Global', value: `${stats.globalContribution.toFixed(6)}%`, color: 'from-orange-400 to-red-500' },
            ].map(item => (
              <div key={item.label} className="relative overflow-hidden p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 text-center">
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.color}`} />
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
                <p className="text-lg font-black text-gray-800 dark:text-gray-100">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Healthy Living Assistant */}
        <div className="bg-gradient-to-br from-blue-50/90 to-cyan-50/90 dark:from-blue-950/40 dark:to-cyan-950/40 backdrop-blur-md rounded-2xl border border-blue-100 dark:border-blue-900/50 shadow-sm p-5">
          <h2 className="text-base font-bold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
            <Activity size={18} /> {t('living_assistant')}
          </h2>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
            Status: <span className="font-bold text-emerald-600 dark:text-emerald-400">🌱 Excellent</span>
          </p>
          <div className="space-y-2">
            {[
              { label: '🚶 Walking',    rating: 5, color: 'bg-emerald-500' },
              { label: '🚴 Cycling',   rating: 4, color: 'bg-blue-500' },
              { label: '🚗 Petrol Car',rating: 2, color: 'bg-red-400' },
              { label: '♻️ Recycling', rating: 4, color: 'bg-teal-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/70 p-2.5 rounded-xl">
                <span className="text-sm text-gray-700 dark:text-gray-200 w-28 shrink-0">{item.label}</span>
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.rating / 5) * 100}%` }} />
                </div>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-5">{item.rating}/5</span>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-blue-100/70 dark:bg-blue-950/60 rounded-xl text-xs text-blue-800 dark:text-blue-200">
            <strong>🤖 AI Guide:</strong> {t('guide_tip')}
          </div>
        </div>
      </div>
    </div>
  );
};
