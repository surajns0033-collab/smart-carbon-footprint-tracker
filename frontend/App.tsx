import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Onboarding } from './components/Onboarding';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Tracker } from './components/Tracker';
import { GovTargets } from './components/GovTargets';
import { LearnHub } from './components/LearnHub';
import { Profile } from './components/Profile';
import { Simulator, Library, Leaderboard } from './components/Views';
import { AIChat } from './components/AIChat';

const MainApp: React.FC = () => {
  const { profile } = useAppContext();
  const [currentView, setCurrentView] = useState('dashboard');

  if (!profile) {
    return <Onboarding />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'tracker': return <Tracker />;
      case 'gov': return <GovTargets />;
      case 'simulator': return <Simulator />;
      case 'library': return <Library />;
      case 'leaderboard': return <Leaderboard />;
      case 'learn': return <LearnHub />;
      case 'ai': return <AIChat />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
