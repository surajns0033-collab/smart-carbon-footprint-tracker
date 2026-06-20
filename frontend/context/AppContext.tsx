import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { UserProfile, UserStats, ActivityLog, AIMission } from '../types';
import { generateDailyMissions } from '../services/ai';

interface AppContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  stats: UserStats;
  logs: ActivityLog[];
  addLog: (log: Omit<ActivityLog, 'id' | 'date'>) => void;
  missions: AIMission[];
  completeMission: (id: string) => void;
  isLoadingMissions: boolean;
  logout: () => void;
  resetApp: () => void;
}

const defaultStats: UserStats = {
  carbonScore: 850,
  healthyLivingScore: 50,
  greenXP: 0,
  level: 1,
  co2SavedKg: 0,
  moneySaved: 0,
  electricitySaved: 0,
  waterSaved: 0,
  wasteRecycled: 0,
  treesEquivalent: 0,
  streakDays: 1,
  countryContribution: 0.0001,
  stateContribution: 0.005,
  cityContribution: 0.02,
  globalContribution: 0.000001
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try { const saved = localStorage.getItem('sc_profile'); return saved ? JSON.parse(saved) : null; } catch { return null; }
  });
  const [stats, setStats] = useState<UserStats>(() => {
    try { const saved = localStorage.getItem('sc_stats'); return saved ? JSON.parse(saved) : defaultStats; } catch { return defaultStats; }
  });
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    try { const saved = localStorage.getItem('sc_logs'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });
  const [missions, setMissions] = useState<AIMission[]>(() => {
    try { const saved = localStorage.getItem('sc_missions'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });
  
  const [isLoadingMissions, setIsLoadingMissions] = useState(false);

  // Save to localStorage whenever state changes
  useEffect(() => { localStorage.setItem('sc_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('sc_stats', JSON.stringify(stats)); }, [stats]);
  useEffect(() => { localStorage.setItem('sc_logs', JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem('sc_missions', JSON.stringify(missions)); }, [missions]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  useEffect(() => {
    if (profile && missions.length === 0 && profile.trackerMode === '🤖 AI Automatic Tracker') {
      const fetchMissions = async () => {
        setIsLoadingMissions(true);
        const newMissions = await generateDailyMissions(profile);
        setMissions(newMissions);
        setIsLoadingMissions(false);
      };
      fetchMissions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.trackerMode]);

  const addLog = (logData: Omit<ActivityLog, 'id' | 'date'>) => {
    const newLog: ActivityLog = {
      ...logData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setLogs(prev => [newLog, ...prev]);
    
    setStats(prev => {
      const newXp = prev.greenXP + newLog.xpEarned;
      const co2Saved = newLog.co2Impact < 0 ? Math.abs(newLog.co2Impact) : 0;
      
      let money = 0, elec = 0, water = 0, waste = 0;
      if (newLog.category === 'Electricity' && co2Saved > 0) { elec = co2Saved * 2; money = elec * 0.15; }
      if (newLog.category === 'Water' && co2Saved > 0) { water = co2Saved * 10; money = water * 0.05; }
      if (newLog.category === 'Waste' && co2Saved > 0) { waste = co2Saved * 0.5; }
      if (newLog.category === 'Transport' && co2Saved > 0) { money = co2Saved * 0.5; }

      return {
        ...prev,
        greenXP: newXp,
        co2SavedKg: prev.co2SavedKg + co2Saved,
        carbonScore: Math.max(0, prev.carbonScore + newLog.co2Impact),
        healthyLivingScore: Math.min(100, prev.healthyLivingScore + (newLog.co2Impact < 0 ? 2 : -1)),
        moneySaved: prev.moneySaved + money,
        electricitySaved: prev.electricitySaved + elec,
        waterSaved: prev.waterSaved + water,
        wasteRecycled: prev.wasteRecycled + waste,
        countryContribution: prev.countryContribution + (co2Saved * 0.00001),
        stateContribution: prev.stateContribution + (co2Saved * 0.0001),
        cityContribution: prev.cityContribution + (co2Saved * 0.001),
      };
    });
  };

  const completeMission = (id: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id && !m.completed) {
        addLog({
          category: m.category,
          description: `AI Mission: ${m.title}`,
          co2Impact: -m.expectedCo2Save,
          xpEarned: m.xpReward
        });
        return { ...m, completed: true };
      }
      return m;
    }));
  };

  const logout = () => {
    setProfile(null);
    // Keeps stats/logs in local storage, just requires re-entering profile info
  };

  const resetApp = () => {
    localStorage.removeItem('sc_profile');
    localStorage.removeItem('sc_stats');
    localStorage.removeItem('sc_logs');
    localStorage.removeItem('sc_missions');
    setProfile(null);
    setStats(defaultStats);
    setLogs([]);
    setMissions([]);
  };

  return (
    <AppContext.Provider value={{ profile, setProfile, updateProfile, stats, logs, addLog, missions, completeMission, isLoadingMissions, logout, resetApp }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
