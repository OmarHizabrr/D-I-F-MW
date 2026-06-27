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
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  getAuth,
  type Auth,
  type User,
} from "firebase/auth";
import { getFirebaseApp, isFirebaseConfigured, logFirebaseEnvStatus } from "@/lib/firebase/client";
import { logAuthError } from "@/lib/auth-errors";
import {
  getUserProfile,
  registerAdminUser,
  registerPublicUser,
} from "@/services/userService";
import type { AppUser } from "@/types/user";
import { isAdminRole } from "@/types/user";

type AuthContextValue = {
  user: User | null;
  userProfile: AppUser | null;
  isAdmin: boolean;
  loading: boolean;
  profileLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured());
  const [profileLoading, setProfileLoading] = useState(false);

  const loadProfile = useCallback(async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      setUserProfile(null);
      return;
    }
    setProfileLoading(true);
    try {
      const profile = await getUserProfile(firebaseUser.uid);
      setUserProfile(profile);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      logFirebaseEnvStatus("Auth");
      return;
    }

    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      void loadProfile(firebaseUser);
      setLoading(false);
    });
    return () => unsub();
  }, [loadProfile]);

  const isAdmin = useMemo(() => {
    if (!user || !userProfile) return false;
    return (
      isAdminRole(userProfile.role) &&
      userProfile.active !== false &&
      !userProfile.banned
    );
  }, [user, userProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isFirebaseConfigured()) {
      throw new Error("Firebase is not configured.");
    }

    try {
      const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      const firebaseUser = credential.user;
      try {
        await registerAdminUser(firebaseUser.uid, firebaseUser.email || email, getUserMeta(firebaseUser));
        await loadProfile(firebaseUser);
      } catch (profileError) {
        await signOut(getFirebaseAuth());
        throw profileError;
      }
    } catch (error) {
      logAuthError("Auth.signIn", error, { email });
      throw error;
    }
  }, [loadProfile]);

  const signInWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured()) {
      throw new Error("Firebase is not configured.");
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const credential = await signInWithPopup(getFirebaseAuth(), provider);
      const firebaseUser = credential.user;

      await registerPublicUser(
        firebaseUser.uid,
        firebaseUser.email || "",
        firebaseUser.displayName || "",
        firebaseUser.photoURL || ""
      );

      const profile = await getUserProfile(firebaseUser.uid);
      if (profile?.banned) {
        await signOut(getFirebaseAuth());
        throw new Error("BANNED");
      }

      await loadProfile(firebaseUser);
      return firebaseUser;
    } catch (error) {
      logAuthError("Auth.signInWithGoogle", error);
      throw error;
    }
  }, [loadProfile]);

  const handleSignOut = useCallback(async () => {
    if (!isFirebaseConfigured()) return;
    await signOut(getFirebaseAuth());
    setUserProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await loadProfile(user);
  }, [user, loadProfile]);

  const value = useMemo(
    () => ({
      user,
      userProfile,
      isAdmin,
      loading,
      profileLoading,
      signIn,
      signInWithGoogle,
      signOut: handleSignOut,
      refreshProfile,
    }),
    [user, userProfile, isAdmin, loading, profileLoading, signIn, signInWithGoogle, handleSignOut, refreshProfile]
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
