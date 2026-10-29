import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  Volume2, 
  ArrowRight, 
  Award,
  Sparkles,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TARKIB_EXERCISES } from '../data/mockLessons';
import { useAuth } from '../context/AuthContext';

export const TarkibDrill: React.FC = () => {
  const { updateUserStats } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentExercise = TARKIB_EXERCISES[currentIndex];

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(currentExercise.scrambledWords);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const resetCurrent = (index: number) => {
    setCurrentIndex(index);
    setSelectedWords([]);
    setAvailableWords([...TARKIB_EXERCISES[index].scrambledWords]);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  const handleSelectWord = (word: string, wordIdx: number) => {
    if (isAnswerChecked) return;
    setSelectedWords((prev) => [...prev, word]);
    setAvailableWords((prev) => prev.filter((_, idx) => idx !== wordIdx));
  };

  const handleRemoveWord = (word: string, wordIdx: number) => {
    if (isAnswerChecked) return;
    setSelectedWords((prev) => prev.filter((_, idx) => idx !== wordIdx));
    setAvailableWords((prev) => [...prev, word]);
  };

  const handleCheck = () => {
    const isMatched = selectedWords.join(' ') === currentExercise.correctOrder.join(' ');
    setIsCorrect(isMatched);
    setIsAnswerChecked(true);

    if (isMatched) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      updateUserStats(20);
    }
  };

  const playTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA';
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Exercise Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-teal-500/30">
            <Layers className="w-3.5 h-3.5" />
            <span>Tartib Al-Kalimat (تَرْتِيبُ الْكَلِمَاتِ)</span>
          </div>
          <h2 className="text-2xl font-bold">Latihan Menyusun Rangkaian Kata</h2>
          <p className="text-teal-100/80 text-sm mt-1">
            Susun kata-kata acak berikut menjadi kalimat sempurna ({currentExercise.type}) yang sesuai dengan kaidah tata bahasa.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-sm font-semibold">
          <span>Latihan {currentIndex + 1} dari {TARKIB_EXERCISES.length}</span>
        </div>
      </div>

      {/* Main Exercise Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        {/* Translation & Grammar Type Target */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Arti Kalimat:</span>
            <p className="text-slate-800 font-semibold text-base md:text-lg mt-0.5">
              "{currentExercise.translation}"
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            {currentExercise.type}
          </span>
        </div>

        {/* Selected Words Construction Box (RTL) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Susunan Kalimat Anda (Klik untuk mengembalikan kata):
            </span>
            {selectedWords.length > 0 && !isAnswerChecked && (
              <button
                onClick={() => {
                  setAvailableWords([...currentExercise.scrambledWords]);
                  setSelectedWords([]);
                }}
                className="text-xs text-rose-500 hover:text-rose-700 font-medium"
              >
                Kembalikan Semua
              </button>
            )}
          </div>

          <div
            className="min-h-24 p-4 md:p-6 bg-slate-50 border-2 border-dashed border-teal-300 rounded-2xl flex flex-wrap-reverse items-center justify-end gap-2.5 transition-all"
            dir="rtl"
          >
            {selectedWords.length === 0 ? (
              <div className="w-full text-center text-slate-400 text-sm font-serif italic py-4">
                اِضْغَطْ عَلَى الْكَلِمَاتِ فِي الْأَسْفَلِ لِبِنَاءِ الْجُمْلَةِ (Klik kata-kata di bawah untuk menyusun kalimat)
              </div>
            ) : (
              selectedWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveWord(word, idx)}
                  disabled={isAnswerChecked}
                  className="px-4 py-2 bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-serif text-xl font-bold rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  {word}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Available Scrambled Words Pool */}
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Kata-kata Acak:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200" dir="rtl">
            {availableWords.map((word, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectWord(word, idx)}
                disabled={isAnswerChecked}
                className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-slate-800 font-serif text-xl font-bold rounded-xl border border-slate-300 hover:border-emerald-500 shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* Result & Feedback */}
        {isAnswerChecked && (
          <div
            className={`p-5 rounded-2xl border ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            } animate-in fade-in duration-200 space-y-3`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-base">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Masyā' Allāh! Susunan Anda Benar (+20 Poin)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Susunan kata belum tepat. Perhatikan kaidah i'rab & struktur.</span>
                  </>
                )}
              </div>

              <button
                onClick={() => playTTS(currentExercise.correctOrder.join(' '))}
                className="p-2 bg-white rounded-xl shadow-sm hover:bg-slate-50 text-slate-700"
                title="Dengarkan Pengucapan Kalimat Benar"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-slate-200 text-right font-serif text-xl font-bold text-slate-800" dir="rtl">
              {currentExercise.correctOrder.join(' ')}
            </div>

            <div className="text-xs leading-relaxed text-slate-700">
              <strong>Penjelasan Kaidah:</strong> {currentExercise.grammarHint}
            </div>
          </div>
        )}

        {/* Hint Dropdown */}
        {showHint && !isAnswerChecked && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Petunjuk Guru:</span> {currentExercise.grammarHint}
            </div>
          </div>
        )}

        {/* Buttons / Control Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {!isAnswerChecked && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl text-xs font-semibold transition-all"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{showHint ? 'Tutup Petunjuk' : 'Buka Petunjuk'}</span>
              </button>
            )}

            <button
              onClick={() => resetCurrent(currentIndex)}
              className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isAnswerChecked ? (
              <button
                onClick={handleCheck}
                disabled={selectedWords.length === 0}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 text-sm"
              >
                Periksa Jawaban
              </button>
            ) : (
              <button
                onClick={() => resetCurrent((currentIndex + 1) % TARKIB_EXERCISES.length)}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
              >
                <span>Latihan Selanjutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
