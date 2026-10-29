export type UserRole = 'pelajar' | 'guru' | 'admin';

export interface StudentProfile {
  uid: string;
  email: string | null;
  displayName: string;
  role: UserRole;
  photoURL?: string | null;
  totalScore: number;
  totalWritings: number;
  streakDays: number;
  level: 'Mubtadi (Pemula)' | 'Mutawassith (Menengah)' | 'Mutaqaddim (Mahir)';
}

export type WritingCategory = 'insha_hurr' | 'insha_muwajjah' | 'imla' | 'tarkib' | 'khat';

export interface AIEvaluation {
  score: number;
  grade: string;
  summary: string;
  correctedArabic: string;
  grammarNotes: Array<{
    issue: string;
    original: string;
    correction: string;
    explanation: string;
  }>;
  spellingNotes: Array<{
    rule: string;
    detail: string;
  }>;
  vocabularySuggestions: Array<{
    word: string;
    betterAlternative: string;
    meaning: string;
  }>;
  strengths: string[];
  improvementTips: string[];
}

export interface WritingItem {
  id?: string;
  userId: string;
  title: string;
  category: WritingCategory;
  arabicText: string;
  translation?: string;
  score?: number;
  feedback?: AIEvaluation;
  createdAt: string;
  updatedAt: string;
}

export interface TarkibExercise {
  id: string;
  scrambledWords: string[];
  correctOrder: string[];
  translation: string;
  type: 'Jumlah Ismiyyah' | 'Jumlah Fi\'liyyah';
  grammarHint: string;
}

export interface ImlaExercise {
  id: string;
  sentenceWithBlank: string;
  options: string[];
  correctAnswer: string;
  fullSentence: string;
  translation: string;
  ruleExplanation: string;
}

export interface HijaiyahTraceItem {
  letter: string;
  name: string;
  transliteration: string;
  isolated: string;
  initial: string;
  medial: string;
  final: string;
  exampleWord: string;
  exampleMeaning: string;
}
