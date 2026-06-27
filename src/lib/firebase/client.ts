import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import {
  isFirebaseConfigResolved,
  resolveFirebaseConfig,
  type FirebaseWebConfig,
} from "@/lib/firebase/config";

let firebaseApp: FirebaseApp | null = null;
let analyticsInstance: Analytics | null = null;

const FIREBASE_ENV_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
] as const;

export function getFirebaseConfig(): FirebaseWebConfig {
  return resolveFirebaseConfig();
}

export function isFirebaseConfigured(): boolean {
  return isFirebaseConfigResolved(getFirebaseConfig());
}

export function getFirebaseEnvStatus() {
  const vars = Object.fromEntries(
    FIREBASE_ENV_KEYS.map((key) => [key, Boolean(process.env[key])])
  ) as Record<(typeof FIREBASE_ENV_KEYS)[number], boolean>;

  const missing = FIREBASE_ENV_KEYS.filter((key) => !vars[key]);
  const configured = isFirebaseConfigured();
  const usingFallback = missing.length > 0 && configured;

  return {
    configured,
    usingFallback,
    vars,
    missing,
    source: missing.length === 0 ? ("env" as const) : usingFallback ? ("fallback" as const) : ("none" as const),
  };
}

export function logFirebaseEnvStatus(context = "Firebase") {
  const status = getFirebaseEnvStatus();
  console.info(`[${context}] حالة Firebase`, {
    configured: status.configured,
    source: status.source,
    missingEnv: status.missing,
    presentEnv: FIREBASE_ENV_KEYS.filter((key) => status.vars[key]),
    hint:
      status.source === "env"
        ? "Firebase من متغيرات Vercel"
        : status.source === "fallback"
          ? "Firebase يعمل من الإعداد المدمج — يُفضّل إضافة متغيرات Vercel أيضاً"
          : "Firebase غير مهيّأ",
  });
}

export function getFirebaseApp(): FirebaseApp {
  const config = getFirebaseConfig();
  if (!isFirebaseConfigResolved(config)) {
    throw new Error(
      "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* variables in your environment."
    );
  }

  if (firebaseApp) return firebaseApp;
  if (getApps().length > 0) {
    firebaseApp = getApps()[0];
    return firebaseApp;
  }

  firebaseApp = initializeApp(config);
  return firebaseApp;
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined" || !isFirebaseConfigured()) return null;
  if (analyticsInstance) return analyticsInstance;
  const supported = await isSupported();
  if (!supported) return null;
  analyticsInstance = getAnalytics(getFirebaseApp());
  return analyticsInstance;
}
