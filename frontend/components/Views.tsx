import React, { useState, useMemo } from 'react';
import { FlaskConical, Book, Trophy, Users, Search, Filter, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { CARBON_DATABASE } from '../constants';

const SIMULATOR_ACTIONS: Record<string, any> = {
  'Switch to EV': { carbon: -2500, health: 5, xp: 5000, money: 1200, elec: -500, water: 0, country: 0.005, state: 0.05, city: 0.2, global: 0.0001 },
  'Go Vegan for a Year': { carbon: -1500, health: 25, xp: 8000, money: 800, elec: 0, water: 400000, country: 0.003, state: 0.03, city: 0.1, global: 0.00005 },
  'Install Solar Panels': { carbon: -3000, health: 0, xp: 10000, money: 1500, elec: 6000, water: 0, country: 0.006, state: 0.06, city: 0.25, global: 0.00015 },
  'Cycle to Work Daily': { carbon: -800, health: 50, xp: 12000, money: 500, elec: 0, water: 0, country: 0.001, state: 0.01, city: 0.05, global: 0.00001 },
};

export const Simulator: React.FC = () => {
  const [action, setAction] = useState('Switch to EV');
  const data = SIMULATOR_ACTIONS[action];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-pink-100 text-pink-600 rounded-xl"><FlaskConical size={24} /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🌱 What If Simulator</h1>
          <p className="text-gray-500">Select eco actions to see instant projected results across all metrics.</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <select className="w-full p-4 border border-gray-300 rounded-xl mb-8 font-bold text-gray-800 text-lg shadow-sm focus:ring-2 focus:ring-pink-500 outline-none" value={action} onChange={e => setAction(e.target.value)}>
          {Object.keys(SIMULATOR_ACTIONS).map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div className="p-4 bg-green-50 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-600 font-medium mb-1">🌍 Carbon Reduction</p>
            <p className="font-black text-green-600 text-lg">{data.carbon} kg</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-600 font-medium mb-1">🍃 Health Score</p>
            <p className="font-black text-blue-600 text-lg">+{data.health} Pts</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-600 font-medium mb-1">🏆 Green XP</p>
            <p className="font-black text-yellow-600 text-lg">+{data.xp} XP</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-600 font-medium mb-1">💰 Money Saved</p>
            <p className="font-black text-emerald-600 text-lg">${data.money}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-600 font-medium mb-1">⚡ Electricity Saved</p>
            <p className="font-black text-purple-600 text-lg">{data.elec} kWh</p>
          </div>
          <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-600 font-medium mb-1">💧 Water Saved</p>
            <p className="font-black text-cyan-600 text-lg">{data.water} L</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-600 font-medium mb-1">🇺🇳 Country Contrib.</p>
            <p className="font-black text-gray-800 text-lg">+{data.country}%</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-600 font-medium mb-1">🏛 State Contrib.</p>
            <p className="font-black text-gray-800 text-lg">+{data.state}%</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-600 font-medium mb-1">🏙 City Contrib.</p>
            <p className="font-black text-gray-800 text-lg">+{data.city}%</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-600 font-medium mb-1">🌎 Global Contrib.</p>
            <p className="font-black text-gray-800 text-lg">+{data.global}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Library: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filteredData = useMemo(() => {
    return CARBON_DATABASE.filter(item => {
      const matchesSearch = item.activity.toLowerCase().includes(search.toLowerCase()) || item.alt.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const categories = ['All', ...Array.from(new Set(CARBON_DATABASE.map(item => item.category)))];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Book size={24} /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📚 Carbon Source Library</h1>
          <p className="text-gray-500">Database of 1000+ Activities and their impacts.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search activities (e.g., Flight, Laptop, Tofu)..." 
            className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="relative min-w-[150px]">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <select 
            className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 text-sm text-gray-500 flex justify-between">
          <span>Showing {filteredData.length} of 1042 entries</span>
          <span>Scroll for more</span>
        </div>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white sticky top-0 shadow-sm text-gray-600 z-10">
              <tr>
                <th className="p-4 font-semibold whitespace-nowrap">Activity</th>
                <th className="p-4 font-semibold whitespace-nowrap">Carbon Impact</th>
                <th className="p-4 font-semibold whitespace-nowrap">Eco Rating</th>
                <th className="p-4 font-semibold whitespace-nowrap">Better Alternative</th>
                <th className="p-4 font-semibold min-w-[250px]">Impact Explanation</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? filteredData.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-800 whitespace-nowrap">{item.activity}</td>
                  <td className={`p-4 font-bold whitespace-nowrap ${item.impact > 10 ? 'text-red-500' : item.impact > 2 ? 'text-orange-500' : 'text-green-600'}`}>
                    {item.impact} kg CO₂e
                  </td>
                  <td className="p-4 whitespace-nowrap">{item.rating}</td>
                  <td className="p-4 text-green-600 font-medium">{item.alt}</td>
                  <td className="p-4 text-gray-600 text-xs leading-relaxed flex items-start gap-2">
                    <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
                    {item.explanation}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No activities found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const Leaderboard: React.FC = () => {
  const { profile } = useAppContext();
  
  const scopes = [
    { id: 'Global', label: 'Global' },
    { id: 'Country', label: profile?.country || 'Country' },
    { id: 'State', label: profile?.state || 'State' },
    { id: 'City', label: profile?.city || 'City' }
  ];
  
  const [activeScope, setActiveScope] = useState(scopes[0].id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl"><Trophy size={24} /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🏅 Leaderboards</h1>
          <p className="text-gray-500">Gamification: Compete and earn Green Levels.</p>
        </div>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {scopes.map(s => (
          <button 
            key={s.id} 
            onClick={() => setActiveScope(s.id)} 
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeScope === s.id ? 'bg-yellow-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          Top Contributors in {scopes.find(s => s.id === activeScope)?.label}
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <span className={`font-black w-6 text-center text-lg ${i===1?'text-yellow-500':i===2?'text-gray-400':i===3?'text-orange-400':'text-gray-400'}`}>#{i}</span>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                  <Users size={20} className="text-gray-500"/>
                </div>
                <div>
                  <p className="font-bold text-gray-800">EcoUser{i*123}</p>
                  <p className="text-xs text-gray-500">Level {15-i} • {i < 4 ? 'Net Zero Hero' : 'Planet Protector'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-eco-600 text-lg">{15000 - (i*850)} XP</p>
                <p className="text-xs text-gray-400">{(100 - i*5)}kg Saved</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
