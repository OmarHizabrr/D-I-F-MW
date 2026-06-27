"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { isAdminBootstrapAvailable } from "@/services/userService";
import { getAuthErrorMessage, logAuthError } from "@/lib/auth-errors";
import { getFirebaseEnvStatus, isFirebaseConfigured, logFirebaseEnvStatus } from "@/lib/firebase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

export default function AdminLoginPage() {
  const { user, loading, signIn, isAdmin } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [setupAvailable, setSetupAvailable] = useState(false);

  useEffect(() => {
    setMounted(true);
    logFirebaseEnvStatus("Admin Login");
    isAdminBootstrapAvailable().then(setSetupAvailable);
  }, []);

  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.replace("/admin");
    }
  }, [loading, user, isAdmin, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const envStatus = getFirebaseEnvStatus();
    console.log("[Admin Login] بدء المحاولة", {
      email,
      firebaseConfigured: isFirebaseConfigured(),
      source: envStatus.source,
    });

    try {
      await signIn(email, password);
      router.replace("/admin");
    } catch (err) {
      logAuthError("Admin Login", err, {
        email,
        firebaseConfigured: isFirebaseConfigured(),
        source: envStatus.source,
      });
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const envStatus = mounted ? getFirebaseEnvStatus() : null;
  const firebaseReady = mounted ? isFirebaseConfigured() : true;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md" padding="lg">
        <CardHeader>
          <CardTitle className="text-center text-brand-green-dark dark:text-brand-green">
            دخول لوحة الإدارة
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            مؤسسة التطوير والتنمية — D.I.F
          </p>
        </CardHeader>

        <CardContent>
          {mounted && setupAvailable && (
            <div className="mb-4 rounded-xl border border-brand-green/30 bg-brand-green/10 px-4 py-3 text-sm">
              <p className="font-semibold text-brand-green-dark dark:text-brand-green">
                أول استخدام للنظام؟
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                أنشئ حساب المدير الأول للدخول إلى لوحة التحكم
              </p>
              <Link
                href="/admin/setup"
                className="mt-2 inline-block text-sm font-semibold text-brand-green hover:underline"
              >
                إعداد المدير الأول ←
              </Link>
            </div>
          )}

          {mounted && envStatus?.usingFallback && (
            <div className="mb-4 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-900 dark:text-sky-100">
              <p className="font-semibold">تنبيه: متغيرات Vercel غير مدمجة في البناء</p>
              <p className="mt-1 text-xs leading-relaxed opacity-90">
                الموقع يستخدم الإعداد المدمج مؤقتاً. بعد إضافة المتغيرات في Vercel اضغط Redeploy
                بدون Build Cache.
              </p>
            </div>
          )}

          {mounted && !firebaseReady && (
            <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
              <p className="font-semibold">Firebase غير مهيّأ</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="البريد الإلكتروني"
              type="email"
              dir="ltr"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              disabled={!firebaseReady}
            />

            <Input
              label="كلمة المرور"
              type="password"
              dir="ltr"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!firebaseReady}
            />

            {error && (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              fullWidth
              loading={submitting}
              loadingText="جاري الدخول..."
              disabled={!firebaseReady}
            >
              تسجيل الدخول
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/" className="text-brand-green hover:underline">
              العودة للموقع
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
