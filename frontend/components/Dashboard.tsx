import React from 'react';
import { useAppContext } from '../context/AppContext';
import { getLevelName } from '../constants';
import { Leaf, Zap, Droplets, Trophy, TrendingDown, Activity, CheckCircle2, Circle, Flame, Globe2, DollarSign, Recycle, Settings2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tutorial } from './Tutorial';

const mockChartData = [
  { name: 'Mon', co2: 12 }, { name: 'Tue', co2: 10 }, { name: 'Wed', co2: 15 },
  { name: 'Thu', co2: 8 }, { name: 'Fri', co2: 9 }, { name: 'Sat', co2: 5 }, { name: 'Sun', co2: 7 },
];

export const Dashboard: React.FC = () => {
  const { profile, updateProfile, stats, missions, completeMission, isLoadingMissions } = useAppContext();

  const handleModeToggle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateProfile({ trackerMode: e.target.value });
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {!profile?.hasSeenTutorial && <Tutorial />}

      {/* Header & Mode Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {profile?.userName}!</h1>
          <p className="text-gray-500">Let's make a positive impact today in {profile?.country}.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 flex-1 md:flex-none">
            <Settings2 size={18} className="text-gray-500" />
            <select 
              className="bg-transparent font-bold text-eco-700 outline-none w-full cursor-pointer"
              value={profile?.trackerMode}
              onChange={handleModeToggle}
            >
              <option value="🤖 AI Automatic Tracker">🤖 AI Automatic Mode</option>
              <option value="✍️ Manual Tracker">✍️ Manual Mode</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Leaf className="text-eco-500"/>} title="Carbon Score" value={`${stats.carbonScore} kg`} color="bg-eco-50" />
        <StatCard icon={<Activity className="text-blue-500"/>} title="Health Score" value={`${stats.healthyLivingScore}/100`} color="bg-blue-50" />
        <StatCard icon={<TrendingDown className="text-green-500"/>} title="CO₂ Saved" value={`${stats.co2SavedKg.toFixed(1)} kg`} color="bg-green-50" />
        <StatCard icon={<Zap className="text-yellow-500"/>} title="Green XP" value={stats.greenXP.toString()} color="bg-yellow-50" />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<DollarSign className="text-emerald-500"/>} title="Money Saved" value={`$${stats.moneySaved.toFixed(2)}`} color="bg-emerald-50" />
        <StatCard icon={<Zap className="text-purple-500"/>} title="Electricity Saved" value={`${stats.electricitySaved.toFixed(1)} kWh`} color="bg-purple-50" />
        <StatCard icon={<Droplets className="text-cyan-500"/>} title="Water Saved" value={`${stats.waterSaved.toFixed(1)} L`} color="bg-cyan-50" />
        <StatCard icon={<Recycle className="text-orange-500"/>} title="Waste Recycled" value={`${stats.wasteRecycled.toFixed(1)} kg`} color="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><TrendingDown className="text-eco-500"/> CO₂e Control Progress</h2>
              <select className="text-sm border-gray-200 rounded-lg text-gray-500 outline-none">
                <option>Daily</option><option>Weekly</option><option>Monthly</option><option>Yearly</option><option>Lifetime</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="co2" stroke="#22c55e" strokeWidth={3} dot={{r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* My Climate Contribution */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Globe2 className="text-blue-500"/> My Climate Contribution</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">City ({profile?.city !== 'Not Specified' ? profile?.city : 'Local'})</p>
                <p className="font-bold text-gray-800">{stats.cityContribution.toFixed(4)}%</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">State ({profile?.state !== 'Not Specified' ? profile?.state : 'Region'})</p>
                <p className="font-bold text-gray-800">{stats.stateContribution.toFixed(4)}%</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Country ({profile?.country})</p>
                <p className="font-bold text-gray-800">{stats.countryContribution.toFixed(5)}%</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Global</p>
                <p className="font-bold text-gray-800">{stats.globalContribution.toFixed(6)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Right Column based on Tracker Mode */}
        <div className="space-y-6">
          {profile?.trackerMode === '🤖 AI Automatic Tracker' ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[350px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">🤖 AI Daily Missions</h2>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {isLoadingMissions ? (
                  <div className="flex justify-center items-center h-full text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-500"></div>
                  </div>
                ) : missions.length > 0 ? (
                  missions.map(mission => (
                    <div key={mission.id} className={`p-4 rounded-xl border transition-all ${mission.completed ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-eco-200 hover:border-eco-400 shadow-sm'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-semibold text-sm ${mission.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{mission.title}</h3>
                        <button onClick={() => completeMission(mission.id)} disabled={mission.completed} className="text-eco-500 hover:text-eco-700 disabled:text-gray-300 transition-colors">
                          {mission.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">{mission.description}</p>
                      <div className="flex gap-2 text-xs font-medium">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md">-{mission.expectedCo2Save}kg</span>
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md">+{mission.xpReward} XP</span>
                      </div>
                    </div>
                  ))
                ) : (
                   <p className="text-sm text-gray-500 text-center mt-10">No missions available.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[350px] justify-center items-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Zap size={32} className="text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Manual Mode Active</h3>
              <p className="text-sm text-gray-500 mb-6">Go to the Tracker tab to manually log your activities and update your scores.</p>
              <button className="bg-eco-100 text-eco-700 font-bold py-2 px-6 rounded-xl">Go to Tracker</button>
            </div>
          )}

          {/* Healthy Living Assistant */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl shadow-sm border border-blue-100">
            <h2 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2"><Activity size={20}/> Healthy Living Assistant</h2>
            <p className="text-sm text-blue-800 mb-4">Status: <span className="font-bold text-green-600">🌱 Excellent</span></p>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-xl text-sm flex justify-between items-center shadow-sm">
                <span>🚶 Walking</span>
                <span className="text-green-600 font-medium">⭐⭐⭐⭐⭐ Excellent</span>
              </div>
              <div className="bg-white p-3 rounded-xl text-sm flex justify-between items-center shadow-sm">
                <span>🚗 Petrol Car</span>
                <span className="text-red-500 font-medium">⭐⭐ Low</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-100 rounded-xl text-sm text-blue-800">
              <strong>🤖 AI Guide:</strong> Walk more today to improve your health score and reduce emissions!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }: any) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
    <div className={`p-3 rounded-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{title}</p>
      <h3 className="text-lg font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);
