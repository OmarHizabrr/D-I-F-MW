export const FIREBASE_PROJECT_CONFIG = {
  apiKey: "AIzaSyDRPehpzeSWE81H4Pvi3Z3cAFXxiScNnXg",
  authDomain: "d-i-f-mw.firebaseapp.com",
  projectId: "d-i-f-mw",
  storageBucket: "d-i-f-mw.firebasestorage.app",
  messagingSenderId: "988689328283",
  appId: "1:988689328283:web:19b54ac20774af69effe3e",
  measurementId: "G-794BRCPQ61",
} as const;

export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

/** يدمج متغيرات Vercel مع الإعداد الافتراضي للمشروع (مفاتيح الويب العامة) */
export function resolveFirebaseConfig(): FirebaseWebConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || FIREBASE_PROJECT_CONFIG.apiKey,
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || FIREBASE_PROJECT_CONFIG.authDomain,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || FIREBASE_PROJECT_CONFIG.projectId,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || FIREBASE_PROJECT_CONFIG.storageBucket,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
      FIREBASE_PROJECT_CONFIG.messagingSenderId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || FIREBASE_PROJECT_CONFIG.appId,
    measurementId:
      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || FIREBASE_PROJECT_CONFIG.measurementId,
  };
}

export function isFirebaseConfigResolved(config: FirebaseWebConfig): boolean {
  return Boolean(config.apiKey && config.projectId && config.appId);
}
