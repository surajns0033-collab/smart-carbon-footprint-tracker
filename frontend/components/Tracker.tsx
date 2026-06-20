import React, { useState } from 'react';
import { Car, Zap, Utensils, Droplets, ShoppingBag, Monitor, Trash2, Plus, CheckCircle2, Circle, Camera } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MANUAL_CATEGORIES } from '../constants';
import { analyzeReceiptText } from '../services/ai';

export const Tracker: React.FC = () => {
  const { profile } = useAppContext();
  const [activeTab, setActiveTab] = useState<'ai' | 'manual' | 'scanner'>(
    profile?.trackerMode === '🤖 AI Automatic Tracker' ? 'ai' : 'manual'
  );
  
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">CO₂e Control Tracker</h1>
        <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          <button onClick={() => setActiveTab('ai')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'ai' ? 'bg-white shadow-sm text-eco-600' : 'text-gray-500 hover:text-gray-700'}`}>
            🤖 AI Automatic
          </button>
          <button onClick={() => setActiveTab('manual')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'manual' ? 'bg-white shadow-sm text-eco-600' : 'text-gray-500 hover:text-gray-700'}`}>
            ✍️ Manual
          </button>
          <button onClick={() => setActiveTab('scanner')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'scanner' ? 'bg-white shadow-sm text-eco-600' : 'text-gray-500 hover:text-gray-700'}`}>
            📷 AI Scanner
          </button>
        </div>
      </div>

      {activeTab === 'manual' && <ManualTracker />}
      {activeTab === 'ai' && <AIAutomaticTracker />}
      {activeTab === 'scanner' && <SmartScanner />}
    </div>
  );
};

const AIAutomaticTracker = () => {
  const { profile, missions, completeMission, isLoadingMissions } = useAppContext();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
        <h3 className="font-bold text-blue-800 mb-1">AI Automatic Tracker Active</h3>
        <p className="text-sm text-blue-700">
          Category: <strong>{profile?.aiCategory || 'General'}</strong> | Level: <strong>{profile?.aiLevel || 'Standard'}</strong>
        </p>
        <p className="text-xs text-blue-600 mt-2">AI automatically generates daily missions and recommendations based on your profile. Completing them updates your scores live.</p>
      </div>

      <h2 className="text-lg font-bold mb-4">Today's Recommendations</h2>
      
      <div className="space-y-4">
        {isLoadingMissions ? (
          <div className="flex justify-center items-center py-10 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-500"></div>
          </div>
        ) : missions.length > 0 ? (
          missions.map(mission => (
            <div key={mission.id} className={`p-5 rounded-xl border transition-all ${mission.completed ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-eco-200 hover:border-eco-400 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold text-eco-600 uppercase tracking-wider mb-1 block">{mission.category}</span>
                  <h3 className={`font-semibold text-lg ${mission.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{mission.title}</h3>
                </div>
                <button onClick={() => completeMission(mission.id)} disabled={mission.completed} className="text-eco-500 hover:text-eco-700 disabled:text-gray-300 transition-colors">
                  {mission.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">{mission.description}</p>
              <div className="flex gap-3 text-sm font-medium">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg">-{mission.expectedCo2Save}kg CO₂</span>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg">+{mission.xpReward} XP</span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">{mission.difficulty}</span>
              </div>
            </div>
          ))
        ) : (
           <p className="text-sm text-gray-500 text-center mt-10">No missions available.</p>
        )}
      </div>
    </div>
  );
};

const ManualTracker = () => {
  const { addLog } = useAppContext();
  const [category, setCategory] = useState(MANUAL_CATEGORIES[0].name);
  const [detail, setDetail] = useState(MANUAL_CATEGORIES[0].options[0]);
  const [amount, setAmount] = useState('');

  const activeCatData = MANUAL_CATEGORIES.find(c => c.name === category);

  const getIcon = (name: string) => {
    switch(name) {
      case 'Transport': return <Car size={18}/>;
      case 'Electricity': return <Zap size={18}/>;
      case 'Food': return <Utensils size={18}/>;
      case 'Water': return <Droplets size={18}/>;
      case 'Waste': return <Trash2 size={18}/>;
      case 'Shopping': return <ShoppingBag size={18}/>;
      case 'Digital': return <Monitor size={18}/>;
      default: return <Plus size={18}/>;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    let co2 = 0; let xp = 5; const val = parseFloat(amount);
    if (category === 'Transport') {
      if (['Walking', 'Cycling', 'Bike'].includes(detail)) { co2 = -0.5 * val; xp = 20; }
      else co2 = val * 0.2; 
    } else if (category === 'Electricity') { co2 = val * 0.4; } 
    else if (category === 'Food') {
      if (['Vegetarian', 'Vegan'].includes(detail)) { co2 = val * 0.5; xp = 15; }
      else co2 = val * 3;
    } else { co2 = val * 1.5; }

    addLog({ category, description: `${detail} (${val})`, co2Impact: parseFloat(co2.toFixed(2)), xpEarned: xp });
    setAmount('');
    alert('Activity logged successfully!');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {MANUAL_CATEGORIES.map(c => (
          <button key={c.name} onClick={() => { setCategory(c.name); setDetail(c.options[0]); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border whitespace-nowrap transition-all ${category === c.name ? 'border-eco-500 bg-eco-50 text-eco-700 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {getIcon(c.name)} {c.name}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Activity</label>
          <select value={detail} onChange={(e) => setDetail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-eco-500 outline-none bg-white">
            {activeCatData?.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount / Duration</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter value (e.g., km, hours, items)" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-eco-500 outline-none" required min="0.1" step="0.1" />
        </div>
        <button type="submit" className="w-full bg-eco-600 hover:bg-eco-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <Plus size={20} /> Log Activity
        </button>
      </form>
    </div>
  );
};

const SmartScanner = () => {
  const { addLog } = useAppContext();
  const [text, setText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    if (!text) return;
    setIsScanning(true);
    const analysis = await analyzeReceiptText(text);
    setResult(analysis);
    setIsScanning(false);
  };

  const handleSave = () => {
    if (result) {
      addLog({ category: 'Shopping/Food', description: `AI Scanned: ${result.items.join(', ')}`, co2Impact: result.totalCo2, xpEarned: 15 });
      setResult(null); setText(''); alert('Scanned items logged!');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex gap-3">
        <Camera className="text-blue-500 shrink-0" />
        <p className="text-sm text-blue-800">
          <strong>AI Smart Scanner:</strong> Scan Electricity Bills, Shopping Bills, Travel Tickets, Food Bills, Receipts. (Simulated via text input for demo).
        </p>
      </div>

      <textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleScan();
          }
        }}
        placeholder="Describe your bill/receipt here... (Press Enter to Analyze)" 
        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-eco-500 outline-none min-h-[120px] mb-4 transition-shadow shadow-sm" 
      />

      <button onClick={handleScan} disabled={isScanning || !text} className="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg w-full md:w-auto">
        {isScanning ? 'Analyzing with AI...' : 'Analyze Text'}
      </button>

      {result && (
        <div className="mt-6 p-5 border border-eco-200 bg-eco-50 rounded-xl animate-fade-in">
          <h3 className="font-bold text-eco-800 mb-2">AI Analysis Result</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 mb-3">
            {result.items.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
          <p className="text-lg font-semibold text-gray-800 mb-2">Estimated Impact: <span className="text-red-500">{result.totalCo2} kg CO₂e</span></p>
          <p className="text-sm text-eco-700 italic mb-4">💡 AI Advice: {result.advice}</p>
          <button onClick={handleSave} className="bg-eco-600 hover:bg-eco-700 text-white font-bold py-2 px-4 rounded-lg text-sm">Log to Tracker</button>
        </div>
      )}
    </div>
  );
};
