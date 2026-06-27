"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirebaseApp, isFirebaseConfigured, logFirebaseEnvStatus } from "@/lib/firebase/client";
import { createFirstAdminAccount, isAdminBootstrapAvailable } from "@/services/userService";
import { getAuthErrorMessage, logAuthError } from "@/lib/auth-errors";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

export default function AdminSetupPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [available, setAvailable] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logFirebaseEnvStatus("Admin Setup");
    isAdminBootstrapAvailable()
      .then((open) => {
        setAvailable(open);
        if (!open) {
          router.replace("/admin/login");
        }
      })
      .finally(() => setChecking(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setSubmitting(true);
    try {
      await createFirstAdminAccount(email.trim(), password);
      await signInWithEmailAndPassword(getAuth(getFirebaseApp()), email.trim(), password);
      router.replace("/admin/complete-profile");
    } catch (err) {
      logAuthError("Admin Setup", err, { email });
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" label="جاري التحقق..." />
      </div>
    );
  }

  if (!available) {
    return null;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md" padding="lg">
        <CardHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <CardTitle className="text-center text-brand-green-dark dark:text-brand-green">
            إعداد المدير الأول
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            أنشئ حساب مدير عام للدخول إلى لوحة التحكم — يُستخدم مرة واحدة فقط
          </p>
        </CardHeader>

        <CardContent>
          {!isFirebaseConfigured() && (
            <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
              Firebase غير مهيّأ
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
            />

            <Input
              label="كلمة المرور"
              type="password"
              dir="ltr"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hint="6 أحرف على الأقل"
            />

            <Input
              label="تأكيد كلمة المرور"
              type="password"
              dir="ltr"
              autoComplete="new-password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              fullWidth
              loading={submitting}
              loadingText="جاري إنشاء الحساب..."
              disabled={!isFirebaseConfigured()}
            >
              إنشاء حساب المدير الأول
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/admin/login" className="text-brand-green hover:underline">
              لديك حساب؟ تسجيل الدخول
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
