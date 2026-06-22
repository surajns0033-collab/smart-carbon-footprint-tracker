import React, { useState } from 'react';
import { Globe2, ShieldAlert, Target, Award, ArrowUpRight, Compass, Shield } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MOCK_GOV_TARGETS } from '../constants';

export const GlobalExplorer: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('India');
  const targetData = MOCK_GOV_TARGETS[selectedCountry] || MOCK_GOV_TARGETS['India'];

  const progressPct = ((targetData.currentEmissionsMt - targetData.targetEmissionsMt) / targetData.currentEmissionsMt) * 100;

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-gray-900 dark:text-gray-100">
      
      {/* Header */}
      <div className="flex items-center gap-3 bg-white/95 dark:bg-gray-900/90 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md">
        <div className="p-3 bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 rounded-xl">
          <Globe2 size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Global Climate Explorer</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Explore official emissions targets, carbon sinks, and Net-Zero plans across major global economies.</p>
        </div>
      </div>

      {/* Selector and Target Cards */}
      <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 backdrop-blur-md">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Select Country to Explore:</label>
          <select 
            value={selectedCountry} 
            onChange={e => setSelectedCountry(e.target.value)}
            className="w-full md:w-64 p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none font-bold cursor-pointer"
          >
            {Object.keys(MOCK_GOV_TARGETS).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Net Zero */}
          <div className="bg-gray-50/50 dark:bg-gray-950/30 p-5 rounded-xl border border-gray-100 dark:border-gray-900 space-y-2 relative overflow-hidden">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Net Zero Target</h4>
            <p className="text-4xl font-black text-teal-600 dark:text-teal-400">{targetData.netZeroYear}</p>
            <div className="space-y-1.5 text-xs pt-4">
              <div className="flex justify-between"><span>Current:</span><span className="font-bold text-red-500">{targetData.currentEmissionsMt} Mt</span></div>
              <div className="flex justify-between"><span>Target:</span><span className="font-bold text-emerald-500">{targetData.targetEmissionsMt} Mt</span></div>
            </div>
          </div>

          {/* Renewable */}
          <div className="bg-gray-50/50 dark:bg-gray-950/30 p-5 rounded-xl border border-gray-100 dark:border-gray-900 space-y-2 relative overflow-hidden">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Renewable Power Target</h4>
            <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{targetData.renewableTargetPct}%</p>
            <div className="space-y-1.5 text-xs pt-4">
              <div className="flex justify-between"><span>Current share:</span><span className="font-bold">{targetData.currentRenewablePct}%</span></div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full mt-2">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${targetData.currentRenewablePct}%` }}></div>
              </div>
            </div>
          </div>

          {/* Carbon Sink */}
          <div className="bg-gray-50/50 dark:bg-gray-950/30 p-5 rounded-xl border border-gray-100 dark:border-gray-900 space-y-2 relative overflow-hidden">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Forest / Carbon Sink</h4>
            <p className="text-4xl font-black text-green-700 dark:text-green-400">{targetData.forestTargetPct}%</p>
            <p className="text-[10px] text-gray-400 leading-normal pt-4">Estimated target land area dedicated to natural forest carbon capture sinks.</p>
          </div>
        </div>

        {/* Commitment Summary */}
        <div className="bg-teal-50/30 dark:bg-emerald-950/10 border border-teal-100/30 dark:border-emerald-900/30 p-5 rounded-xl">
          <h4 className="font-bold text-xs text-teal-800 dark:text-teal-300 uppercase tracking-widest mb-2">Climate Commitment Summary</h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{targetData.officialSummary}</p>
          <p className="text-[10px] text-gray-400 mt-4">🕒 Data synced from UNFCCC targets database. Last updated: {targetData.lastUpdated}.</p>
        </div>
      </div>
    </div>
  );
};
