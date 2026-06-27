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
import { getFirebaseApp, isFirebaseConfigured, logFirebaseEnvStatus } from "@/lib/firebase/client";
import { logAuthError } from "@/lib/auth-errors";
import { registerUser } from "@/services/seedService";

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
  const [loading, setLoading] = useState(isFirebaseConfigured());

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      logFirebaseEnvStatus("Auth");
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
    console.log("[Auth] محاولة تسجيل الدخول", {
      email,
      firebaseConfigured: isFirebaseConfigured(),
    });

    if (!isFirebaseConfigured()) {
      const err = new Error("Firebase is not configured.");
      logAuthError("Auth.signIn", err, { email });
      throw err;
    }

    try {
      const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      const firebaseUser = credential.user;

      console.log("[Auth] نجح Authentication", {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
      });

      try {
        await registerUser(
          firebaseUser.uid,
          firebaseUser.email || email,
          getUserMeta(firebaseUser)
        );
        console.log("[Auth] تم حفظ المستخدم في Firestore", {
          path: `users/global/users/${firebaseUser.uid}`,
        });
      } catch (firestoreError) {
        logAuthError("Auth.registerUser", firestoreError, {
          uid: firebaseUser.uid,
          hint: "الدخول نجح لكن فشل حفظ المستخدم في Firestore — تحقق من قواعد الأمان",
        });
      }
    } catch (error) {
      logAuthError("Auth.signIn", error, { email });
      throw error;
    }
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
