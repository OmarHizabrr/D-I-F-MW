"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  type Auth,
  type User,
} from "firebase/auth";
import { getFirebaseApp, isFirebaseConfigured } from "@/lib/firebase/client";

type AuthContextValue = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAdmin(Boolean(firebaseUser));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isFirebaseConfigured()) {
      throw new Error("Firebase is not configured.");
    }
    await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  }, []);

  const handleSignOut = useCallback(async () => {
    if (!isFirebaseConfigured()) return;
    await signOut(getFirebaseAuth());
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      loading,
      signIn,
      signOut: handleSignOut,
    }),
    [user, isAdmin, loading, signIn, handleSignOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getUserMeta(user: User | null) {
  return {
    uid: user?.uid,
    displayName: user?.displayName || user?.email || "",
    photoURL: user?.photoURL || "",
  };
}
