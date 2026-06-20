import React from 'react';
import { LayoutDashboard, PlusCircle, Globe, BookOpen, User, LogOut, Leaf, FlaskConical, Book, Trophy, Bot } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  setView: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const { logout } = useAppContext();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'tracker', label: 'Tracker & Scanner', icon: <PlusCircle size={20} /> },
    { id: 'gov', label: 'Gov Targets', icon: <Globe size={20} /> },
    { id: 'simulator', label: 'What If Simulator', icon: <FlaskConical size={20} /> },
    { id: 'library', label: 'Source Library', icon: <Book size={20} /> },
    { id: 'leaderboard', label: 'Leaderboards', icon: <Trophy size={20} /> },
    { id: 'learn', label: 'Learn Hub', icon: <BookOpen size={20} /> },
    { id: 'ai', label: 'AI Assistant', icon: <Bot size={20} /> },
    { id: 'profile', label: 'Profile Settings', icon: <User size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 text-eco-600 font-bold text-xl border-b border-gray-100">
          <Leaf className="fill-current" />
          Smart Carbon
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium ${
                currentView === item.id 
                  ? 'bg-eco-50 text-eco-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-eco-50 hover:text-eco-600'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors text-left font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
           <div className="flex items-center gap-2 text-eco-600 font-bold text-lg">
            <Leaf className="fill-current" size={20} />
            Smart Carbon
          </div>
          <button onClick={logout} className="text-gray-500 hover:text-red-600 p-2">
            <LogOut size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
        
        {/* Mobile Bottom Nav */}
        <nav className="md:hidden bg-white border-t border-gray-200 flex justify-around p-2 pb-safe overflow-x-auto">
           {navItems.slice(0, 5).map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 min-w-[70px] ${
                currentView === item.id ? 'text-eco-600' : 'text-gray-500'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};
