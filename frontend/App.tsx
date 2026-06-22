import React, { Suspense, lazy, Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { Layout } from './components/Layout';

// ── Lazy loaded page components for code-splitting & efficiency ──
const OnboardingPage  = lazy(() => import('./pages/OnboardingPage'));
const DashboardPage   = lazy(() => import('./pages/DashboardPage'));
const DailyLogPage     = lazy(() => import('./pages/DailyLogPage'));
const AnalyticsPage   = lazy(() => import('./pages/AnalyticsPage'));
const GoalsPage       = lazy(() => import('./pages/GoalsPage'));
const AICoachPage      = lazy(() => import('./pages/AICoachPage'));
const ChallengesPage  = lazy(() => import('./pages/ChallengesPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const CommunityPage   = lazy(() => import('./pages/CommunityPage'));
const GlobalExplorerPage = lazy(() => import('./pages/GlobalExplorerPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const EcoCompanionPage = lazy(() => import('./pages/EcoCompanionPage'));
const SettingsPage     = lazy(() => import('./pages/SettingsPage'));

// Utility pages (kept for full compatibility)
const SimulatorPage   = lazy(() => import('./pages/SimulatorPage'));
const LibraryPage     = lazy(() => import('./pages/LibraryPage'));
const LearnHubPage    = lazy(() => import('./pages/LearnHubPage'));

// ── Loading fallback with accessible announcement ──
const PageLoadingFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Page loading"
    className="flex items-center justify-center h-full w-full min-h-[200px]"
  >
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"
        aria-hidden="true"
      />
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading...</span>
    </div>
  </div>
);

// ── Error Boundary for resilient component error handling ──
interface ErrorBoundaryState { hasError: boolean; error: Error | null; }
interface ErrorBoundaryProps { children: ReactNode; fallback?: ReactNode; }

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[SmartCarbon ErrorBoundary]', error, info.componentStack);
    if (error && error.message && (
      error.message.includes('dynamically imported module') || 
      error.message.includes('Failed to fetch')
    )) {
      console.warn('Dynamic import chunk error detected. Auto-reloading page...');
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div
          role="alert"
          aria-live="assertive"
          className="flex flex-col items-center justify-center h-full p-8 text-center gap-4"
        >
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Something went wrong</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors cursor-pointer"
            aria-label="Retry loading the page"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Main application routing ──
const MainApp: React.FC = () => {
  const { profile } = useAppContext();

  if (!profile) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageLoadingFallback />}>
          <OnboardingPage />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <Layout>
      <ErrorBoundary>
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/"            element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"   element={<DashboardPage />} />
            <Route path="/daily-log"   element={<DailyLogPage />} />
            <Route path="/tracker"     element={<Navigate to="/daily-log" replace />} />
            <Route path="/analytics"   element={<AnalyticsPage />} />
            <Route path="/goals"       element={<GoalsPage />} />
            <Route path="/gov"         element={<Navigate to="/goals" replace />} />
            <Route path="/ai-coach"    element={<AICoachPage />} />
            <Route path="/ai"          element={<Navigate to="/ai-coach" replace />} />
            <Route path="/challenges"  element={<ChallengesPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/community"   element={<CommunityPage />} />
            <Route path="/global-explorer" element={<GlobalExplorerPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/eco-companion" element={<EcoCompanionPage />} />
            <Route path="/settings"    element={<SettingsPage />} />
            <Route path="/profile"     element={<Navigate to="/settings" replace />} />
            <Route path="/simulator"   element={<SimulatorPage />} />
            <Route path="/library"     element={<LibraryPage />} />
            <Route path="/learn"       element={<LearnHubPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

/**
 * Root application component.
 * Wraps the entire app with AppProvider (global state) and BrowserRouter.
 */
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="/smart-carbon-footprint-tracker">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:bg-emerald-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:outline-none"
        >
          Skip to main content
        </a>
        <MainApp />
      </BrowserRouter>
    </AppProvider>
  );
}

// Automatically recover from chunk loading / asset cache mismatches by reloading the page
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', () => {
    console.warn('Vite preload error detected. Force reloading page...');
    window.location.reload();
  });
}
