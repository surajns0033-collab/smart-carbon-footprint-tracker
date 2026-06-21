import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { Layout } from './components/Layout';

// Lazy loaded page components
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TrackerPage = lazy(() => import('./pages/TrackerPage'));
const GovTargetsPage = lazy(() => import('./pages/GovTargetsPage'));
const SimulatorPage = lazy(() => import('./pages/SimulatorPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const LearnHubPage = lazy(() => import('./pages/LearnHubPage'));
const AIChatPage = lazy(() => import('./pages/AIChatPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const MainApp: React.FC = () => {
  const { profile } = useAppContext();

  if (!profile) {
    return (
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <OnboardingPage />
      </Suspense>
    );
  }

  return (
    <Layout>
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/gov" element={<GovTargetsPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/learn" element={<LearnHubPage />} />
          <Route path="/ai" element={<AIChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Suspense>
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
