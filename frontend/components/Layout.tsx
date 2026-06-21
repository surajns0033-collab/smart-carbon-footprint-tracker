import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Globe, BookOpen, User, LogOut, Leaf, FlaskConical, Book, Trophy, Bot, Sun, Moon, Image as ImageIcon, Trash2, Smartphone, Monitor } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../services/translation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, viewMode, setViewMode } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [bgImage, setBgImage] = React.useState<string | null>(() => {
    try {
      return localStorage.getItem('sc_bg_image') || null;
    } catch {
      return null;
    }
  });

  const [darkMode, setDarkMode] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('sc_dark_mode') === 'true' || false;
    } catch {
      return false;
    }
  });

  const [customUrl, setCustomUrl] = React.useState('');

  React.useEffect(() => {
    try {
      localStorage.setItem('sc_bg_image', bgImage || '');
    } catch {}
  }, [bgImage]);

  React.useEffect(() => {
    try {
      localStorage.setItem('sc_dark_mode', darkMode ? 'true' : 'false');
    } catch {}
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
      reader.onloadend = () => {
        setBgImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setBgImage(customUrl.trim());
      setCustomUrl('');
    }
  };

  const clearBg = () => {
    setBgImage(null);
  };

  const themeConfig = {
    light: {
      bg: bgImage ? '' : 'bg-green-50/60',
      aside: 'bg-white/90 border-gray-200 text-gray-800',
      navActive: 'bg-eco-50 text-eco-700 shadow-sm',
      navInactive: 'text-gray-600 hover:bg-eco-50 hover:text-eco-600',
      title: 'text-eco-600',
      content: bgImage ? 'backdrop-blur-md bg-white/70 text-gray-900' : 'bg-transparent text-gray-900',
      border: 'border-gray-100'
    },
    dark: {
      bg: bgImage ? '' : 'bg-gray-950 text-gray-100',
      aside: 'bg-gray-900/95 border-gray-800 text-gray-100',
      navActive: 'bg-gray-800 text-teal-400 shadow-md',
      navInactive: 'text-gray-400 hover:bg-gray-800 hover:text-teal-300',
      title: 'text-teal-400',
      content: bgImage ? 'backdrop-blur-md bg-gray-950/75 text-gray-100' : 'bg-transparent text-gray-100',
      border: 'border-gray-800'
    }
  };

  const currentTheme = darkMode ? themeConfig.dark : themeConfig.light;
  const currentView = location.pathname.substring(1) || 'dashboard';

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: <LayoutDashboard size={20} /> },
    { id: 'tracker', label: t('tracker'), icon: <PlusCircle size={20} /> },
    { id: 'gov', label: t('gov'), icon: <Globe size={20} /> },
    { id: 'simulator', label: t('simulator'), icon: <FlaskConical size={20} /> },
    { id: 'library', label: t('library'), icon: <Book size={20} /> },
    { id: 'leaderboard', label: t('leaderboard'), icon: <Trophy size={20} /> },
    { id: 'learn', label: t('learn'), icon: <BookOpen size={20} /> },
    { id: 'ai', label: t('ai'), icon: <Bot size={20} /> },
    { id: 'profile', label: t('profile'), icon: <User size={20} /> },
  ];

  const handleNavClick = (id: string) => {
    navigate(`/${id}`);
  };

  const inlineBgStyle = bgImage ? {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : undefined;

  return (
    <div 
      className={`flex h-screen overflow-hidden transition-all duration-300 relative ${currentTheme.bg}`}
      style={inlineBgStyle}
      role="application"
      aria-label="Smart Carbon Footprint Tracker Application"
    >
      {/* Top Right Version Switcher */}
      <div role="toolbar" aria-label="View and theme controls" className="absolute top-4 right-4 z-50 flex bg-white/90 dark:bg-gray-900/90 p-1 rounded-xl border border-gray-200 dark:border-gray-800 backdrop-blur-md shadow-lg gap-1">
        <button 
          onClick={() => setViewMode('desktop')} 
          aria-pressed={viewMode === 'desktop'}
          aria-label="Switch to Desktop view"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'desktop' 
              ? 'bg-eco-600 text-white shadow-sm' 
              : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          title="Switch to Desktop Version"
        >
          <Monitor size={14} aria-hidden="true" />
          <span>Desktop</span>
        </button>
        <button 
          onClick={() => setViewMode('mobile')} 
          aria-pressed={viewMode === 'mobile'}
          aria-label="Switch to Mobile view"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'mobile' 
              ? 'bg-eco-600 text-white shadow-sm' 
              : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          title="Switch to Mobile Version"
        >
          <Smartphone size={14} aria-hidden="true" />
          <span>Mobile</span>
        </button>
        <div className="w-[1px] bg-gray-200 dark:bg-gray-800 my-1 self-stretch mx-0.5" role="separator" aria-orientation="vertical"></div>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          aria-pressed={darkMode}
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer flex items-center justify-center transition-all"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun size={15} className="text-yellow-500 animate-pulse" aria-hidden="true" /> : <Moon size={15} className="text-indigo-500" aria-hidden="true" />}
        </button>
      </div>

      {viewMode === 'mobile' ? (
        // Mobile Version Wrapper: centered smartphone mockup with scrollable viewport
        <div className="flex-1 flex justify-center items-center h-full py-4 overflow-hidden">
          <div className="w-[375px] h-[812px] border-[12px] border-gray-800 dark:border-gray-850 rounded-[45px] shadow-2xl relative bg-white dark:bg-gray-900 overflow-hidden flex flex-col scale-[0.95] md:scale-100 origin-center transition-all">
            {/* Speaker & Camera Bezel Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-gray-800 rounded-b-2xl z-50 flex items-center justify-center">
              <div className="w-12 h-1 bg-gray-600 rounded-full mb-1"></div>
            </div>

            {/* Viewport content */}
            <div className="flex-1 overflow-y-auto pt-8 pb-4 px-4 bg-cover bg-center" style={inlineBgStyle}>
              <div className={`h-full overflow-y-auto rounded-2xl p-3 transition-colors duration-300 ${currentTheme.content}`}>
                {children}
              </div>
            </div>

            {/* Mobile Bottom Navigation Menu */}
            <div className="bg-white/95 dark:bg-gray-950/95 border-t border-gray-200 dark:border-gray-800 p-2.5 flex justify-around items-center shrink-0 z-40 backdrop-blur-md">
              {navItems.slice(0, 5).map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex flex-col items-center gap-1 p-1 transition-colors cursor-pointer ${
                    currentView === item.id 
                      ? 'text-eco-600 dark:text-teal-400 font-bold scale-105' 
                      : 'text-gray-400 hover:text-gray-600 dark:text-gray-500'
                  }`}
                >
                  {item.icon}
                  <span className="text-[9px] tracking-tight">{item.label.substring(0, 9)}</span>
                </button>
              ))}
              {/* Profile Link in Mobile navigation */}
              <button
                onClick={() => handleNavClick('profile')}
                className={`flex flex-col items-center gap-1 p-1 transition-colors cursor-pointer ${
                  currentView === 'profile' 
                    ? 'text-eco-600 dark:text-teal-400 font-bold scale-105' 
                    : 'text-gray-400 hover:text-gray-600 dark:text-gray-500'
                }`}
              >
                <User size={20} />
                <span className="text-[9px] tracking-tight">{t('profile').substring(0, 9)}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Desktop Version: standard sidebar layout
        <>
          {/* Sidebar */}
          <aside className={`w-64 border-r flex flex-col transition-all duration-300 ${currentTheme.aside} backdrop-blur-md`}>
            <div className={`p-6 flex items-center gap-3 font-bold text-xl border-b transition-colors duration-300 ${currentTheme.border} ${currentTheme.title}`}>
              <Leaf className="fill-current" />
              Smart Carbon
            </div>
            
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium cursor-pointer ${
                    currentView === item.id 
                      ? currentTheme.navActive 
                      : currentTheme.navInactive
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Footer Settings: Theme Toggle & Custom BG & Logout */}
            <div className={`p-4 border-t transition-colors duration-300 ${currentTheme.border} space-y-4`}>
              
              {/* Light/Dark Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Theme</span>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    darkMode 
                      ? 'border-gray-700 bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                      : 'border-gray-200 bg-gray-50 text-indigo-600 hover:bg-gray-100'
                  }`}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>

              {/* Background Upload Settings */}
              <div className="space-y-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">{t('theme_selector')}</span>
                
                <div className="flex gap-2">
                  {/* File Upload Button */}
                  <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ImageIcon size={14} className="text-gray-400" />
                    <span>Upload</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleBgUpload} 
                      className="hidden" 
                    />
                  </label>

                  {/* Clear BG Button if present */}
                  {bgImage && (
                    <button 
                      onClick={clearBg}
                      className="p-2 border border-red-300 dark:border-red-900 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      title={t('clear_bg')}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Custom URL form */}
                <form onSubmit={handleUrlSubmit} className="flex gap-1">
                  <input 
                    type="text" 
                    placeholder="Image URL..." 
                    value={customUrl}
                    onChange={e => setCustomUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-[10px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <button 
                    type="submit"
                    className="px-2 py-1 bg-gray-700 text-white rounded-lg text-[10px] hover:bg-gray-600 cursor-pointer"
                  >
                    Set
                  </button>
                </form>
              </div>
              
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors text-left font-medium cursor-pointer"
              >
                <LogOut size={20} />
                {t('logout')}
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className={`flex-1 flex flex-col h-screen overflow-hidden relative transition-colors duration-300 ${currentTheme.content}`}>
            <div id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto p-4 md:p-8 outline-none">
              <div className="max-w-6xl mx-auto">
                {children}
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
};
