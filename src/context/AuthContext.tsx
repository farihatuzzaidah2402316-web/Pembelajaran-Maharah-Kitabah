import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { StudentProfile } from '../types';

interface AuthContextType {
  user: StudentProfile | null;
  isLoading: boolean;
  loginError: string | null;
  loginWithCredentials: (username: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserStats: (scoreIncrement: number, isNewWriting?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'al_qalam_student_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sync or create user profile in Firestore
  const syncProfileToFirestore = async (baseUser: {
    uid: string;
    email: string | null;
    displayName: string;
    photoURL?: string | null;
    role: 'pelajar' | 'guru' | 'admin';
  }): Promise<StudentProfile> => {
    const userDocRef = doc(db, 'users', baseUser.uid);
    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data();
        const profile: StudentProfile = {
          uid: baseUser.uid,
          email: baseUser.email,
          displayName: data.displayName || baseUser.displayName,
          role: data.role || baseUser.role,
          photoURL: data.photoURL || baseUser.photoURL,
          totalScore: data.totalScore || 0,
          totalWritings: data.totalWritings || 0,
          streakDays: data.streakDays || 1,
          level: (data.totalScore || 0) > 300 
            ? 'Mutaqaddim (Mahir)' 
            : (data.totalScore || 0) > 100 
            ? 'Mutawassith (Menengah)' 
            : 'Mubtadi (Pemula)'
        };
        return profile;
      } else {
        const newProfile: StudentProfile = {
          uid: baseUser.uid,
          email: baseUser.email,
          displayName: baseUser.displayName,
          role: baseUser.role,
          photoURL: baseUser.photoURL || null,
          totalScore: 50, // Welcome points
          totalWritings: 0,
          streakDays: 1,
          level: 'Mubtadi (Pemula)'
        };
        await setDoc(userDocRef, {
          userId: baseUser.uid,
          displayName: newProfile.displayName,
          email: newProfile.email || '',
          role: newProfile.role,
          photoURL: newProfile.photoURL || '',
          totalScore: newProfile.totalScore,
          totalWritings: newProfile.totalWritings,
          streakDays: newProfile.streakDays,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        return newProfile;
      }
    } catch (err) {
      console.warn('Could not sync to Firestore, falling back to local memory:', err);
      // Fallback profile if offline/permission issue
      return {
        uid: baseUser.uid,
        email: baseUser.email,
        displayName: baseUser.displayName,
        role: baseUser.role,
        photoURL: baseUser.photoURL,
        totalScore: 50,
        totalWritings: 0,
        streakDays: 1,
        level: 'Mubtadi (Pemula)'
      };
    }
  };

  useEffect(() => {
    // Check local student session first
    const savedSession = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setUser(parsed);
        setIsLoading(false);
      } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }

    // Subscribe to Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const profile = await syncProfileToFirestore({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || 'Pelajar Maharah Kitabah',
            photoURL: fbUser.photoURL,
            role: 'pelajar'
          });
          setUser(profile);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
        } catch (e) {
          console.error('Error on auth change profile sync:', e);
        }
      } else if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login with specified user: "pelajar" & password: "12345678"
  const loginWithCredentials = async (username: string, pass: string): Promise<boolean> => {
    setLoginError(null);
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    if ((cleanUser === 'pelajar' || cleanUser === 'pelajar@kitabah.id' || cleanUser === 'siswa') && cleanPass === '12345678') {
      const studentUid = 'pelajar_um_maharah_kitabah';
      const studentProfile: StudentProfile = {
        uid: studentUid,
        email: 'pelajar@kitabah.edu',
        displayName: 'Ahmad Pelajar (طَالِبٌ)',
        role: 'pelajar',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        totalScore: 85,
        totalWritings: 3,
        streakDays: 4,
        level: 'Mubtadi (Pemula)'
      };

      try {
        // Attempt to sync in Firestore
        await syncProfileToFirestore(studentProfile);
      } catch (err) {
        console.warn('Firestore sync note:', err);
      }

      setUser(studentProfile);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(studentProfile));
      return true;
    } else {
      setLoginError('Username atau kata sandi salah. Gunakan Username: "pelajar" dan Password: "12345678".');
      return false;
    }
  };

  // Google Sign-In with Firebase Auth
  const loginWithGoogle = async () => {
    setLoginError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const profile = await syncProfileToFirestore({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'Pelajar Kitabah',
        photoURL: fbUser.photoURL,
        role: 'pelajar'
      });
      setUser(profile);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setLoginError('Gagal masuk dengan Google: ' + (err.message || 'Pop-up ditutup atau diblokir.'));
    }
  };

  // Logout
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      // ignore
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUser(null);
  };

  // Update student score & writing counts in state & Firestore
  const updateUserStats = async (scoreIncrement: number, isNewWriting = false) => {
    if (!user) return;
    const newTotalScore = (user.totalScore || 0) + scoreIncrement;
    const newTotalWritings = isNewWriting ? (user.totalWritings || 0) + 1 : (user.totalWritings || 0);
    const newLevel = newTotalScore > 300 
      ? 'Mutaqaddim (Mahir)' 
      : newTotalScore > 100 
      ? 'Mutawassith (Menengah)' 
      : 'Mubtadi (Pemula)';

    const updated: StudentProfile = {
      ...user,
      totalScore: newTotalScore,
      totalWritings: newTotalWritings,
      level: newLevel
    };

    setUser(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    // Try updating Firestore doc
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        totalScore: newTotalScore,
        totalWritings: newTotalWritings,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      // Handled gracefully
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginError,
        loginWithCredentials,
        loginWithGoogle,
        logout,
        updateUserStats
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
