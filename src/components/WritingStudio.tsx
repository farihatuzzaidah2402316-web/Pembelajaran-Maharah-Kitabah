import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Send, 
  Volume2, 
  Copy, 
  Check, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Keyboard as KeyboardIcon,
  RefreshCw,
  Save,
  Feather
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { ArabicKeyboard } from './ArabicKeyboard';
import { WRITING_THEMES } from '../data/mockLessons';
import { AIEvaluation, WritingCategory } from '../types';

export const WritingStudio: React.FC = () => {
  const { user, updateUserStats } = useAuth();
  
  const [selectedThemeIndex, setSelectedThemeIndex] = useState<number>(0);
  const currentTheme = WRITING_THEMES[selectedThemeIndex];

  const [title, setTitle] = useState<string>(currentTheme.title);
  const [arabicText, setArabicText] = useState<string>('');
  const [category, setCategory] = useState<WritingCategory>('insha_muwajjah');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(true);
  
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<AIEvaluation | null>(null);
  const [isGeneratingTheme, setIsGeneratingTheme] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Insert character from virtual keyboard
  const handleInsertChar = (char: string) => {
    if (!textareaRef.current) {
      setArabicText((prev) => prev + char);
      return;
    }
    const start = textareaRef.current.selectionStart ?? arabicText.length;
    const end = textareaRef.current.selectionEnd ?? arabicText.length;
    const nextText = arabicText.substring(0, start) + char + arabicText.substring(end);
    setArabicText(nextText);

    // Set cursor position right after inserted character
    setTimeout(() => {
      if (textareaRef.current) {
        const nextPos = start + char.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 10);
  };

  const handleBackspace = () => {
    if (!textareaRef.current || arabicText.length === 0) return;
    const start = textareaRef.current.selectionStart ?? arabicText.length;
    const end = textareaRef.current.selectionEnd ?? arabicText.length;

    if (start === end) {
      if (start > 0) {
        const nextText = arabicText.substring(0, start - 1) + arabicText.substring(end);
        setArabicText(nextText);
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.setSelectionRange(start - 1, start - 1);
          }
        }, 10);
      }
    } else {
      const nextText = arabicText.substring(0, start) + arabicText.substring(end);
      setArabicText(nextText);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(start, start);
        }
      }, 10);
    }
  };

  // Text-To-Speech for Arabic
  const handleSpeak = () => {
    if (!arabicText.trim()) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(arabicText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Switch Theme
  const handleSelectTheme = (index: number) => {
    setSelectedThemeIndex(index);
    const theme = WRITING_THEMES[index];
    setTitle(theme.title);
  };

  // Ask AI for new writing prompt via server-side Gemini API
  const handleGenerateNewTheme = async () => {
    setIsGeneratingTheme(true);
    try {
      const res = await fetch('/api/ai/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTheme: 'Kehidupan Mahasiswa & Bahasa Arab',
          level: user?.level || 'Mubtadi'
        })
      });
      const data = await res.json();
      if (data.prompt) {
        setTitle(data.prompt.arabicTitle || 'مَوْضُوعٌ جَدِيدٌ');
        if (data.prompt.sentenceStarter) {
          setArabicText(data.prompt.sentenceStarter);
        }
      }
    } catch (err) {
      console.error('Error generating theme prompt:', err);
    } finally {
      setIsGeneratingTheme(false);
    }
  };

  // Submit writing for AI Evaluation
  const handleAnalyzeKitabah = async () => {
    if (!arabicText.trim() || !user) return;
    setIsAnalyzing(true);
    setEvaluation(null);

    try {
      const res = await fetch('/api/ai/analyze-kitabah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arabicText,
          topic: title,
          category,
          level: user.level
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const evalData: AIEvaluation = json.data;
        setEvaluation(evalData);

        // Award points & celebration
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        const pointsEarned = Math.round(evalData.score / 2);
        await updateUserStats(pointsEarned, true);

        // Save to Firestore per-user data
        try {
          const colRef = collection(db, 'writings');
          await addDoc(colRef, {
            userId: user.uid,
            title,
            category,
            arabicText,
            score: evalData.score,
            feedback: evalData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 4000);
        } catch (dbErr) {
          console.warn('Note on Firestore write:', dbErr);
        }
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const wordCount = arabicText.trim() ? arabicText.trim().split(/\s+/).length : 0;
  const charCount = arabicText.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-500/30">
              <Feather className="w-3.5 h-3.5" />
              <span>Studio Insya' & Kitabah (سْتُودِيُو التَّعْبِيرِ)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Tulis & Evaluasi Karangan Bahasa Arab
            </h1>
            <p className="text-emerald-100/80 text-sm mt-1 max-w-xl">
              Susun kalimat dan paragraf dengan bantuan keyboard harakat virtual. Dapatkan umpan balik tata bahasa Nahwu, Sharaf, dan ejaan Imla' dari AI secara langsung.
            </p>
          </div>

          <button
            onClick={handleGenerateNewTheme}
            disabled={isGeneratingTheme}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-md transition-all text-sm shrink-0"
          >
            <Sparkles className={`w-4 h-4 ${isGeneratingTheme ? 'animate-spin' : ''}`} />
            <span>{isGeneratingTheme ? 'Membuat Topik...' : 'Tema Baru AI'}</span>
          </button>
        </div>

        {/* Theme Pills */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
          {WRITING_THEMES.map((th, idx) => (
            <button
              key={th.id}
              onClick={() => handleSelectTheme(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                selectedThemeIndex === idx
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 border-white/10'
              }`}
            >
              {th.subTitle}
            </button>
          ))}
        </div>
      </div>

      {/* Guided Writing Support (As'ilah & Mufradat) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Guiding Questions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Panduan Menjawab (الْأَسْئِلَةُ)</span>
          </div>
          <div className="space-y-2">
            {currentTheme.guidingQuestions.map((q, i) => (
              <div
                key={i}
                className="p-2 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors"
              >
                <p className="text-right font-serif text-slate-800 text-sm leading-relaxed" dir="rtl">
                  {q}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mufradat Helpers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm">
              <Lightbulb className="w-4 h-4" />
              <span>Bank Kosakata Bantu (المُفْرَدَاتُ المُسَاعِدَةُ)</span>
            </div>
            <span className="text-xs text-slate-400">Klik untuk menyisipkan ke tulisan</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentTheme.vocabularies.map((v, i) => (
              <button
                key={i}
                onClick={() => handleInsertChar(v.arabic + ' ')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200/60 rounded-xl text-xs transition-all hover:scale-105 active:scale-95"
              >
                <span className="font-serif text-base font-semibold">{v.arabic}</span>
                <span className="text-slate-500 text-[11px]">({v.meaning})</span>
              </button>
            ))}
            {currentTheme.starter && (
              <button
                onClick={() => setArabicText((prev) => (prev ? prev + ' ' : '') + currentTheme.starter)}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs transition-all font-medium"
              >
                + Sisipkan Kalimat Pembuka
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Arabic Writing Canvas / Input Area */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Judul / Topik Karangan:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-right font-serif text-xl md:text-2xl font-bold px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            dir="rtl"
            placeholder="اُكْتُبْ عُنْوَانَ الْمَوْضُوعِ..."
          />
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={7}
            value={arabicText}
            onChange={(e) => setArabicText(e.target.value)}
            dir="rtl"
            placeholder="اُكْتُبْ هُنَا بِاللُّغَةِ الْعَرَبِيَّةِ الْفُصْحَى مَعَ الحَرَكَاتِ... (Tulis paragraf bahasa Arab di sini...)"
            className="w-full p-4 md:p-6 bg-slate-50/70 border border-slate-200 rounded-2xl font-serif text-xl md:text-2xl leading-loose focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 resize-y"
          />

          {/* Quick Floating Actions on Canvas */}
          <div className="absolute left-3 bottom-4 flex items-center gap-1.5">
            <button
              onClick={handleSpeak}
              disabled={!arabicText.trim()}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
                isSpeaking
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-white/90 hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm'
              }`}
              title="Dengarkan Pelafalan Arab (TTS)"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Dengarkan</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(arabicText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              disabled={!arabicText.trim()}
              className="p-2 bg-white/90 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-medium shadow-sm transition-all"
              title="Salin Teks"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1 transition-all border ${
                isKeyboardOpen 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
              title="Tampilkan / Sembunyikan Keyboard Arab"
            >
              <KeyboardIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Keyboard</span>
            </button>
          </div>
        </div>

        {/* Counter and Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span>Jumlah Kata: <strong className="text-slate-800">{wordCount}</strong></span>
            <span>Karakter: <strong className="text-slate-800">{charCount}</strong></span>
            {saveSuccess && (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan ke Catatan!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setArabicText('')}
              className="px-4 py-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-sm font-medium transition-all"
            >
              Reset
            </button>

            <button
              onClick={handleAnalyzeKitabah}
              disabled={isAnalyzing || !arabicText.trim()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-102 active:scale-98 disabled:opacity-50 text-sm"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menganalisis Kaidah...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Evaluasi dengan AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Virtual Arabic Keyboard */}
        {isKeyboardOpen && (
          <div className="pt-2">
            <ArabicKeyboard
              onInsertChar={handleInsertChar}
              onBackspace={handleBackspace}
              onClear={() => setArabicText('')}
              isOpen={isKeyboardOpen}
              onToggle={() => setIsKeyboardOpen(!isKeyboardOpen)}
            />
          </div>
        )}
      </div>

      {/* AI Evaluation Results Card */}
      {evaluation && (
        <div className="bg-white border-2 border-emerald-500/40 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header Score */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex flex-col items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-2xl font-black">{evaluation.score}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">/ 100</span>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Award className="w-3.5 h-3.5" />
                  <span>{evaluation.grade}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mt-1">Hasil Evaluasi Maharah Kitabah</h3>
              </div>
            </div>

            <div className="bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-100 text-emerald-900 text-xs md:text-sm font-medium">
              +{Math.round(evaluation.score / 2)} Poin Pembelajaran Diberikan!
            </div>
          </div>

          {/* Teacher Summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <p className="text-slate-700 text-sm leading-relaxed">
              {evaluation.summary}
            </p>
          </div>

          {/* Perfected Arabic Version with Syakl */}
          {evaluation.correctedArabic && (
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Versi Disempurnakan (مُصَحَّحٌ بِالْحَرَكَاتِ الكَامِلَةِ):
                </span>
                <button
                  onClick={() => setArabicText(evaluation.correctedArabic)}
                  className="text-xs text-amber-800 hover:text-amber-950 font-semibold underline underline-offset-2"
                >
                  Terapkan ke Kotak Tulis
                </button>
              </div>
              <p className="text-right font-serif text-xl md:text-2xl text-slate-900 leading-loose" dir="rtl">
                {evaluation.correctedArabic}
              </p>
            </div>
          )}

          {/* Grammar & Spelling Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nahwu & Sharaf Notes */}
            <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Catatan Nahwu & Sharaf (النَّحْوُ وَالصَّرْفُ)</span>
              </div>
              {evaluation.grammarNotes?.length > 0 ? (
                <div className="space-y-2.5">
                  {evaluation.grammarNotes.map((g, i) => (
                    <div key={i} className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs space-y-1">
                      <div className="font-bold text-indigo-900">{g.issue}</div>
                      <div className="text-slate-600">
                        Asli: <span className="line-through text-rose-600 font-serif text-sm mr-2">{g.original}</span>
                        Perbaikan: <span className="text-emerald-700 font-serif font-bold text-sm">{g.correction}</span>
                      </div>
                      <p className="text-slate-600 mt-1">{g.explanation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Masyā' Allāh, susunan nahwu dan sharaf Anda sudah sangat tepat!</p>
              )}
            </div>

            {/* Spelling & Imla' Notes */}
            <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Kaidah Ejaan & Imla' (قَوَاعِدُ الإِمْلَاءِ)</span>
              </div>
              {evaluation.spellingNotes?.length > 0 ? (
                <div className="space-y-2.5">
                  {evaluation.spellingNotes.map((s, i) => (
                    <div key={i} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-xs space-y-1">
                      <div className="font-bold text-rose-900">{s.rule}</div>
                      <p className="text-slate-600">{s.detail}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Ejaan huruf hijaiyah dan tanda baca Anda rapi dan benar.</p>
              )}
            </div>
          </div>

          {/* Vocabulary Enrichment & Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluation.vocabularySuggestions?.length > 0 && (
              <div className="border border-slate-200 rounded-2xl p-4 space-y-2">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                  Saran Kosakata Lebih Fusha (إِثْرَاءُ الْمُفْرَدَاتِ):
                </span>
                <div className="space-y-2">
                  {evaluation.vocabularySuggestions.map((v, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-teal-50/40 rounded-xl border border-teal-100 text-xs">
                      <div>
                        <span className="font-serif font-bold text-sm text-teal-900 mr-2">{v.betterAlternative}</span>
                        <span className="text-slate-500 text-[11px]">({v.meaning})</span>
                      </div>
                      <span className="text-[11px] text-slate-400">menggantikan: {v.word}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border border-slate-200 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Kekuatan Tulisan Anda:
              </span>
              <ul className="space-y-1.5">
                {evaluation.strengths?.map((st, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
