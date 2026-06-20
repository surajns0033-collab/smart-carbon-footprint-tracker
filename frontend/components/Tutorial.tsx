import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Leaf, Target, Zap, Globe2, CheckCircle2 } from 'lucide-react';

export const Tutorial: React.FC = () => {
  const { updateProfile } = useAppContext();
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <Leaf size={40} className="text-eco-500" />,
      title: "Welcome to Smart Carbon Tracker!",
      desc: "Your personal AI-powered assistant to help you reduce your carbon footprint, save money, and live healthier."
    },
    {
      icon: <Target size={40} className="text-blue-500" />,
      title: "Track Your Impact",
      desc: "Use the Dashboard toggle to switch between 'AI Automatic' missions or 'Manual' tracking. Watch your scores update live!"
    },
    {
      icon: <Globe2 size={40} className="text-indigo-500" />,
      title: "Global & Local Goals",
      desc: "See how your daily actions directly contribute to your City, State, and Country's official Net Zero targets."
    },
    {
      icon: <Zap size={40} className="text-yellow-500" />,
      title: "Earn Green XP",
      desc: "Complete missions, log eco-friendly activities, and climb the leaderboards to become a Climate Legend!"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      updateProfile({ hasSeenTutorial: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
          <div 
            className="h-full bg-eco-500 transition-all duration-300" 
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-center mb-6 mt-4">
          <div className="p-4 bg-gray-50 rounded-full shadow-inner">
            {steps[step].icon}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{steps[step].title}</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">{steps[step].desc}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-eco-500' : 'bg-gray-200'}`} />
            ))}
          </div>
          <button 
            onClick={handleNext}
            className="bg-eco-600 hover:bg-eco-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors"
          >
            {step === steps.length - 1 ? (
              <>Got it! <CheckCircle2 size={20} /></>
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
