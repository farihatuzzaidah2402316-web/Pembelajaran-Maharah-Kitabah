import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle, 
  FileEdit,
  Keyboard as KeyboardIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IMLA_EXERCISES } from '../data/mockLessons';
import { useAuth } from '../context/AuthContext';
import { ArabicKeyboard } from './ArabicKeyboard';

export const ImlaDrill: React.FC = () => {
  const { updateUserStats } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = IMLA_EXERCISES[currentIndex];

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [mode, setMode] = useState<'pilihan' | 'ketik'>('pilihan');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const resetCurrent = (index: number) => {
    setCurrentIndex(index);
    setSelectedOption(null);
    setTypedAnswer('');
    setIsAnswerChecked(false);
    setIsCorrect(false);
  };

  const handleCheck = () => {
    let correct = false;
    if (mode === 'pilihan') {
      correct = selectedOption === currentItem.correctAnswer;
    } else {
      // Clean check (strip extra spaces)
      const cleanTyped = typedAnswer.trim();
      const cleanTarget = currentItem.correctAnswer.trim();
      correct = cleanTyped === cleanTarget;
    }

    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      updateUserStats(25);
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
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-500/30">
            <FileEdit className="w-3.5 h-3.5" />
            <span>Imla'ul Faragh (إِمْلَاءُ الفَرَاغِ)</span>
          </div>
          <h2 className="text-2xl font-bold">Latihan Melengkapi Kalimat & Ejaan Imla'</h2>
          <p className="text-emerald-100/80 text-sm mt-1">
            Lengkapi bagian kalimat yang rumpang dengan kata berharakat yang tepat sesuai kaidah tata bahasa.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-sm font-semibold">
          <span>Soal {currentIndex + 1} dari {IMLA_EXERCISES.length}</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        {/* Mode Selector */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Mode Pengerjaan:
          </span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMode('pilihan')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mode === 'pilihan' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Pilihan Ganda
            </button>
            <button
              onClick={() => setMode('ketik')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mode === 'ketik' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Ketik Manual (Keyboard Arab)
            </button>
          </div>
        </div>

        {/* Incomplete Sentence Display (RTL) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
          <p className="font-serif text-2xl md:text-3xl font-bold text-slate-800 leading-relaxed" dir="rtl">
            {currentItem.sentenceWithBlank.replace(
              '[...]',
              isAnswerChecked || selectedOption || typedAnswer
                ? ` [ ${mode === 'pilihan' ? selectedOption || '...' : typedAnswer || '...'} ] `
                : ' [ ... ] '
            )}
          </p>
          <p className="text-slate-500 text-sm font-medium">
            Arti: "{currentItem.translation}"
          </p>
        </div>

        {/* Inputs */}
        {mode === 'pilihan' ? (
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
              Pilih Jawaban yang Tepat:
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3" dir="rtl">
              {currentItem.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => !isAnswerChecked && setSelectedOption(opt)}
                  disabled={isAnswerChecked}
                  className={`p-4 rounded-2xl border font-serif text-2xl font-bold text-center transition-all ${
                    selectedOption === opt
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102'
                      : 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ketikkan Kata yang Tepat:
              </span>
              <button
                onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
                className="text-xs text-emerald-600 font-semibold flex items-center gap-1"
              >
                <KeyboardIcon className="w-3.5 h-3.5" />
                <span>{isKeyboardOpen ? 'Sembunyikan Keyboard' : 'Buka Keyboard Arab'}</span>
              </button>
            </div>

            <input
              type="text"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              dir="rtl"
              disabled={isAnswerChecked}
              placeholder="اُكْتُبِ الكَلِمَةَ هُنَا..."
              className="w-full text-center font-serif text-2xl font-bold p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {isKeyboardOpen && (
              <ArabicKeyboard
                onInsertChar={(char) => setTypedAnswer((p) => p + char)}
                onBackspace={() => setTypedAnswer((p) => p.slice(0, -1))}
                isOpen={isKeyboardOpen}
                onToggle={() => setIsKeyboardOpen(false)}
              />
            )}
          </div>
        )}

        {/* Results */}
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
                    <span>Masyā' Allāh! Jawaban Anda Tepat (+25 Poin)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Jawaban belum tepat. Jawaban yang benar adalah: {currentItem.correctAnswer}</span>
                  </>
                )}
              </div>

              <button
                onClick={() => playTTS(currentItem.fullSentence)}
                className="p-2 bg-white rounded-xl shadow-sm hover:bg-slate-50 text-slate-700"
                title="Dengarkan Kalimat Lengkap"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-slate-200 text-right font-serif text-xl font-bold text-slate-800" dir="rtl">
              {currentItem.fullSentence}
            </div>

            <div className="text-xs leading-relaxed text-slate-700">
              <strong>Kaidah Imla' & Nahwu:</strong> {currentItem.ruleExplanation}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => resetCurrent(currentIndex)}
            className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulangi Soal</span>
          </button>

          {!isAnswerChecked ? (
            <button
              onClick={handleCheck}
              disabled={mode === 'pilihan' ? !selectedOption : !typedAnswer.trim()}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 text-sm"
            >
              Periksa Jawaban
            </button>
          ) : (
            <button
              onClick={() => resetCurrent((currentIndex + 1) % IMLA_EXERCISES.length)}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
            >
              <span>Soal Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
