import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { MOCK_GOV_TARGETS, SECTOR_DATA } from '../constants';
import { Globe2, Target, Wind, AlertCircle, Map, BarChart3, PieChart, TreePine, ArrowRight } from 'lucide-react';

export const GovTargets: React.FC = () => {
  const { profile } = useAppContext();
  const country = profile?.country || 'Global';
  const targetData = MOCK_GOV_TARGETS[country] || MOCK_GOV_TARGETS['India'];
  const [activeTab, setActiveTab] = useState('national');
  const [selectedSector, setSelectedSector] = useState('Transport');

  const progressPct = ((targetData.currentEmissionsMt - targetData.targetEmissionsMt) / targetData.currentEmissionsMt) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <Globe2 size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Live Government Climate Target Engine</h1>
          <p className="text-gray-500">Dynamic Reflection of Official Climate Data</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200 scrollbar-hide">
        {[
          { id: 'national', label: 'National Target' },
          { id: 'global', label: 'Global Carbon Explorer' },
          { id: 'local', label: 'State & City Dashboard' },
          { id: 'compare', label: 'Country Comparison' },
          { id: 'sector', label: 'Sector Explorer' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'national' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Net Zero Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Target size={100} /></div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">Net Zero Target</h2>
              <p className="text-4xl font-black text-eco-600 mb-4">{targetData.netZeroYear}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium"><span className="text-gray-600">Current Emissions</span><span className="text-red-500">{targetData.currentEmissionsMt} Mt</span></div>
                <div className="flex justify-between text-sm font-medium"><span className="text-gray-600">Target Emissions</span><span className="text-green-500">{targetData.targetEmissionsMt} Mt</span></div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1"><span>Progress</span><span>{Math.max(0, 100 - progressPct).toFixed(1)}% Remaining</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-eco-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, Math.max(5, progressPct))}%` }}></div></div>
                </div>
              </div>
            </div>

            {/* Renewable Energy Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Wind size={100} /></div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">Renewable Energy Target</h2>
              <p className="text-4xl font-black text-blue-600 mb-4">{targetData.renewableTargetPct}%</p>
              <div className="space-y-4 mt-8">
                 <div>
                  <div className="flex justify-between text-sm font-medium mb-1"><span className="text-gray-600">Current Capacity</span><span className="text-blue-600">{targetData.currentRenewablePct}%</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${targetData.currentRenewablePct}%` }}></div></div>
                </div>
              </div>
            </div>

            {/* Forest / Carbon Sink Target */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><TreePine size={100} /></div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">Forest / Carbon Sink</h2>
              <p className="text-4xl font-black text-green-700 mb-4">{targetData.forestTargetPct}%</p>
              <p className="text-sm text-gray-600 mt-8">Target land area coverage for natural carbon sequestration.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-2">📄 Official Climate Commitment Summary</h3>
            <p className="text-gray-600 text-sm mb-4">{targetData.officialSummary}</p>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>🕒 Last Updated: {targetData.lastUpdated}</span>
              <span className="text-green-600 font-medium">📡 Auto Sync Status: Active</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'global' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Globe2 className="text-blue-500"/> Global Carbon Explorer</h2>
          <p className="text-sm text-gray-600 mb-4">Explore emissions data for 240+ countries. (Mock Data View)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr><th className="p-3">Country</th><th className="p-3">Total Emissions</th><th className="p-3">Per Capita</th><th className="p-3">Net Zero Target</th><th className="p-3">Remaining Gap</th></tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="p-3 font-medium">🇮🇳 India</td><td className="p-3">2,830 Mt</td><td className="p-3">1.9 t</td><td className="p-3">2070</td><td className="p-3 text-red-500">1,415 Mt</td></tr>
                <tr className="border-b"><td className="p-3 font-medium">🇺🇸 USA</td><td className="p-3">5,222 Mt</td><td className="p-3">14.2 t</td><td className="p-3">2050</td><td className="p-3 text-red-500">2,611 Mt</td></tr>
                <tr className="border-b"><td className="p-3 font-medium">🇬🇧 UK</td><td className="p-3">384 Mt</td><td className="p-3">5.2 t</td><td className="p-3">2050</td><td className="p-3 text-red-500">122 Mt</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'local' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Map className="text-purple-500"/> State Dashboard ({profile?.state || 'State'})</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b pb-2"><span>State Climate Target</span><span className="font-bold">30% Reduction by 2030</span></li>
              <li className="flex justify-between border-b pb-2"><span>State Progress</span><span className="text-green-600 font-bold">12% Achieved</span></li>
              <li className="flex justify-between border-b pb-2"><span>Community Contribution</span><span className="font-bold">45,000 tCO₂e Saved</span></li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Map className="text-orange-500"/> City Dashboard ({profile?.city || 'City'})</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b pb-2"><span>City Climate Target</span><span className="font-bold">100% EV Public Transport</span></li>
              <li className="flex justify-between border-b pb-2"><span>Healthy Living Index</span><span className="text-blue-600 font-bold">78/100</span></li>
              <li className="flex justify-between border-b pb-2"><span>City Leaderboard Rank</span><span className="font-bold">#4 in State</span></li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><BarChart3 className="text-indigo-500"/> Country Comparison</h2>
          <p className="text-sm text-gray-500 mb-4">Compare Total Emissions, Per Capita Emissions, Renewable Energy, and Air Quality.</p>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
            [Interactive Comparison Chart Placeholder]
          </div>
        </div>
      )}

      {activeTab === 'sector' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><PieChart className="text-teal-500"/> Sector Explorer</h2>
          
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {Object.keys(SECTOR_DATA).map(s => (
              <button 
                key={s} 
                onClick={() => setSelectedSector(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${selectedSector === s ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="bg-teal-50 border border-teal-100 p-6 rounded-xl animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-teal-900">{selectedSector}</h3>
                <p className="text-teal-700 mt-1">{SECTOR_DATA[selectedSector].description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-teal-600 font-medium">Global Share</p>
                <p className="text-3xl font-black text-teal-800">{SECTOR_DATA[selectedSector].percentage}%</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Global Emissions</p>
                <p className="text-xl font-bold text-red-500">{SECTOR_DATA[selectedSector].globalEmissions}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Key Mitigation Actions</p>
                <ul className="space-y-1">
                  {SECTOR_DATA[selectedSector].keyActions.map((action, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                      <ArrowRight size={14} className="text-teal-500" /> {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
