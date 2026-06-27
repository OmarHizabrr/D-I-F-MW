import { FirebaseError } from "firebase/app";

const AUTH_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "البريد الإلكتروني غير صالح.",
  "auth/user-disabled": "تم تعطيل هذا الحساب.",
  "auth/user-not-found": "لا يوجد حساب بهذا البريد في Firebase Authentication.",
  "auth/wrong-password": "كلمة المرور غير صحيحة.",
  "auth/invalid-credential": "بيانات الدخول غير صحيحة.",
  "auth/too-many-requests": "محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً.",
  "auth/network-request-failed": "خطأ في الاتصال بالشبكة.",
  "auth/invalid-api-key": "مفتاح Firebase غير صالح — تحقق من متغيرات البيئة.",
  "auth/operation-not-allowed": "تسجيل الدخول بالبريد غير مفعّل في Firebase Console.",
};

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError && AUTH_MESSAGES[error.code]) {
    return AUTH_MESSAGES[error.code];
  }
  if (error instanceof Error && error.message.includes("Firebase is not configured")) {
    return "Firebase غير مهيّأ. أضف متغيرات NEXT_PUBLIC_FIREBASE_* في البيئة.";
  }
  return "فشل تسجيل الدخول. راجع Console للتفاصيل.";
}

export function logAuthError(context: string, error: unknown, extra?: Record<string, unknown>) {
  const firebaseError =
    error instanceof FirebaseError
      ? { code: error.code, message: error.message, name: error.name }
      : error;

  console.error(`[${context}]`, {
    ...extra,
    error: firebaseError,
  });
}
