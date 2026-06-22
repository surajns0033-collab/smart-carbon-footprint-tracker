import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, LineChart, Target, Bot, Trophy, Award, Users, Globe, Medal, Leaf, Settings, LogOut, Sun, Moon, Image as ImageIcon, Trash2, Flame
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../services/translation';

interface LayoutProps {
  children: React.ReactNode;
}

/** True when the physical browser viewport width is < 768px (real phone/tablet). */
function useActualMobile() {
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth < 768);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, profile, stats } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const isActualMobile = useActualMobile();

  const [bgImage, setBgImage] = React.useState<string | null>(() => {
    try {
      const val = localStorage.getItem('sc_bg_image');
      if (val === '') return null; // explicitly cleared
      return val || 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1920&auto=format&fit=crop';
    } catch {
      return 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1920&auto=format&fit=crop';
    }
  });

  const [darkMode, setDarkMode] = React.useState<boolean>(() => {
    try {
      const val = localStorage.getItem('sc_dark_mode');
      return val === null ? true : val === 'true'; // Default to true (Dark Mode) for futuristic aesthetic
    } catch {
      return true;
    }
  });

  const [customUrl, setCustomUrl] = React.useState('');

  React.useEffect(() => {
    try { localStorage.setItem('sc_bg_image', bgImage || ''); } catch {}
  }, [bgImage]);

  React.useEffect(() => {
    try { localStorage.setItem('sc_dark_mode', darkMode ? 'true' : 'false'); } catch {}
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  React.useEffect(() => {
    const handleNav = () => navigate('/tracker');
    window.addEventListener('navigate-tracker', handleNav);
    return () => window.removeEventListener('navigate-tracker', handleNav);
  }, [navigate]);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBgImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) { setBgImage(customUrl.trim()); setCustomUrl(''); }
  };

  const themeConfig = {
    light: {
      bg: bgImage ? '' : 'bg-green-50/60',
      aside: 'bg-white/90 border-gray-200 text-gray-800',
      navActive: 'bg-eco-50 text-eco-700 shadow-sm',
      navInactive: 'text-gray-600 hover:bg-eco-50 hover:text-eco-600',
      title: 'text-eco-600',
      content: bgImage ? 'backdrop-blur-md bg-white/70 text-gray-900' : 'bg-transparent text-gray-900',
      border: 'border-gray-100',
    },
    dark: {
      bg: bgImage ? '' : 'bg-gray-950 text-gray-100',
      aside: 'bg-gray-900/95 border-gray-800 text-gray-100',
      navActive: 'bg-gray-800 text-teal-400 shadow-md',
      navInactive: 'text-gray-400 hover:bg-gray-800 hover:text-teal-300',
      title: 'text-teal-400',
      content: bgImage ? 'backdrop-blur-md bg-gray-950/75 text-gray-100' : 'bg-transparent text-gray-100',
      border: 'border-gray-800',
    },
  };

  const currentTheme = darkMode ? themeConfig.dark : themeConfig.light;
  // Extract last segment so /smart-carbon-footprint-tracker/dashboard → dashboard
  const currentView = location.pathname.split('/').filter(Boolean).pop() || 'dashboard';

  const inlineBgStyle = bgImage ? {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : undefined;

  const allNavItems = [
    { id: 'dashboard',       label: t('dashboard'),       icon: <LayoutDashboard size={18} /> },
    { id: 'daily-log',      label: t('daily_log'),       icon: <Calendar size={18} /> },
    { id: 'analytics',       label: t('analytics'),       icon: <LineChart size={18} /> },
    { id: 'goals',           label: t('goals'),           icon: <Target size={18} /> },
    { id: 'ai-coach',        label: t('ai_coach'),        icon: <Bot size={18} /> },
    { id: 'challenges',      label: t('challenges'),      icon: <Trophy size={18} /> },
    { id: 'leaderboard',     label: t('leaderboard'),     icon: <Award size={18} /> },
    { id: 'community',       label: t('community'),       icon: <Users size={18} /> },
    { id: 'global-explorer', label: t('global_explorer'), icon: <Globe size={18} /> },
    { id: 'achievements',    label: t('achievements'),    icon: <Medal size={18} /> },
    { id: 'eco-companion',   label: t('eco_companion'),   icon: <Leaf size={18} /> },
    { id: 'settings',       label: t('settings'),        icon: <Settings size={18} /> },
  ];

  const mobileNavItems = [
    { id: 'dashboard',     label: 'Home',     icon: <LayoutDashboard size={20} /> },
    { id: 'daily-log',      label: 'Track',    icon: <Calendar size={20} /> },
    { id: 'goals',         label: 'Goals',    icon: <Target size={20} /> },
    { id: 'ai-coach',      label: 'AI Coach', icon: <Bot size={20} /> },
    { id: 'settings',      label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleNavClick = (id: string) => navigate(`/${id}`);

  const navRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const mobileNavRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % allNavItems.length;
      navRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + allNavItems.length) % allNavItems.length;
      navRefs.current[prevIndex]?.focus();
    }
  };

  const handleMobileKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % mobileNavItems.length;
      mobileNavRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + mobileNavItems.length) % mobileNavItems.length;
      mobileNavRefs.current[prevIndex]?.focus();
    }
  };

  // ── REAL MOBILE DEVICE LAYOUT (viewport < 768 px) ────────────────────────────
  // Completely bypasses the desktop sidebar and the phone-mockup simulator.
  // Shows a native sticky header + scrollable content + fixed bottom nav bar.
  if (isActualMobile) {
    return (
      <div
        className={`flex flex-col min-h-screen ${currentTheme.bg}`}
        style={inlineBgStyle}
        role="application"
        aria-label="Smart Carbon Footprint Tracker"
      >
        {/* Sticky top header */}
        <header
          className={`sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b backdrop-blur-md ${currentTheme.aside}`}
        >
          <div className={`flex items-center gap-2 font-bold text-base ${currentTheme.title}`}>
            <Leaf size={18} className="fill-current" aria-hidden="true" />
            <span>Smart Carbon</span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-pointer"
          >
            {darkMode
              ? <Sun size={16} className="text-yellow-500" aria-hidden="true" />
              : <Moon size={16} className="text-indigo-500" aria-hidden="true" />}
          </button>
        </header>

        {/* Scrollable page content — pb-24 so bottom nav never covers content */}
        <main
          id="main-content"
          tabIndex={-1}
          className={`flex-1 overflow-y-auto outline-none ${currentTheme.content}`}
        >
          <div className="px-3 py-4 pb-24">
            {children}
          </div>
        </main>

        {/* Fixed bottom navigation bar */}
        <nav
          aria-label="Mobile navigation"
          className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 border-t border-gray-200 dark:border-gray-800 backdrop-blur-md"
        >
          <div className="flex justify-around items-center py-2 px-1">
            {mobileNavItems.map((item, idx) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  ref={el => { mobileNavRefs.current[idx] = el; }}
                  onClick={() => handleNavClick(item.id)}
                  onKeyDown={e => handleMobileKeyDown(e, idx)}
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                  className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[52px] ${
                    active ? 'text-emerald-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  <span className={`transition-transform ${active ? 'scale-110' : ''}`}>
                    {item.icon}
                  </span>
                  <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                  {active && <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-teal-400" />}
                </button>
              );
            })}
          </div>
          {/* iOS home-indicator safe area */}
          <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
        </nav>
      </div>
    );
  }

  // ── DESKTOP / LARGE-SCREEN LAYOUT (viewport ≥ 768 px) ────────────────────────
  return (
    <div
      className={`flex h-screen overflow-hidden transition-all duration-300 relative ${currentTheme.bg}`}
      style={inlineBgStyle}
      role="application"
      aria-label="Smart Carbon Footprint Tracker Application"
    >
      {/* Top-right dark mode toggle only */}
      <div
        role="toolbar"
        aria-label="Theme controls"
        className="absolute top-4 right-4 z-50 flex bg-white/90 dark:bg-gray-900/90 p-1 rounded-xl border border-gray-200 dark:border-gray-800 backdrop-blur-md shadow-lg"
      >
        <button
          onClick={() => setDarkMode(!darkMode)}
          aria-pressed={darkMode}
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer flex items-center justify-center transition-all"
        >
          {darkMode
            ? <Sun size={15} className="text-yellow-500 animate-pulse" aria-hidden="true" />
            : <Moon size={15} className="text-indigo-500" aria-hidden="true" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-64 border-r flex flex-col transition-all duration-300 ${currentTheme.aside} backdrop-blur-md`}>
        <div className={`p-5 flex items-center gap-3 border-b transition-colors duration-300 ${currentTheme.border}`}>
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-teal-400 shrink-0">
            <Leaf className="fill-current w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white leading-none">EcoTrack</h2>
            <span className="text-[10px] font-medium text-emerald-600 dark:text-teal-400">Live Green, Live Clean</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
          {allNavItems.map((item, idx) => (
            <button
              key={item.id}
              ref={el => { navRefs.current[idx] = el; }}
              onClick={() => handleNavClick(item.id)}
              onKeyDown={e => handleKeyDown(e, idx)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium cursor-pointer ${
                currentView === item.id ? currentTheme.navActive : currentTheme.navInactive
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Theme mode toggle and logout buttons footer */}
        <div className={`p-4 border-t transition-colors duration-300 ${currentTheme.border} bg-gray-50/50 dark:bg-gray-900/40`}>
          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex-1 flex justify-center items-center gap-1.5 py-1.5 px-2.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                darkMode
                  ? 'border-gray-700 bg-gray-800 text-yellow-400 hover:bg-gray-800'
                  : 'border-gray-200 bg-gray-50 text-indigo-600 hover:bg-gray-100'
              }`}
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? <Sun size={12} /> : <Moon size={12} />}
              <span>{darkMode ? 'Light' : 'Dark'}</span>
            </button>
            <button
              onClick={logout}
              className="flex-1 flex justify-center items-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 text-[10px] font-bold transition-colors cursor-pointer"
            >
              <LogOut size={12} />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      </aside>

        <main className={`flex-1 flex flex-col h-screen overflow-hidden relative transition-colors duration-300 ${currentTheme.content}`}>
          <div id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto p-4 md:p-8 outline-none">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    );
};
