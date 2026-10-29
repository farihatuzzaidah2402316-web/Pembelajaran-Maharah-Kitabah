import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with explicit database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Error handling standard per Firebase skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firestore connection verified successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network interrupted.');
    }
  }
}
testConnection();

// Types for Maharah Kitabah
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string;
  role: 'pelajar' | 'guru' | 'admin';
  photoURL?: string | null;
  totalWritings?: number;
  totalScore?: number;
  streakDays?: number;
}

export interface WritingSubmission {
  id?: string;
  userId: string;
  title: string;
  category: 'insha_hurr' | 'insha_muwajjah' | 'imla' | 'tarkib' | 'khat';
  arabicText: string;
  translation?: string;
  score?: number;
  feedback?: {
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
  };
  createdAt: string;
  updatedAt: string;
}

export interface PracticeProgress {
  id?: string;
  userId: string;
  drillType: 'tarkib' | 'imla_faragh' | 'dikte' | 'khat_tracing';
  drillId: string;
  isCompleted: boolean;
  score?: number;
  updatedAt: string;
}
