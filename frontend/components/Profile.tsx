import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Settings, Save, Shield, Bell, Download, Trash2, Info, FileText, FileSpreadsheet } from 'lucide-react';
import { 
  LANGUAGES, COUNTRIES, AGE_GROUPS, GENDERS, OCCUPATIONS, GOALS, 
  TRACKER_MODES, AI_CATEGORIES, AI_LEVELS, getStatesForCountry, getCitiesForState 
} from '../constants';

export const Profile: React.FC = () => {
  const { profile, setProfile, stats, logs, resetApp } = useAppContext();
  const [formData, setFormData] = useState(profile!);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('profile');

  const [privacySettings, setPrivacySettings] = useState({ anonymous: false, privateProfile: true });
  const [notifSettings, setNotifSettings] = useState({ daily: true, goal: true, xp: true, badge: true, mission: true, gov: true });

  useEffect(() => {
    if (formData.country) setAvailableStates(getStatesForCountry(formData.country));
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) setAvailableCities(getCitiesForState(formData.state));
  }, [formData.state]);

  const handleSaveProfile = () => {
    setProfile(formData);
    alert('Profile Settings Saved Successfully!');
  };

  const handleExportExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Category,Description,CO2 Impact (kg),XP Earned\n";
    logs.forEach(log => {
      csvContent += `${new Date(log.date).toLocaleDateString()},${log.category},"${log.description}",${log.co2Impact},${log.xpEarned}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "SmartCarbon_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Daily Target Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1f2937; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #16a34a; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #16a34a; margin: 0 0 10px 0; font-size: 28px; }
            .header p { margin: 0; color: #6b7280; }
            .stats-grid { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 40px; }
            .stat-box { flex: 1; min-width: 150px; background: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #bbf7d0; text-align: center; }
            .stat-box h3 { margin: 0 0 10px 0; font-size: 14px; color: #15803d; text-transform: uppercase; letter-spacing: 0.05em; }
            .stat-box p { margin: 0; font-size: 28px; font-weight: bold; color: #166534; }
            h2 { color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            th { background-color: #f9fafb; font-weight: 600; color: #4b5563; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .impact-positive { color: #ef4444; font-weight: bold; }
            .impact-negative { color: #16a34a; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Smart Carbon - Daily Target Report</h1>
            <p>Generated for: <strong>${profile?.userName || 'User'}</strong> | Date: ${new Date().toLocaleDateString()}</p>
            <p>Location: ${profile?.city}, ${profile?.country}</p>
          </div>
          
          <h2>Performance Summary</h2>
          <div class="stats-grid">
            <div class="stat-box"><h3>Carbon Score</h3><p>${stats.carbonScore.toFixed(1)} kg</p></div>
            <div class="stat-box"><h3>Total CO₂ Saved</h3><p>${stats.co2SavedKg.toFixed(1)} kg</p></div>
            <div class="stat-box"><h3>Green XP</h3><p>${stats.greenXP}</p></div>
            <div class="stat-box"><h3>Health Score</h3><p>${stats.healthyLivingScore}/100</p></div>
          </div>

          <h2>Recent Activity Log</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Activity Description</th>
                <th>Impact (kg CO₂)</th>
                <th>XP Earned</th>
              </tr>
            </thead>
            <tbody>
              ${logs.length > 0 ? logs.map(log => `
                <tr>
                  <td>${new Date(log.date).toLocaleDateString()}</td>
                  <td>${log.category}</td>
                  <td>${log.description}</td>
                  <td class="${log.co2Impact > 0 ? 'impact-positive' : 'impact-negative'}">
                    ${log.co2Impact > 0 ? '+' : ''}${log.co2Impact}
                  </td>
                  <td>+${log.xpEarned}</td>
                </tr>
              `).join('') : '<tr><td colspan="5" style="text-align:center; padding: 20px;">No activities logged yet. Start tracking to see your impact!</td></tr>'}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Smart Carbon Footprint Tracker - Empowering Global Sustainability</p>
            <p>Report generated automatically. Keep up the great work for our planet! 🌱</p>
          </div>
        </body>
      </html>
    `;
    
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(content);
      doc.close();
      
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account and all data? This action cannot be undone.")) {
      resetApp();
      alert("Your account and all associated data have been permanently deleted.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gray-200 text-gray-700 rounded-xl">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500">Manage your profile, privacy, and preferences. 100% Free Forever.</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200 scrollbar-hide">
        {['profile', 'privacy', 'notifications', 'about us'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'text-eco-600 border-b-2 border-eco-600' : 'text-gray-500 hover:text-gray-800'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2"><User className="text-eco-500"/> Edit Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-eco-500 outline-none transition-shadow" value={formData.userName || ''} onChange={e => setFormData({...formData, userName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-eco-500 outline-none transition-shadow" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-eco-500 outline-none transition-shadow" value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})}>
                {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-eco-500 outline-none transition-shadow" value={formData.country} onChange={e => { setFormData({...formData, country: e.target.value, state: '', city: ''}); }}>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-eco-500 outline-none transition-shadow" value={formData.state} onChange={e => { setFormData({...formData, state: e.target.value, city: ''}); }}>
                <option value="">Select State</option>
                {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-eco-500 outline-none transition-shadow" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                <option value="">Select City</option>
                {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-eco-500 outline-none transition-shadow" value={formData.ageGroup} onChange={e => setFormData({...formData, ageGroup: e.target.value})}>
                {AGE_GROUPS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tracker Mode</label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-eco-500 outline-none transition-shadow" value={formData.trackerMode} onChange={e => setFormData({...formData, trackerMode: e.target.value})}>
                {TRACKER_MODES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            {formData.trackerMode === '🤖 AI Automatic Tracker' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">AI Category</label>
                  <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-eco-500 outline-none transition-shadow" value={formData.aiCategory} onChange={e => setFormData({...formData, aiCategory: e.target.value})}>
                    {AI_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">AI Level</label>
                  <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-eco-500 outline-none transition-shadow" value={formData.aiLevel} onChange={e => setFormData({...formData, aiLevel: e.target.value})}>
                    {AI_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </>
            )}
          </div>
          <button type="submit" className="mt-4 bg-eco-600 hover:bg-eco-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg">
            <Save size={20} /> Save Changes
          </button>
        </form>
      )}

      {activeTab === 'privacy' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><Shield className="text-gray-700"/> Privacy & Data Controls</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-eco-600" checked={privacySettings.anonymous} onChange={e => setPrivacySettings({...privacySettings, anonymous: e.target.checked})} /> 
              <span>Anonymous Mode (Hide name on leaderboards)</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-eco-600" checked={privacySettings.privateProfile} onChange={e => setPrivacySettings({...privacySettings, privateProfile: e.target.checked})} /> 
              <span>Private Profile (Only you can see your stats)</span>
            </label>
            
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <p className="text-sm font-bold text-gray-700 mb-2">Export Your Data</p>
              <div className="flex gap-3 flex-col md:flex-row">
                <button onClick={handleExportExcel} className="flex-1 flex justify-center items-center gap-2 p-3 border border-green-200 bg-green-50 rounded-xl hover:bg-green-100 font-medium text-green-700 transition-colors">
                  <FileSpreadsheet size={18} /> Export to Excel (CSV)
                </button>
                <button onClick={handleExportPDF} className="flex-1 flex justify-center items-center gap-2 p-3 border border-red-200 bg-red-50 rounded-xl hover:bg-red-100 font-medium text-red-700 transition-colors">
                  <FileText size={18} /> Daily Target Report (PDF)
                </button>
              </div>
              
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button onClick={handleDeleteAccount} className="w-full flex items-center justify-center gap-2 p-3 border border-red-300 bg-red-100 rounded-xl hover:bg-red-200 font-bold text-red-800 transition-colors">
                  <Trash2 size={18} /> Delete My Account & Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><Bell className="text-yellow-500"/> Smart Notifications</h2>
          <div className="space-y-3">
            {Object.entries(notifSettings).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()} Notifications</span>
                <input type="checkbox" className="w-5 h-5 text-eco-600" checked={value} onChange={e => setNotifSettings({...notifSettings, [key]: e.target.checked})} />
              </label>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'about us' && (
        <div className="bg-gradient-to-br from-eco-600 to-teal-700 p-8 rounded-2xl shadow-lg text-white text-center space-y-4">
          <Info size={48} className="mx-auto text-eco-200" />
          <h2 className="text-2xl font-bold">About Smart Carbon Tracker</h2>
          <p className="text-eco-100 leading-relaxed text-lg">
            To maintain a balanced environment for the public and our planet, everyone's contribution and a conscious change in lifestyle are essential.
          </p>
          <p className="text-eco-50 text-sm mt-4">
            This platform is 100% free and built to empower individuals globally to make smart, data-driven decisions for a cleaner planet. Every small action counts towards our collective Net Zero goals.
          </p>
        </div>
      )}
    </div>
  );
};
