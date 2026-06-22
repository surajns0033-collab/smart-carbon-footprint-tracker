import React, { useState } from 'react';
import { Target, Leaf, TrendingDown, Info, Shield, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MOCK_GOV_TARGETS } from '../constants';

export const Goals: React.FC = () => {
  const { profile, stats } = useAppContext();
  const country = profile?.country || 'India';
  const city = profile?.city || 'Mumbai';

  const nationalTarget = MOCK_GOV_TARGETS[country] || MOCK_GOV_TARGETS['India'];

  // Personal carbon footprint projection calculator state
  const [weeklyMeatless, setWeeklyMeatless] = useState(2);
  const [weeklyUnplugHours, setWeeklyUnplugHours] = useState(10);
  const [transitReplaceKm, setTransitReplaceKm] = useState(20);

  // Dynamic permutation calculations
  const projectedCo2Savings = (weeklyMeatless * 1.5) + (weeklyUnplugHours * 0.1) + (transitReplaceKm * 0.25);
  const newProjectedScore = Math.max(0, Math.round(stats.carbonScore - projectedCo2Savings));
  const newXPProjected = Math.round(stats.greenXP + (weeklyMeatless * 10) + (weeklyUnplugHours * 2) + (transitReplaceKm * 5));

  const progressPct = Math.min(100, Math.max(0, Math.round((1 - stats.carbonScore / 1000) * 100)));

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-gray-900 dark:text-gray-100">
      
      {/* Header */}
      <div className="flex items-center gap-3 bg-white/95 dark:bg-gray-900/90 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <Target size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Climate Goals & Targets</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Align your personal sustainability journey with local and global net-zero milestones.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Personal Goals Target Progress */}
        <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 backdrop-blur-md">
          <h3 className="font-bold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Leaf size={16} className="text-emerald-500" />
            Your Net Zero Journey
          </h3>
          
          <div className="text-center py-4">
            <span className="text-5xl font-black text-emerald-600 dark:text-teal-400">{progressPct}%</span>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Towards Net-Zero Target</p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Current Score:</span>
              <span className="font-extrabold">{stats.carbonScore} / 1000 kg CO₂</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Net Zero Limit:</span>
              <span className="font-extrabold text-emerald-600">0.0 kg CO₂</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Target Year:</span>
              <span className="font-extrabold">Dec 2030</span>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${progressPct}%` }}></div>
            </div>
          </div>
        </div>

        {/* National Climate Milestone */}
        <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 backdrop-blur-md">
          <h3 className="font-bold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            🇲🇮 {country} National Goal
          </h3>
          
          <div className="text-center py-4">
            <span className="text-5xl font-black text-blue-600 dark:text-blue-400">{nationalTarget.netZeroYear}</span>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Official Net Zero Target</p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Current Emissions:</span>
              <span className="font-extrabold">{nationalTarget.currentEmissionsMt} Mt CO₂</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Target Emissions:</span>
              <span className="font-extrabold text-blue-600">{nationalTarget.targetEmissionsMt} Mt CO₂</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Renewable Energy Target:</span>
              <span className="font-extrabold text-green-600">{nationalTarget.renewableTargetPct}%</span>
            </div>
          </div>
        </div>

        {/* Local Municipal Goal */}
        <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 backdrop-blur-md">
          <h3 className="font-bold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            🏙 {city} Municipal Target
          </h3>
          
          <div className="text-center py-4">
            <span className="text-4xl font-extrabold text-purple-600 dark:text-purple-400">Net Zero 2050</span>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">{city} Climate Action Plan</p>
          </div>

          <div className="space-y-2 text-xs pt-1.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Key Focus:</span>
              <span className="font-extrabold truncate">100% EV Public Transport</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Healthy Living Index:</span>
              <span className="font-extrabold text-purple-500">78 / 100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">City Leaderboard Rank:</span>
              <span className="font-extrabold">#4 in Maharashtra</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projection Simulator Card */}
      <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 backdrop-blur-md">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            🌱 Interlinked Goal Projection Calculator
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs">Simulate lifestyle goals to calculate projected drops in carbon scores and XP increases.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            {/* Slider 1 */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-gray-600 dark:text-gray-300">Weekly Meatless Meals</span>
                <span className="text-emerald-500 font-extrabold">{weeklyMeatless} meals</span>
              </div>
              <input
                type="range"
                min="0"
                max="21"
                value={weeklyMeatless}
                onChange={e => setWeeklyMeatless(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Slider 2 */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-gray-600 dark:text-gray-300">Unplug Idle Devices (Hours/Week)</span>
                <span className="text-emerald-500 font-extrabold">{weeklyUnplugHours} hours</span>
              </div>
              <input
                type="range"
                min="0"
                max="168"
                value={weeklyUnplugHours}
                onChange={e => setWeeklyUnplugHours(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Slider 3 */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-gray-600 dark:text-gray-300">Green Transit Replacements (km/Week)</span>
                <span className="text-emerald-500 font-extrabold">{transitReplaceKm} km</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={transitReplaceKm}
                onChange={e => setTransitReplaceKm(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          {/* Calculated Output Display */}
          <div className="bg-gray-50/70 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
            <h4 className="font-bold text-xs text-gray-500 uppercase tracking-widest mb-4">Calculated Projections</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-300">Projected CO₂ Savings:</span>
                <span className="font-extrabold text-emerald-500 text-lg">-{projectedCo2Savings.toFixed(1)} kg/week</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-300">Projected Carbon Score:</span>
                <span className="font-extrabold text-gray-800 dark:text-white text-lg">{newProjectedScore} <span className="text-xs text-gray-400 font-normal">/1000</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-300">Projected Level & XP:</span>
                <span className="font-extrabold text-yellow-600 text-lg">+{newXPProjected} XP</span>
              </div>
            </div>
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 p-3 rounded-xl flex gap-2.5 items-start mt-4">
              <Info size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
                Applying these weekly goals will result in an annual reduction of <strong>{(projectedCo2Savings * 52).toFixed(0)} kg CO₂e</strong>, planting the equivalent of <strong>{Math.round((projectedCo2Savings * 52) / 21)} trees</strong>!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Official Commitments */}
      <div className="bg-white/90 dark:bg-gray-900/90 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md">
        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100 mb-2">📄 Official Climate Commitment Summary</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{nationalTarget.officialSummary}</p>
      </div>
    </div>
  );
};
