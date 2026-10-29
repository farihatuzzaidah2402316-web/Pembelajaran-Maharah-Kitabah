import React from 'react';
import { 
  Feather, 
  Layers, 
  FileEdit, 
  Brush, 
  BookOpen, 
  LogOut, 
  Award, 
  Sparkles,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type ActiveTab = 'studio' | 'tarkib' | 'imla' | 'khat' | 'history';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'studio' as ActiveTab, label: 'Studio Kitabah', arabic: 'إِنْشَاء', icon: Feather },
    { id: 'tarkib' as ActiveTab, label: 'Susun Kata', arabic: 'تَرْتِيب', icon: Layers },
    { id: 'imla' as ActiveTab, label: 'Lengkapi Imla', arabic: 'إِمْلَاء', icon: FileEdit },
    { id: 'khat' as ActiveTab, label: 'Tulis Huruf', arabic: 'رَسْم', icon: Brush },
    { id: 'history' as ActiveTab, label: 'Portofolio', arabic: 'سِجِلّ', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Feather className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base md:text-lg text-slate-900 tracking-tight">
                  Al-Qalam
                </span>
                <span className="font-serif text-emerald-700 font-bold text-sm hidden sm:inline">
                  (مَهَارَةُ الكِتَابَةِ)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Studio Keterampilan Menulis Bahasa Arab
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  <span className="font-serif text-xs opacity-60 hidden xl:inline">({item.arabic})</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            {/* Score Pill */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/70 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900">
              <Award className="w-4 h-4 text-amber-600" />
              <span>{user?.totalScore || 0} Poin</span>
            </div>

            {/* User Info */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                {user?.displayName || 'Pelajar'}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">
                {user?.level || 'Mubtadi'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all hover:scale-102 active:scale-98"
              title="Keluar dari Akun"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Mobile Subnav */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-100 overflow-x-auto scrollbar-none gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
