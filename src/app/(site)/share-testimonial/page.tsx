"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { submitPublicTestimonial } from "@/services/testimonialService";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { MessageSquarePlus } from "lucide-react";

export default function ShareTestimonialPage() {
  const { user, userProfile, loading, profileLoading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [quote, setQuote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const displayName =
    userProfile?.displayName || user?.displayName || user?.email?.split("@")[0] || "";
  const photoURL = userProfile?.photoURL || user?.photoURL || "";
  const isBanned = userProfile?.banned;

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      if (err instanceof Error && err.message === "BANNED") {
        setError("تم حظر حسابك من مشاركة الآراء. تواصل مع الإدارة.");
      } else {
        setError("فشل تسجيل الدخول عبر Google");
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !quote.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await submitPublicTestimonial({
        userId: user.uid,
        displayName,
        photoURL,
        quote: quote.trim(),
      });
      setSuccess(true);
      setQuote("");
    } catch {
      setError("فشل إرسال رأيك. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-dif mx-auto max-w-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
            <MessageSquarePlus className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-brand-green-dark dark:text-brand-green sm:text-3xl">
            شارك رأيك عنا
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            سجّل عبر Google وشاركنا تجربتك — يُراجع رأيك قبل النشر
          </p>
        </div>

        {!user ? (
          <Card padding="lg">
            <CardContent className="flex flex-col items-center gap-4 text-center">
              <p className="text-sm text-muted-foreground">
                يجب تسجيل الدخول عبر Google للمتابعة
              </p>
              <Button loading={googleLoading} loadingText="جاري التسجيل..." onClick={handleGoogleSignIn}>
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                التسجيل عبر Google
              </Button>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </CardContent>
          </Card>
        ) : isBanned ? (
          <Card padding="lg">
            <CardContent className="text-center">
              <p className="text-destructive font-medium">تم حظر حسابك من مشاركة الآراء</p>
              <p className="mt-2 text-sm text-muted-foreground">تواصل مع إدارة المؤسسة للاستفسار</p>
            </CardContent>
          </Card>
        ) : success ? (
          <Card padding="lg" className="border-brand-green/30 bg-brand-green/5">
            <CardContent className="text-center">
              <CardTitle className="mb-2 text-brand-green-dark dark:text-brand-green">
                شكراً لمشاركتك!
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                تم استلام رأيك وسيُراجع قبل النشر على الموقع
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button variant="secondary" onClick={() => setSuccess(false)}>
                  مشاركة رأي آخر
                </Button>
                <Button variant="outline" onClick={() => router.push("/#about")}>
                  العودة للموقع
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card padding="lg">
            <CardContent>
              <div className="mb-6 flex items-center gap-3 rounded-2xl bg-border-subtle/50 p-4">
                <UserAvatar name={displayName} photoURL={photoURL} size="md" />
                <div>
                  <p className="font-semibold">{displayName}</p>
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {user.email}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="quote" className="text-sm font-medium">
                    رأيك
                  </label>
                  <textarea
                    id="quote"
                    required
                    rows={5}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="شاركنا تجربتك مع مؤسسة D.I.F..."
                    className="w-full rounded-2xl border border-border bg-input-bg px-4 py-3 text-sm focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                  />
                </div>

                {error && (
                  <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <Button type="submit" loading={submitting} loadingText="جاري الإرسال..." fullWidth>
                  إرسال رأيي
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="text-brand-green hover:underline">
            ← العودة للصفحة الرئيسية
          </Link>
        </p>
      </div>
    </div>
  );
}
