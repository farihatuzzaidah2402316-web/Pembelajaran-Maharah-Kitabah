import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { Navbar, ActiveTab } from './components/Navbar';
import { WritingStudio } from './components/WritingStudio';
import { TarkibDrill } from './components/TarkibDrill';
import { ImlaDrill } from './components/ImlaDrill';
import { KhatCanvas } from './components/KhatCanvas';
import { WritingsHistory } from './components/WritingsHistory';
import { Feather, Heart } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center animate-pulse mb-4">
          <Feather className="w-8 h-8 text-white" />
        </div>
        <p className="font-serif text-xl text-amber-300">جَارِي التَّحْمِيلِ...</p>
        <p className="text-xs text-slate-400 mt-1">Memuat Studio Maharah Kitabah...</p>
      </div>
    );
  }

  // Halaman Wajib Login
  if (!user) {
    return <AuthModal />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === 'studio' && <WritingStudio />}
        {activeTab === 'tarkib' && <TarkibDrill />}
        {activeTab === 'imla' && <ImlaDrill />}
        {activeTab === 'khat' && <KhatCanvas />}
        {activeTab === 'history' && (
          <WritingsHistory onNavigateToStudio={() => setActiveTab('studio')} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-serif text-sm text-slate-700">
            «تَعَلَّمُوا الْعَرَبِيَّةَ فَإِنَّهَا تُثَبِّتُ الْعَقْلَ وَتَزِيدُ فِي الْمُرُوءَةِ»
          </p>
          <p>
            Al-Qalam Studio &bull; Pembelajaran Maharah Kitabah Terintegrasi Firebase Firestore & Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
