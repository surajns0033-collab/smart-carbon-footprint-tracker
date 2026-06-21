import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { getLevelName } from '../constants';
import {
  Leaf, Zap, Droplets, TrendingDown, Activity, CheckCircle2,
  Globe2, DollarSign, Recycle, Settings2, ChevronLeft, ChevronRight,
  Flame, Trophy, Wind, TreePine, Bolt, ArrowUp, ArrowDown, Target,
  Calendar, Bell, Sun, Moon, Info, Car, Lightbulb, Fuel, UtensilsCrossed,
  Trash2, Smile, ArrowRight, UserCheck, HelpCircle, Compass
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar,
  PieChart, Pie, Cell
} from 'recharts';
import { useTranslation } from '../services/translation';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6366F1'];

export const Dashboard: React.FC = () => {
  const { profile, updateProfile, stats, addLog } = useAppContext();
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState('7 Days');

  // Emission Breakdown data
  const pieData = [
    { name: 'Transport', value: 45 },
    { name: 'Home Energy', value: 25 },
    { name: 'Food', value: 15 },
    { name: 'Waste', value: 10 },
    { name: 'Others', value: 5 }
  ];

  // Trend Overview data
  const trendData = [
    { day: 'May 14', co2: 4.8 },
    { day: 'May 15', co2: 4.2 },
    { day: 'May 16', co2: 5.1 },
    { day: 'May 17', co2: 4.5 },
    { day: 'May 18', co2: 4.0 },
    { day: 'May 19', co2: 3.6 },
    { day: 'May 20', co2: 4.1 }
  ];

  const handleQuickLog = (activityName: string, category: string, impact: number, xp: number) => {
    addLog({
      category,
      description: `Logged activity: ${activityName}`,
      co2Impact: impact,
      xpEarned: xp
    });
  };

  return (
    <div className="space-y-6 animate-fade-in text-gray-900 dark:text-gray-100">
      
      {/* ── Top Header Section ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Good Morning, {profile?.userName || 'Arjun'}! 🌿
          </h1>
          <p className="text-gray-500 text-sm">Every small step counts towards a big change.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 shadow-sm">
            <Calendar size={16} />
            <span>May 20, 2025</span>
          </div>
          <button className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-500 hover:text-gray-700 dark:text-gray-400 cursor-pointer shadow-sm relative">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* ── First Row: Metric Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Sustainability Score */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Sustainability Score</p>
              <h3 className="text-2xl font-black mt-1">712 <span className="text-xs text-gray-400 font-normal">/1000</span></h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-black text-sm flex items-center justify-center">
              A
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-600 font-bold">
            <ArrowUp size={12} />
            <span>Great Going!</span>
          </div>
        </div>

        {/* Today's Footprint */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Today's Footprint</p>
              <h3 className="text-2xl font-black mt-1">3.45 <span className="text-xs text-gray-400 font-normal">kg CO₂</span></h3>
            </div>
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-lg">
              <Leaf size={16} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs text-emerald-600 font-bold">
            <ArrowDown size={12} />
            <span>8% vs yesterday</span>
          </div>
        </div>

        {/* This Week */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">This Week</p>
              <h3 className="text-2xl font-black mt-1">24.12 <span className="text-xs text-gray-400 font-normal">kg CO₂</span></h3>
            </div>
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-lg">
              <Activity size={16} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs text-emerald-600 font-bold">
            <ArrowDown size={12} />
            <span>12% vs last week</span>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">This Month</p>
              <h3 className="text-2xl font-black mt-1">98.34 <span className="text-xs text-gray-400 font-normal">kg CO₂</span></h3>
            </div>
            <div className="p-1.5 bg-purple-50 dark:bg-purple-950/20 text-purple-500 rounded-lg">
              <Calendar size={16} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs text-emerald-600 font-bold">
            <ArrowDown size={12} />
            <span>15% vs last month</span>
          </div>
        </div>

        {/* CO2 Reduced */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">CO₂ Reduced</p>
              <h3 className="text-2xl font-black mt-1">245.6 <span className="text-xs text-gray-400 font-normal">kg CO₂</span></h3>
            </div>
            <div className="p-1.5 bg-teal-50 dark:bg-teal-950/20 text-teal-500 rounded-lg">
              <TreePine size={16} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-600 font-bold">
            <span>Total Contribution</span>
          </div>
        </div>
      </div>

      {/* ── Second Row: Charts & AI Coach ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Emission Breakdown */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Emission Breakdown</h3>
            <div className="flex justify-center relative my-4">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-lg font-black text-gray-800 dark:text-white">3.45</p>
                <p className="text-[10px] text-gray-400">kg CO₂</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mt-4">
              {pieData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-gray-600 dark:text-gray-400">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
          <button className="text-xs font-bold text-emerald-600 dark:text-teal-400 flex items-center gap-1 hover:underline mt-6 cursor-pointer">
            View Detailed Analytics <ArrowRight size={12} />
          </button>
        </div>

        {/* Trend Overview */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100">Trend Overview</h3>
                <p className="text-xs text-gray-400">Your carbon footprint trend</p>
              </div>
              <select 
                value={timeframe} 
                onChange={e => setTimeframe(e.target.value)}
                className="text-xs font-bold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1.5 rounded-lg outline-none cursor-pointer"
              >
                <option>7 Days</option>
                <option>30 Days</option>
              </select>
            </div>
            <div className="h-[180px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ left: -25, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <YAxis domain={[0, 6]} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                  <Line type="monotone" dataKey="co2" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Sustainability Coach */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                AI Sustainability Coach
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-teal-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full">
                ● Online
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-850 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 flex gap-3 items-start my-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                🤖
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="font-bold mb-1">Hi Arjun! 👋</p>
                You used more transport than usual this week. Try using public transport or cycling for short distances.
              </div>
            </div>

            <div className="bg-emerald-50/50 dark:bg-emerald-950/10 p-3 rounded-xl border border-emerald-100/50 dark:border-emerald-900/30 flex gap-3 items-center">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                💡
              </div>
              <div className="text-xs">
                <p className="font-bold text-emerald-800 dark:text-emerald-400">Today's Suggestion</p>
                <p className="text-gray-550 dark:text-gray-400">Switch off AC 1 hour earlier today</p>
              </div>
            </div>
          </div>
          
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs mt-6 transition-colors cursor-pointer">
            Chat with Coach
          </button>
        </div>
      </div>

      {/* ── Third Row: Quick Actions & Log Progress ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Logging & Progress */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick Log */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-850 dark:text-gray-100">Quick Log Your Activity</h3>
              <button className="text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 border border-gray-250 dark:border-gray-700 px-3 py-1.5 rounded-xl flex items-center gap-1 bg-white dark:bg-gray-950 cursor-pointer shadow-sm">
                ⚙️ Custom Activity
              </button>
            </div>
            
            <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
              {[
                { name: 'Transport', icon: Car, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20', impact: -2.5, xp: 20 },
                { name: 'Electricity', icon: Lightbulb, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20', impact: -1.2, xp: 15 },
                { name: 'Fuel', icon: Fuel, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/20', impact: -3.0, xp: 30 },
                { name: 'Food', icon: UtensilsCrossed, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20', impact: -1.8, xp: 20 },
                { name: 'Waste', icon: Trash2, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20', impact: -0.5, xp: 10 },
                { name: 'Water', icon: Droplets, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20', impact: -1.0, xp: 15 },
                { name: 'Lifestyle', icon: Leaf, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/20', impact: -2.0, xp: 25 },
              ].map(action => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.name}
                    onClick={() => handleQuickLog(action.name, action.name, action.impact, action.xp)}
                    className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl transition-all cursor-pointer shadow-sm group"
                  >
                    <div className={`p-2.5 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-550 dark:text-gray-400">{action.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Your Progress */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm flex flex-col justify-between text-center">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-4">Your Progress</h3>
              <div className="flex justify-center relative">
                <ResponsiveContainer width="100%" height={120}>
                  <RadialBarChart innerRadius="80%" outerRadius="100%" data={[{ value: 42 }]} startAngle={90} endAngle={-270}>
                    <RadialBar background dataKey="value" fill="#10b981" />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <p className="text-2xl font-black text-gray-800 dark:text-white">42%</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Towards Net Zero</p>
                </div>
              </div>
              <p className="text-xs text-gray-550 dark:text-gray-400 mt-4">Target: Dec 2030</p>
            </div>

            {/* Daily Challenge */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-2">Daily Challenge</h3>
                <div className="my-4 flex items-center gap-3">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <Target size={18} />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold">Use Public Transport</p>
                    <p className="text-gray-500 mt-0.5">Use bus, metro or train for at least one trip today.</p>
                  </div>
                </div>
              </div>
              <button className="w-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100/30 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                Completed ✓
              </button>
            </div>

            {/* Achievements */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-850 dark:text-gray-100 text-sm">Achievements</h3>
                <button className="text-[10px] font-bold text-emerald-600 dark:text-teal-400 hover:underline cursor-pointer">View All</button>
              </div>

              <div className="grid grid-cols-3 gap-3 my-2 text-center">
                {[
                  { name: '7-Day Streak', icon: '🔥' },
                  { name: 'Green Commuter', icon: '🚗' },
                  { name: 'Energy Saver', icon: '⚡' },
                  { name: 'Waste Reducer', icon: '🗑️' },
                  { name: 'Eco Explorer', icon: '🌍' },
                  { name: 'Climate Champion', icon: '🏆' },
                ].map(badge => (
                  <div key={badge.name} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-150 dark:border-gray-700 flex items-center justify-center text-lg">
                      {badge.icon}
                    </div>
                    <span className="text-[8px] font-bold text-gray-500 leading-tight">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Leaderboards & Community Impact */}
        <div className="space-y-6">
          {/* Top Carbon Reducers */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-850 dark:text-gray-100 text-sm">Top Carbon Reducers – Mumbai</h3>
              <button className="text-[10px] font-bold text-emerald-600 dark:text-teal-400 hover:underline cursor-pointer">View All</button>
            </div>

            <div className="space-y-3.5 my-4">
              {[
                { rank: '1', name: 'Neha Iyer', co2: '1,245 kg CO₂', me: false },
                { rank: '2', name: 'Rohan Mehta', co2: '980 kg CO₂', me: false },
                { rank: '3', name: 'Kavya Shah', co2: '870 kg CO₂', me: false },
                { rank: '42', name: 'Arjun Sharma (You)', co2: '245.6 kg CO₂', me: true },
              ].map(user => (
                <div 
                  key={user.name} 
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    user.me 
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/30' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 w-5">{user.rank}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-850 flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-305">{user.name}</span>
                  </div>
                  <span className="text-xs font-black text-gray-850 dark:text-gray-105">{user.co2}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-bold text-emerald-600 dark:text-teal-400 text-center bg-emerald-50/30 dark:bg-emerald-950/10 py-2 rounded-xl">
              You are in Top 5% in Mumbai 👏
            </p>
          </div>

          {/* Community Impact */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-850 dark:text-gray-100 text-sm mb-4">Community Impact</h3>
              <div className="space-y-2.5 text-xs text-gray-650 dark:text-gray-400 font-medium">
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/60 pb-1.5">
                  <span>Your Contribution</span>
                  <span className="font-bold text-gray-850 dark:text-gray-200">245.6 kg CO₂</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/60 pb-1.5">
                  <span>Mumbai Community</span>
                  <span className="font-bold text-gray-850 dark:text-gray-200">25.4 Tons CO₂</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/60 pb-1.5">
                  <span>Maharashtra</span>
                  <span className="font-bold text-gray-850 dark:text-gray-200">180 Tons CO₂</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/60 pb-1.5">
                  <span>India</span>
                  <span className="font-bold text-gray-850 dark:text-gray-200">3,200 Tons CO₂</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Global</span>
                  <span className="font-bold text-gray-850 dark:text-gray-200">125,000 Tons CO₂</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 dark:text-teal-400 flex items-center justify-center text-4xl animate-spin-slow">
                🌎
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Fourth Row: Eco Companion Footer Banner ── */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-900 border border-emerald-200/50 dark:border-emerald-800/50 flex items-center justify-center text-3xl">
            🌱
          </div>
          <div>
            <h3 className="font-bold text-emerald-900 dark:text-teal-300">Eco Companion</h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">Level 4 — Sustainability Advocate</p>
            <div className="w-48 bg-emerald-200/40 dark:bg-emerald-900/40 h-2 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-[9px] font-bold text-emerald-600 dark:text-teal-400 mt-1">750 / 1000 XP (Growing)</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center w-full md:w-auto">
          <div className="bg-white/60 dark:bg-gray-900/40 px-5 py-3 rounded-2xl border border-emerald-100/30 dark:border-emerald-900/20 shadow-sm">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Trees Planted</p>
            <p className="text-lg font-black text-emerald-700 dark:text-teal-400">12 Trees</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-900/40 px-5 py-3 rounded-2xl border border-emerald-100/30 dark:border-emerald-900/20 shadow-sm">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Energy Saved</p>
            <p className="text-lg font-black text-blue-600 dark:text-blue-400">980 kWh</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-900/40 px-5 py-3 rounded-2xl border border-emerald-100/30 dark:border-emerald-900/20 shadow-sm">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Fuel Saved</p>
            <p className="text-lg font-black text-amber-600 dark:text-amber-400">45 Liters</p>
          </div>
        </div>

        <div className="bg-emerald-600/5 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/10 dark:border-emerald-900/20 text-center w-full md:w-64">
          <p className="text-[10px] font-bold text-emerald-800 dark:text-teal-400 uppercase tracking-widest mb-1">Did you know?</p>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-normal">
            If everyone on Earth lived like you, we would need <span className="font-black text-emerald-900 dark:text-white">1.3 Earths</span>.
          </p>
        </div>

      </div>

    </div>
  );
};
