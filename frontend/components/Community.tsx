import React from 'react';
import { Users, ShieldAlert, Target, Award, ArrowUpRight, Compass, MessageSquare } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAppContext } from '../context/AppContext';

export const Community: React.FC = () => {
  const { profile, stats } = useAppContext();
  const city = profile?.city || 'Mumbai';

  // Compare user footprint with average citizen footprint
  const comparisonData = [
    {
      name: 'Transport',
      You: stats.carbonScore > 400 ? 4.2 : 1.8,
      [`${city} Average`]: 3.5
    },
    {
      name: 'Electricity',
      You: stats.carbonScore > 400 ? 2.8 : 1.2,
      [`${city} Average`]: 2.1
    },
    {
      name: 'Food',
      You: stats.carbonScore > 400 ? 1.9 : 0.8,
      [`${city} Average`]: 1.5
    },
    {
      name: 'Waste',
      You: stats.carbonScore > 400 ? 0.8 : 0.4,
      [`${city} Average`]: 0.9
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-gray-900 dark:text-gray-100">
      
      {/* Header */}
      <div className="flex items-center gap-3 bg-white/95 dark:bg-gray-900/90 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <Users size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Community & Group Impact</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Compare your metrics with the averages in {city} and share local sustainability logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Community stats summary */}
        <div className="md:col-span-2 bg-white/90 dark:bg-gray-900/90 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 backdrop-blur-md">
          <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Compass size={16} className="text-teal-500" />
            Emissions Benchmark: You vs {city} Average (kg/day)
          </h3>

          <div className="h-[250px] w-full mt-4 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ left: -25, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Bar dataKey="You" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey={`${city} Average`} fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Local Community Index */}
        <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between backdrop-blur-md">
          <div>
            <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
              Community Standings
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Active Members in {city}:</span>
                <span className="font-bold">14,280 citizens</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Total City Savings:</span>
                <span className="font-bold text-emerald-500">25.4 Tons CO₂</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">State Leaderboard:</span>
                <span className="font-bold">#4 in Maharashtra</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Average Air Quality Index:</span>
                <span className="font-bold text-yellow-600">82 (Moderate)</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/40 p-3 rounded-xl text-[10px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
            🌿 Keep logging offsets like walking or cycling! Every 20kg saved pushes {city} closer to its municipal targets.
          </div>
        </div>
      </div>

      {/* Community Feed / Eco wall */}
      <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-4 flex items-center gap-2">
          <MessageSquare size={16} className="text-emerald-500" />
          Local Activity Feed — {city}
        </h3>

        <div className="space-y-4">
          {[
            { user: 'Siddharth S.', msg: 'Switched to EV scooter today! Logged to tracker and earned 5000 Green XP!', time: '2 hours ago', likes: 14, icon: '⚡' },
            { user: 'Priya K.', msg: 'Planted 3 saplings at the Powai park drive. Combined with community offset points!', time: '5 hours ago', likes: 28, icon: '🌳' },
            { user: 'Ananya R.', msg: 'Successfully finished the 7-day vegetarian challenge streak. Saved 10.5 kg of CO2!', time: '1 day ago', likes: 32, icon: '🥗' }
          ].map((post, i) => (
            <div key={i} className="flex gap-4 p-4 border border-gray-100 dark:border-gray-850 rounded-xl bg-gray-50/30">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-teal-400 flex items-center justify-center text-lg font-black shrink-0">
                {post.icon}
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 dark:text-white">{post.user}</span>
                  <span className="text-[10px] text-gray-400 font-bold">{post.time}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-normal">{post.msg}</p>
                <div className="flex gap-4 text-[10px] font-bold text-gray-400 pt-1">
                  <button className="hover:text-emerald-500 cursor-pointer">👍 {post.likes} Likes</button>
                  <button className="hover:text-teal-500 cursor-pointer">💬 Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
