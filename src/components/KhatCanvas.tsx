import React, { useRef, useState, useEffect } from 'react';
import { 
  Eraser, 
  RotateCcw, 
  Download, 
  Eye, 
  EyeOff, 
  Award, 
  Sparkles, 
  Check,
  Brush
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HIJAIYAH_LETTERS } from '../data/mockLessons';
import { useAuth } from '../context/AuthContext';

export const KhatCanvas: React.FC = () => {
  const { updateUserStats } = useAuth();

  const [selectedCharIndex, setSelectedCharIndex] = useState(0);
  const currentChar = HIJAIYAH_LETTERS[selectedCharIndex];

  const [formType, setFormType] = useState<'isolated' | 'initial' | 'medial' | 'final'>('isolated');
  const [brushColor, setBrushColor] = useState('#0f172a');
  const [brushSize, setBrushSize] = useState(8);
  const [isEraser, setIsEraser] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [hasDrawn, setHasDrawn] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const history = useRef<ImageData[]>([]);

  // Current Arabic letter glyph to trace
  const activeGlyph = {
    isolated: currentChar.isolated,
    initial: currentChar.initial,
    medial: currentChar.medial,
    final: currentChar.final
  }[formType];

  useEffect(() => {
    clearCanvas();
  }, [selectedCharIndex, formType]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    history.current = [];
    setHasDrawn(false);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save state for undo
    history.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

    isDrawing.current = true;
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? '#ffffff' : brushColor;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || history.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const previous = history.current.pop();
    if (previous) {
      ctx.putImageData(previous, 0, 0);
    }
  };

  const handleFinishPractice = () => {
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    updateUserStats(15);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-500/30">
            <Brush className="w-3.5 h-3.5" />
            <span>Rasmul Huruf & Khat (رَسْمُ الحُرُوفِ العَرَبِيَّةِ)</span>
          </div>
          <h2 className="text-2xl font-bold">Studio Menulis & Kaligrafi Huruf Hijaiyah</h2>
          <p className="text-emerald-100/80 text-sm mt-1">
            Latih kelenturan jemari menulis huruf Arab dalam bentuk tunggal (منفصل), awal (بداية), tengah (وسط), dan akhir (نهاية).
          </p>
        </div>

        <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-center">
          <span className="text-xs text-emerald-200 block">Huruf Aktif:</span>
          <span className="font-serif text-3xl font-black text-amber-300">{currentChar.letter}</span>
        </div>
      </div>

      {/* Hijaiyah Carousel Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm overflow-x-auto scrollbar-none flex items-center gap-2">
        {HIJAIYAH_LETTERS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCharIndex(idx)}
            className={`w-11 h-11 shrink-0 rounded-xl font-serif text-xl font-bold transition-all flex items-center justify-center ${
              selectedCharIndex === idx
                ? 'bg-emerald-600 text-white shadow-md scale-105'
                : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200'
            }`}
          >
            {item.letter}
          </button>
        ))}
      </div>

      {/* Main Canvas Workspace */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        {/* Form Selector (Posisi Huruf) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">
              Huruf {currentChar.name} ({currentChar.transliteration})
            </h3>
            <span className="text-xs text-slate-500">
              Contoh Kata: <strong className="font-serif text-emerald-700 text-base">{currentChar.exampleWord}</strong> ({currentChar.exampleMeaning})
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(
              [
                { key: 'isolated', label: 'Tunggal (مُنْفَصِلٌ)' },
                { key: 'initial', label: 'Awal (بِدَايَةٌ)' },
                { key: 'medial', label: 'Tengah (وَسَطٌ)' },
                { key: 'final', label: 'Akhir (نِهَايَةٌ)' }
              ] as const
            ).map((f) => (
              <button
                key={f.key}
                onClick={() => setFormType(f.key)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  formType === f.key ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar: Color, Size, Eraser, Guide */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          {/* Colors */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1">Tinta:</span>
            {[
              { label: 'Hitam', hex: '#0f172a' },
              { label: 'Zamrud', hex: '#059669' },
              { label: 'Nil', hex: '#2563eb' },
              { label: 'Kasturi', hex: '#b91c1c' },
              { label: 'Emas', hex: '#d97706' }
            ].map((c) => (
              <button
                key={c.hex}
                onClick={() => {
                  setBrushColor(c.hex);
                  setIsEraser(false);
                }}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  brushColor === c.hex && !isEraser ? 'scale-125 border-slate-900 shadow-sm' : 'border-white'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.label}
              />
            ))}
          </div>

          {/* Size Slider */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Tebal:</span>
            <input
              type="range"
              min="3"
              max="24"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 md:w-28 accent-emerald-600"
            />
            <span className="text-xs font-mono text-slate-600">{brushSize}px</span>
          </div>

          {/* Tools */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsEraser(!isEraser)}
              className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1 transition-all ${
                isEraser
                  ? 'bg-rose-100 text-rose-700 border-rose-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Penghapus"
            >
              <Eraser className="w-4 h-4" />
              <span className="hidden sm:inline">Hapus</span>
            </button>

            <button
              onClick={() => setShowGuide(!showGuide)}
              className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1 transition-all ${
                showGuide
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
              title="Panduan Bayangan Huruf"
            >
              {showGuide ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="hidden sm:inline">Panduan</span>
            </button>

            <button
              onClick={handleUndo}
              className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl"
              title="Kembalikan Coretan Terakhir"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={clearCanvas}
              className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 rounded-xl text-xs font-semibold"
            >
              Bersihkan
            </button>
          </div>
        </div>

        {/* Interactive Drawing Pad with Guide Overlay */}
        <div className="relative w-full h-80 md:h-96 bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
          {/* Subtle Calligraphy Paper Guidelines */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-around opacity-15">
            <div className="border-b border-dashed border-slate-400 w-full" />
            <div className="border-b-2 border-emerald-500 w-full" />
            <div className="border-b border-dashed border-slate-400 w-full" />
          </div>

          {/* Trace Ghost Glyph */}
          {showGuide && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              style={{
                fontFamily: "'Amiri', 'Noto Naskh Arabic', serif",
                fontSize: '180px',
                color: 'rgba(16, 185, 129, 0.18)'
              }}
              dir="rtl"
            >
              {activeGlyph}
            </div>
          )}

          {/* Drawing Canvas */}
          <canvas
            ref={canvasRef}
            width={800}
            height={450}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair touch-none"
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500 italic">
            Tip: Tarik goresan pena dari kanan atas ke kiri bawah sesuai arah khat Naskhi.
          </p>

          <button
            onClick={handleFinishPractice}
            disabled={!hasDrawn}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 text-sm hover:scale-102"
          >
            <Check className="w-4 h-4" />
            <span>Selesai Latihan (+15 Poin)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
