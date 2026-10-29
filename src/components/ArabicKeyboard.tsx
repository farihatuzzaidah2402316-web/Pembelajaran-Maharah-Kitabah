import React, { useState } from 'react';
import { 
  Delete, 
  CornerDownLeft, 
  Copy, 
  Check, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Maximize2,
  Trash2
} from 'lucide-react';

interface ArabicKeyboardProps {
  onInsertChar: (char: string) => void;
  onBackspace: () => void;
  onClear?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const ArabicKeyboard: React.FC<ArabicKeyboardProps> = ({
  onInsertChar,
  onBackspace,
  onClear,
  isOpen = true,
  onToggle
}) => {
  const [activeTab, setActiveTab] = useState<'huruf' | 'harakat' | 'ibarat'>('huruf');
  const [copied, setCopied] = useState(false);

  // Keyboard Rows
  const row1 = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '٠', '،', '؛', '؟'];
  const row2 = ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'هـ', 'خ', 'ح', 'ج', 'د', 'ذ'];
  const row3 = ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط', 'ظ'];
  const row4 = ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'آ', 'إ', 'أ'];

  // Harakat & Tasykil
  const harakatList = [
    { label: 'Fathah', char: '\u064E', display: 'ـَ' },
    { label: 'Kasrah', char: '\u0650', display: 'ـِ' },
    { label: 'Dhammah', char: '\u064F', display: 'ـُ' },
    { label: 'Sukun', char: '\u0652', display: 'ـْ' },
    { label: 'Syaddah', char: '\u0651', display: 'ـّ' },
    { label: 'Tanwin Fathah', char: '\u064B', display: 'ـً' },
    { label: 'Tanwin Kasrah', char: '\u064D', display: 'ـٍ' },
    { label: 'Tanwin Dhammah', char: '\u064C', display: 'ـٌ' },
    { label: 'Alif Khanjariyah', char: '\u0670', display: 'ـٰ' },
    { label: 'Maddah', char: '\u0653', display: 'ـٓ' },
    { label: 'Hamzah Wasl', char: 'ٱ', display: 'ٱ' },
    { label: 'Tatweel / Kashida', char: 'ـ', display: 'ـ' }
  ];

  // Common Arabic Idioms / Ungkapan Kitabah
  const ibaratList = [
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
    'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ',
    'جَزَاكَ اللَّهُ خَيْرًا',
    'مَا شَاءَ اللَّهُ تَبَارَكَ اللَّهُ',
    'إِنْ شَاءَ اللَّهُ تَعَالَى',
    'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ'
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
          title="Buka Keyboard Arab"
        >
          <span className="font-serif text-lg">لوحة المفاتيح</span>
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-3 md:p-4 text-white w-full max-w-4xl mx-auto my-2 select-none">
      {/* Keyboard Header Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs md:text-sm">
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('huruf')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'huruf'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Huruf (الحروف)
          </button>
          <button
            onClick={() => setActiveTab('harakat')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'harakat'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Harakat & Tasykil (الحركات)
          </button>
          <button
            onClick={() => setActiveTab('ibarat')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'ibarat'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ungkapan (العبارات)
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {onClear && (
            <button
              onClick={onClear}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Kosongkan Teks"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Tutup Keyboard"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Harakat Floating Bar (Always Accessible) */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3 bg-slate-800/80 p-2 rounded-xl border border-slate-700/50">
        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mr-1 px-1">
          Harakat Cepat:
        </span>
        {harakatList.slice(0, 8).map((h, i) => (
          <button
            key={i}
            onClick={() => onInsertChar(h.char)}
            className="w-8 h-8 md:w-9 md:h-9 bg-slate-700/90 hover:bg-emerald-600 text-amber-300 hover:text-white font-serif text-xl rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm border border-slate-600/40"
            title={h.label}
          >
            {h.display}
          </button>
        ))}
        <button
          onClick={() => onInsertChar('\u0651\u064E')}
          className="px-2 h-8 md:h-9 bg-slate-700/90 hover:bg-emerald-600 text-amber-300 hover:text-white font-serif text-lg rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-slate-600/40"
          title="Syaddah + Fathah"
        >
          ـَّ
        </button>
        <button
          onClick={() => onInsertChar('\u0651\u0650')}
          className="px-2 h-8 md:h-9 bg-slate-700/90 hover:bg-emerald-600 text-amber-300 hover:text-white font-serif text-lg rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-slate-600/40"
          title="Syaddah + Kasrah"
        >
          ـِّ
        </button>
        <button
          onClick={() => onInsertChar('\u0651\u064F')}
          className="px-2 h-8 md:h-9 bg-slate-700/90 hover:bg-emerald-600 text-amber-300 hover:text-white font-serif text-lg rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-slate-600/40"
          title="Syaddah + Dhammah"
        >
          ـُّ
        </button>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'huruf' && (
        <div className="flex flex-col gap-1.5 md:gap-2">
          {/* Row 1: Numbers & Punctuation */}
          <div className="flex justify-center gap-1 md:gap-1.5 flex-wrap">
            {row1.map((ch, i) => (
              <button
                key={i}
                onClick={() => onInsertChar(ch)}
                className="w-7 h-9 md:w-10 md:h-11 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-200 hover:text-white font-serif text-lg md:text-xl rounded-lg transition-all border border-slate-700/50 shadow-sm flex items-center justify-center"
              >
                {ch}
              </button>
            ))}
            <button
              onClick={onBackspace}
              className="px-3 md:px-4 h-9 md:h-11 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg flex items-center justify-center transition-all active:scale-95 shadow-sm"
              title="Hapus Satu Karakter"
            >
              <Delete className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Row 2 */}
          <div className="flex justify-center gap-1 md:gap-1.5 flex-wrap">
            {row2.map((ch, i) => (
              <button
                key={i}
                onClick={() => onInsertChar(ch)}
                className="w-7 h-9 md:w-10 md:h-11 bg-slate-800 hover:bg-emerald-600 active:bg-emerald-700 text-white font-serif text-xl md:text-2xl rounded-lg transition-all border border-slate-700/50 shadow-sm flex items-center justify-center hover:scale-105"
              >
                {ch}
              </button>
            ))}
          </div>

          {/* Row 3 */}
          <div className="flex justify-center gap-1 md:gap-1.5 flex-wrap">
            {row3.map((ch, i) => (
              <button
                key={i}
                onClick={() => onInsertChar(ch)}
                className="w-7 h-9 md:w-10 md:h-11 bg-slate-800 hover:bg-emerald-600 active:bg-emerald-700 text-white font-serif text-xl md:text-2xl rounded-lg transition-all border border-slate-700/50 shadow-sm flex items-center justify-center hover:scale-105"
              >
                {ch}
              </button>
            ))}
          </div>

          {/* Row 4 */}
          <div className="flex justify-center gap-1 md:gap-1.5 flex-wrap">
            {row4.map((ch, i) => (
              <button
                key={i}
                onClick={() => onInsertChar(ch)}
                className="w-7 h-9 md:w-10 md:h-11 bg-slate-800 hover:bg-emerald-600 active:bg-emerald-700 text-white font-serif text-xl md:text-2xl rounded-lg transition-all border border-slate-700/50 shadow-sm flex items-center justify-center hover:scale-105"
              >
                {ch}
              </button>
            ))}
          </div>

          {/* Bottom Bar: Space & Enter */}
          <div className="flex justify-center gap-2 mt-1">
            <button
              onClick={() => onInsertChar('\n')}
              className="px-4 h-9 md:h-10 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg flex items-center justify-center gap-1 text-xs md:text-sm border border-slate-700"
              title="Baris Baru"
            >
              <CornerDownLeft className="w-4 h-4" />
              <span>Enter</span>
            </button>
            <button
              onClick={() => onInsertChar(' ')}
              className="flex-1 max-w-md h-9 md:h-10 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-300 hover:text-white font-medium text-xs md:text-sm rounded-lg border border-slate-700 transition-all flex items-center justify-center tracking-wider shadow-inner"
            >
              مَسَافَة (SPASI)
            </button>
          </div>
        </div>
      )}

      {/* Tab: Harakat Lengkap */}
      {activeTab === 'harakat' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 py-2">
          {harakatList.map((h, i) => (
            <button
              key={i}
              onClick={() => onInsertChar(h.char)}
              className="flex items-center justify-between p-2.5 bg-slate-800 hover:bg-emerald-700/80 rounded-xl border border-slate-700 transition-all hover:scale-102"
            >
              <span className="text-xs text-slate-300">{h.label}</span>
              <span className="font-serif text-2xl text-amber-300 font-bold px-2">{h.display}</span>
            </button>
          ))}
        </div>
      )}

      {/* Tab: Ibarat / Ungkapan Umum */}
      {activeTab === 'ibarat' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-2">
          {ibaratList.map((phrase, i) => (
            <button
              key={i}
              onClick={() => onInsertChar(phrase + ' ')}
              className="text-right p-3 bg-slate-800 hover:bg-emerald-700/80 rounded-xl border border-slate-700 font-serif text-lg text-emerald-200 hover:text-white transition-all hover:scale-101"
            >
              {phrase}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
