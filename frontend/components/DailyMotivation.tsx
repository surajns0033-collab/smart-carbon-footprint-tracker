import React, { useEffect, useState } from 'react';
import { useWasteTips } from '../hooks/useWasteTips';
import { ArrowRight } from 'lucide-react';

export const DailyMotivation: React.FC = () => {
  const { tips } = useWasteTips();
  const [day, setDay] = useState<number>(0);
  const [randomTip, setRandomTip] = useState<{title:string; link:string} | null>(null);

  // Day counter using localStorage
  useEffect(() => {
    const storedDay = Number(localStorage.getItem('dailyMotivationDay') || '0');
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('dailyMotivationLastVisit');
    let newDay = storedDay;
    if (lastVisit !== today) {
      newDay = storedDay + 1;
      localStorage.setItem('dailyMotivationDay', newDay.toString());
      localStorage.setItem('dailyMotivationLastVisit', today);
    }
    setDay(newDay);
  }, []);

  // Pick a random tip when tips are available
  useEffect(() => {
    if (tips.length > 0) {
      const tip = tips[Math.floor(Math.random() * tips.length)];
      setRandomTip(tip);
    }
  }, [tips]);

  if (!randomTip) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-2xl shadow-sm border border-emerald-200 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
          <ArrowRight className="text-emerald-600" size={20} />
          Day {day} of Your Carbon Journey
        </h2>
      </div>
      <p className="text-sm text-emerald-700 mb-2">{randomTip.title}</p>
      <a
        href={randomTip.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-600 hover:underline text-sm font-medium"
      >
        Learn More
      </a>
    </div>
  );
};
