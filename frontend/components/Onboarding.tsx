import React, { useState } from 'react';
import { Globe, MapPin, User, ArrowRight, Leaf } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { LANGUAGES, COUNTRIES } from '../constants';

export const Onboarding: React.FC = () => {
  const { setProfile } = useAppContext();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    userName: '',
    language: 'English',
    country: '',
    // Default values for the rest, editable in Profile Settings
    state: 'Not Specified',
    city: 'Not Specified',
    ageGroup: '18-24',
    goal: '🌍 Reduce Carbon Footprint',
    trackerMode: '🤖 AI Automatic Tracker',
    hasSeenTutorial: false
  });

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else setProfile(formData as any);
  };

  const isStepValid = () => {
    if (step === 1) return formData.userName.trim() !== '' && formData.language !== '';
    if (step === 2) return formData.country !== '';
    return false;
  };

  const getGreeting = (lang: string) => {
    const greetings: Record<string, string> = {
      English: 'Welcome', Hindi: 'नमस्ते', Marathi: 'नमस्कार', Bengali: 'স্বাগতম',
      Tamil: 'வரவேற்பु', Telugu: 'స్వాగతం', Kannada: 'ಸ್ವಾಗತ', Malayalam: 'സ്ವಾಗതം',
      Gujarati: 'સ્વાગત છે', Punjabi: 'ਜੀ ਆਇਆਂ ਨੂੰ', Urdu: 'خوش آمدید', Arabic: 'أهلاً بك',
      Spanish: 'Bienvenido', French: 'Bienvenue', German: 'Willkommen', Portuguese: 'Bem-vindo',
      Chinese: '欢迎', Japanese: 'ようこそ', Korean: '환영합니다'
    };
    return greetings[lang] || 'Welcome';
  };

  return (
    <div className="min-h-screen bg-eco-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-800 backdrop-blur-md">
        <div className="bg-eco-600 p-8 text-white text-center relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full"><path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor"/></svg>
          </div>
          <Leaf className="w-16 h-16 mx-auto mb-4 text-eco-200" />
          <h1 className="text-3xl font-bold mb-2">{getGreeting(formData.language)}</h1>
          <p className="text-eco-100 text-sm font-medium">Smart Carbon Footprint Tracker</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (isStepValid()) handleNext(); }} className="p-8">
          <div className="min-h-[200px]">
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-350 mb-2"><User className="text-eco-500" size={18}/> What should we call you?</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-eco-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none text-lg transition-shadow"
                    value={formData.userName} 
                    onChange={e => setFormData({...formData, userName: e.target.value})} 
                    autoFocus
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-350 mb-2"><Globe className="text-eco-500" size={18}/> Preferred Language</label>
                  <select 
                    className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-eco-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none text-lg transition-shadow cursor-pointer"
                    value={formData.language}
                    onChange={e => setFormData({...formData, language: e.target.value})}
                  >
                    {LANGUAGES.map(l => <option key={l} value={l} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">{l}</option>)}
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-350 mb-2"><MapPin className="text-eco-500" size={18}/> Where are you from?</label>
                  <select 
                    className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-eco-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none text-lg transition-shadow cursor-pointer"
                    value={formData.country} 
                    onChange={e => setFormData({...formData, country: e.target.value})}
                    autoFocus
                  >
                    <option value="" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Select Country</option>
                    {COUNTRIES.map(c => <option key={c} value={c} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">{c}</option>)}
                  </select>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">You can add more details like State, City, and Goals later in Profile Settings.</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button 
                type="button" 
                onClick={() => setStep(step - 1)}
                className="px-6 py-4 bg-gray-150 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all text-lg cursor-pointer"
              >
                Back
              </button>
            )}
            <button 
              type="submit"
              disabled={!isStepValid()}
              className="flex-1 bg-eco-600 hover:bg-eco-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-lg shadow-md hover:shadow-lg cursor-pointer"
            >
              {step === 2 ? 'Start Tracking' : 'Continue'} <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
