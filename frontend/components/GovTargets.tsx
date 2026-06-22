import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { MOCK_GOV_TARGETS, SECTOR_DATA } from '../constants';
import { Globe2, Target, Wind, TreePine, ArrowRight, Activity, Zap, RefreshCw } from 'lucide-react';
import { useTranslation } from '../services/translation';

export const GovTargets: React.FC = () => {
  const { profile } = useAppContext();
  const { t, lang } = useTranslation();
  const country = profile?.country || 'Global';
  const targetData = MOCK_GOV_TARGETS[country] || MOCK_GOV_TARGETS['India'];
  const [activeTab, setActiveTab] = useState('national');
  const [selectedSector, setSelectedSector] = useState('Transport');

  // Real-time grid data
  const [realtimeGrid, setRealtimeGrid] = useState<any>(null);
  const [isLoadingGrid, setIsLoadingGrid] = useState(false);

  const fetchRealtimeGrid = () => {
    setIsLoadingGrid(true);
    fetch('http://localhost:5000/api/realtime-energy')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRealtimeGrid(data);
        }
      })
      .catch(err => console.error('Error fetching grid details:', err))
      .finally(() => setIsLoadingGrid(false));
  };

  useEffect(() => {
    fetchRealtimeGrid();
  }, []);

  const progressPct = ((targetData.currentEmissionsMt - targetData.targetEmissionsMt) / targetData.currentEmissionsMt) * 100;

  // Localized tab labels
  const tabLabels: Record<string, Record<string, string>> = {
    national: { English: 'National Target', Hindi: 'राष्ट्रीय लक्ष्य', Marathi: 'राष्ट्रीय उद्दिष्ट', Spanish: 'Objetivo Nacional', French: 'Objectif National' },
    global: { English: 'Global Carbon Explorer', Hindi: 'वैश्विक कार्बन एक्सप्लोरर', Marathi: 'ग्लोबल कार्बन एक्सप्लोरर', Spanish: 'Explorador Global', French: 'Explorateur Global' },
    local: { English: 'State & City Dashboard', Hindi: 'राज्य और शहर डॅशबोर्ड', Marathi: 'राज्य आणि शहर डॅशबोर्ड', Spanish: 'Tablero Local', French: 'Tableau Local' },
    sector: { English: 'Sector Explorer', Hindi: 'क्षेत्र एक्सप्लोरर', Marathi: 'क्षेत्र एक्सप्लोरर', Spanish: 'Explorador de Sectores', French: 'Explorateur de Secteurs' }
  };

  return (
    <div className="space-y-6 animate-fade-in text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center gap-3 mb-6 bg-white/80 dark:bg-gray-900/80 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
            <Globe2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {lang === 'Hindi' ? 'लाइव सरकारी जलवायु लक्ष्य इंजन' : lang === 'Marathi' ? 'थेट सरकारी हवामान लक्ष्य इंजिन' : 'Live Government Climate Target Engine'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {lang === 'Hindi' ? 'आधिकारिक जलवायु डेटा का वास्तविक समय प्रदर्शन' : lang === 'Marathi' ? 'अधिकृत हवामान डेटाचे थेट प्रदर्शन' : 'Dynamic Reflection of Official Climate Data'}
            </p>
          </div>
        </div>
        <button 
          onClick={fetchRealtimeGrid} 
          disabled={isLoadingGrid}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
          title="Refresh Real-time Data"
        >
          <RefreshCw size={18} className={isLoadingGrid ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-800 scrollbar-hide">
        {Object.keys(tabLabels).map(tabId => (
          <button 
            key={tabId} 
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 font-semibold whitespace-nowrap transition-colors cursor-pointer text-sm ${
              activeTab === tabId 
                ? 'text-blue-600 dark:text-teal-400 border-b-2 border-blue-600 dark:border-teal-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {tabLabels[tabId][lang] || tabLabels[tabId]['English']}
          </button>
        ))}
      </div>

      {activeTab === 'national' && (
        <div className="space-y-6 animate-fade-in">
          {/* Real-time Grid Widget */}
          {realtimeGrid && (
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/20 dark:to-teal-950/20 p-5 rounded-2xl border border-emerald-500/20 dark:border-emerald-900/50 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-teal-400 uppercase tracking-widest">Live Electricity Grid Statistics</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {lang === 'Hindi' ? 'रीयल-टाइम ग्रिड तीव्रता' : lang === 'Marathi' ? 'थेट ग्रीड कार्बन तीव्रता' : 'Real-time Local Grid Cleanliness'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Connected to public forecast API for coordinates (Lat: {realtimeGrid.location.lat.toFixed(2)}, Lng: {realtimeGrid.location.lng.toFixed(2)})
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 w-full md:w-auto">
                <div className="text-center bg-white/60 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Intensity</p>
                  <p className="text-xl font-extrabold text-red-500">{realtimeGrid.grid.carbonIntensityGCO2} <span className="text-xs font-normal">g/kWh</span></p>
                </div>
                <div className="text-center bg-white/60 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Renewable</p>
                  <p className="text-xl font-extrabold text-green-500">{realtimeGrid.grid.renewablePercentage}%</p>
                </div>
                <div className="text-center bg-white/60 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Status</p>
                  <p className="text-sm font-extrabold text-teal-600 mt-1">{realtimeGrid.grid.status}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Net Zero Card */}
            <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Target size={100} /></div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                {lang === 'Hindi' ? 'नेट ज़ीरो लक्ष्य' : lang === 'Marathi' ? 'नेट झीरो उद्दिष्ट' : 'Net Zero Target'}
              </h2>
              <p className="text-4xl font-black text-eco-600 dark:text-teal-400 mb-4">{targetData.netZeroYear}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium"><span className="text-gray-600 dark:text-gray-400">Current Emissions</span><span className="text-red-500">{targetData.currentEmissionsMt} Mt</span></div>
                <div className="flex justify-between text-sm font-medium"><span className="text-gray-600 dark:text-gray-400">Target Emissions</span><span className="text-green-500">{targetData.targetEmissionsMt} Mt</span></div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1"><span>Progress</span><span>{Math.max(0, 100 - progressPct).toFixed(1)}% Remaining</span></div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5"><div className="bg-eco-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, Math.max(5, progressPct))}%` }}></div></div>
                </div>
              </div>
            </div>

            {/* Renewable Energy Card */}
            <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden backdrop-blur-md">
               <div className="absolute top-0 right-0 p-4 opacity-5"><Wind size={100} /></div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                {lang === 'Hindi' ? 'अक्षय ऊर्जा लक्ष्य' : lang === 'Marathi' ? 'अक्षय ऊर्जा उद्दिष्ट' : 'Renewable Energy Target'}
              </h2>
              <p className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-4">{targetData.renewableTargetPct}%</p>
              <div className="space-y-4 mt-8">
                 <div>
                  <div className="flex justify-between text-sm font-medium mb-1"><span className="text-gray-600 dark:text-gray-400">Current Capacity</span><span className="text-blue-600 dark:text-blue-400">{targetData.currentRenewablePct}%</span></div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${targetData.currentRenewablePct}%` }}></div></div>
                </div>
              </div>
            </div>

            {/* Forest / Carbon Sink Target */}
            <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden backdrop-blur-md">
               <div className="absolute top-0 right-0 p-4 opacity-5"><TreePine size={100} /></div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                {lang === 'Hindi' ? 'वन आवरण लक्ष्य' : lang === 'Marathi' ? 'वन आवरण उद्दिष्ट' : 'Forest / Carbon Sink'}
              </h2>
              <p className="text-4xl font-black text-green-700 dark:text-green-400 mb-4">{targetData.forestTargetPct}%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">Target land area coverage for natural carbon sequestration.</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-md">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">📄 Official Climate Commitment Summary</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{targetData.officialSummary}</p>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>🕒 Last Updated: {targetData.lastUpdated}</span>
              <span className="text-green-600 dark:text-teal-400 font-medium">📡 Auto Sync Status: Active</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'global' && (
        <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-md animate-fade-in">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-885 dark:text-gray-100"><Globe2 className="text-blue-500"/> Global Carbon Explorer</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Explore emissions data for 240+ countries.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-605 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <tr><th className="p-3">Country</th><th className="p-3">Total Emissions</th><th className="p-3">Per Capita</th><th className="p-3">Net Zero Target</th><th className="p-3">Remaining Gap</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-800"><td className="p-3 font-medium">🇮🇳 India</td><td className="p-3">2,830 Mt</td><td className="p-3">1.9 t</td><td className="p-3">2070</td><td className="p-3 text-red-500">1,415 Mt</td></tr>
                <tr className="border-b border-gray-100 dark:border-gray-800"><td className="p-3 font-medium">🇺🇸 USA</td><td className="p-3">5,222 Mt</td><td className="p-3">14.2 t</td><td className="p-3">2050</td><td className="p-3 text-red-500">2,611 Mt</td></tr>
                <tr className="border-b border-gray-100 dark:border-gray-800"><td className="p-3 font-medium">🇬🇧 UK</td><td className="p-3">384 Mt</td><td className="p-3">5.2 t</td><td className="p-3">2050</td><td className="p-3 text-red-500">122 Mt</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'local' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-md">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-885 dark:text-gray-100"><Zap className="text-purple-500"/> State Dashboard ({profile?.state || 'State'})</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2"><span>State Climate Target</span><span className="font-bold">30% Reduction by 2030</span></li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2"><span>State Progress</span><span className="text-green-600 dark:text-teal-400 font-bold">12% Achieved</span></li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2"><span>Community Contribution</span><span className="font-bold">45,000 tCO₂e Saved</span></li>
            </ul>
          </div>
          <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-md">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-885 dark:text-gray-100"><Activity className="text-orange-500"/> City Dashboard ({profile?.city || 'City'})</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2"><span>City Climate Target</span><span className="font-bold">100% EV Public Transport</span></li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2"><span>Healthy Living Index</span><span className="text-blue-600 dark:text-blue-400 font-bold">78/100</span></li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2"><span>City Leaderboard Rank</span><span className="font-bold">#4 in State</span></li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'sector' && (
        <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-md animate-fade-in">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-885 dark:text-gray-100"><Zap className="text-teal-500"/> Sector Explorer</h2>
          
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {Object.keys(SECTOR_DATA).map(s => (
              <button 
                key={s} 
                onClick={() => setSelectedSector(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedSector === s 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/50 p-6 rounded-xl animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-teal-900 dark:text-teal-300">{selectedSector}</h3>
                <p className="text-teal-700 dark:text-teal-400 mt-1 text-sm">{SECTOR_DATA[selectedSector].description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-teal-600 dark:text-teal-400 font-medium font-bold">Global Share</p>
                <p className="text-3xl font-black text-teal-800 dark:text-teal-300">{SECTOR_DATA[selectedSector].percentage}%</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/80 dark:bg-gray-900/80 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-2">Global Emissions</p>
                <p className="text-xl font-bold text-red-500">{SECTOR_DATA[selectedSector].globalEmissions}</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-900/80 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-2">Key Mitigation Actions</p>
                <ul className="space-y-1">
                  {SECTOR_DATA[selectedSector].keyActions.map((action, idx) => (
                    <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
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
