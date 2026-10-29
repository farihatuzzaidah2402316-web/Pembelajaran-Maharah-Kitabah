import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Trash2, 
  Award, 
  Calendar, 
  Eye, 
  FileText, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { WritingItem } from '../types';

export const WritingsHistory: React.FC<{ onNavigateToStudio: () => void }> = ({ onNavigateToStudio }) => {
  const { user } = useAuth();
  const [writings, setWritings] = useState<WritingItem[]>([]);
  const [selectedWriting, setSelectedWriting] = useState<WritingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const path = 'writings';
    try {
      const q = query(
        collection(db, path),
        where('userId', '==', user.uid)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: WritingItem[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as WritingItem);
          });
          // Sort by createdAt descending
          list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setWritings(list);
          setIsLoading(false);
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, path);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('History subscription note:', err);
      setIsLoading(false);
    }
  }, [user]);

  const handleDelete = async (id?: string) => {
    if (!id || !user) return;
    if (!confirm('Apakah Anda yakin ingin menghapus lembar tulisan ini?')) return;
    try {
      await deleteDoc(doc(db, 'writings', id));
      if (selectedWriting?.id === id) {
        setSelectedWriting(null);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `writings/${id}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sijillul Kitabah (سِجِلُّ الكِتَابَةِ)</span>
          </div>
          <h2 className="text-2xl font-bold">Portofolio & Riwayat Tulisan Siswa</h2>
          <p className="text-emerald-100/80 text-sm mt-1">
            Kumpulan seluruh tulisan karangan bahasa Arab Anda yang tersimpan di cloud database Firestore per akun santri/pelajar.
          </p>
        </div>

        <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 text-center">
          <span className="text-xs text-emerald-200 block">Total Tulisan:</span>
          <span className="text-2xl font-bold">{writings.length} Naskah</span>
        </div>
      </div>

      {/* Main List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 font-medium">
          Memuat riwayat tulisan dari Firestore...
        </div>
      ) : writings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Belum Ada Tulisan Tersimpan</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Mulailah menulis karangan pertama Anda di Studio Kitabah. Gunakan keyboard harakat virtual dan evaluasi kaidah Nahwu/Sharaf Anda dengan Gemini AI.
          </p>
          <button
            onClick={onNavigateToStudio}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
          >
            Buka Studio Kitabah Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {writings.map((w) => (
            <div
              key={w.id}
              className="bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(w.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  {w.score && (
                    <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Award className="w-3 h-3" />
                      Skor: {w.score}
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-bold text-slate-800 line-clamp-1">{w.title}</h4>

                <p className="mt-2 text-right font-serif text-lg text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-2 leading-relaxed" dir="rtl">
                  {w.arabicText}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedWriting(w)}
                  className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-bold"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Detail & Evaluasi AI</span>
                </button>

                <button
                  onClick={() => handleDelete(w.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  title="Hapus Tulisan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedWriting && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Detail Tulisan Santri
                </span>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{selectedWriting.title}</h3>
              </div>
              <button
                onClick={() => setSelectedWriting(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Arabic Text */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Naskah Asli:
              </span>
              <p className="text-right font-serif text-xl md:text-2xl leading-loose text-slate-900" dir="rtl">
                {selectedWriting.arabicText}
              </p>
            </div>

            {/* AI Feedback */}
            {selectedWriting.feedback && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold text-xl flex items-center justify-center">
                      {selectedWriting.feedback.score}
                    </div>
                    <div>
                      <div className="font-bold text-emerald-900 text-sm">
                        Predikat: {selectedWriting.feedback.grade}
                      </div>
                      <div className="text-xs text-emerald-700">Maharah Kitabah AI Evaluation</div>
                    </div>
                  </div>
                </div>

                {selectedWriting.feedback.correctedArabic && (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-1">
                      Versi Berharakat Sempurna:
                    </span>
                    <p className="text-right font-serif text-xl text-slate-900 leading-relaxed" dir="rtl">
                      {selectedWriting.feedback.correctedArabic}
                    </p>
                  </div>
                )}

                <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed">
                  <strong>Evaluasi Guru AI:</strong> {selectedWriting.feedback.summary}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedWriting(null)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
