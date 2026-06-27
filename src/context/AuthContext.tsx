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
  type User,
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase/client";
import FirestoreApi from "@/services/firestoreApi";

type AuthContextValue = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const auth = getAuth(firebaseApp);
const api = FirestoreApi.Api;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      try {
        const adminDoc = await api.getData(api.getAdminDoc(firebaseUser.uid));
        setIsAdmin(Boolean(adminDoc?.active ?? adminDoc));
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut(auth);
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
