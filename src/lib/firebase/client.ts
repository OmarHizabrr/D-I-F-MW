import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

let firebaseApp: FirebaseApp | null = null;
let analyticsInstance: Analytics | null = null;

export function isFirebaseConfigured(): boolean {
  return getFirebaseEnvStatus().configured;
}

const FIREBASE_ENV_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
] as const;

export function getFirebaseEnvStatus() {
  const vars = Object.fromEntries(
    FIREBASE_ENV_KEYS.map((key) => [key, Boolean(process.env[key])])
  ) as Record<(typeof FIREBASE_ENV_KEYS)[number], boolean>;

  const requiredKeys = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ] as const;

  const missing = FIREBASE_ENV_KEYS.filter((key) => !vars[key]);
  const missingRequired = requiredKeys.filter((key) => !vars[key]);

  return {
    configured: missingRequired.length === 0,
    vars,
    missing,
    missingRequired,
  };
}

export function logFirebaseEnvStatus(context = "Firebase") {
  const status = getFirebaseEnvStatus();
  console.warn(`[${context}] حالة متغيرات البيئة`, {
    configured: status.configured,
    missing: status.missing,
    present: FIREBASE_ENV_KEYS.filter((key) => status.vars[key]),
    hint: status.configured
      ? "Firebase جاهز"
      : "أضف المتغيرات الناقصة في Vercel → Settings → Environment Variables ثم أعد النشر (Redeploy)",
  });
}

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* variables in your environment."
    );
  }

  if (firebaseApp) return firebaseApp;
  if (getApps().length > 0) {
    firebaseApp = getApps()[0];
    return firebaseApp;
  }

  firebaseApp = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  });

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
