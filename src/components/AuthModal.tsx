import React, { useState } from 'react';
import { 
  Sparkles, 
  LogIn, 
  Lock, 
  User, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Feather
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { loginWithCredentials, loginWithGoogle, loginError, isLoading } = useAuth();

  const [username, setUsername] = useState('pelajar');
  const [password, setPassword] = useState('12345678');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await loginWithCredentials(username, password);
    setIsSubmitting(false);
  };

  const handleFillDemo = () => {
    setUsername('pelajar');
    setPassword('12345678');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Decorative Arabic Geometric Background Aura */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Header */}
        <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 p-8 text-white text-center relative">
          <div className="w-16 h-16 mx-auto mb-3 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl flex items-center justify-center shadow-inner">
            <Feather className="w-8 h-8 text-emerald-300" />
          </div>
          <span className="font-serif text-2xl text-amber-300 block mb-1">
            سْتُودِيُو مَهَارَةِ الكِتَابَةِ
          </span>
          <h1 className="text-xl font-extrabold tracking-tight">
            Al-Qalam: Maharah Kitabah
          </h1>
          <p className="text-emerald-100/80 text-xs mt-1">
            Studio Pembelajaran Keterampilan Menulis Bahasa Arab Interaktif & Cerdas
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Preset Student Credentials Badge */}
          <div 
            onClick={handleFillDemo}
            className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl cursor-pointer hover:bg-emerald-100/80 transition-all text-xs text-emerald-900 flex items-start gap-2.5 group"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 group-hover:rotate-12 transition-transform" />
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <span>Akun Default Pelajar (Klik untuk Isi):</span>
              </div>
              <div className="mt-1 font-mono text-[11px] text-emerald-800">
                User: <span className="font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200">pelajar</span> &nbsp;|&nbsp; Sandi: <span className="font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200">12345678</span>
              </div>
            </div>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form Login Pelajar */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Username Pelajar:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="pelajar"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Kata Sandi:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="12345678"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-102 active:scale-98 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'Memeriksa Kredensial...' : 'Masuk sebagai Pelajar'}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">
              atau
            </span>
          </div>

          {/* Google Sign-in Firebase Auth */}
          <button
            onClick={loginWithGoogle}
            disabled={isLoading}
            className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 hover:border-slate-300 rounded-xl shadow-sm transition-all hover:scale-101 active:scale-98 text-xs md:text-sm flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Masuk dengan Google (Firebase Auth)</span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Halaman Wajib Login &bull; Data Pembelajaran Tersimpan di Firestore
        </div>
      </div>
    </div>
  );
};
