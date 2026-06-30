"use client";

import { useEffect, useState, Suspense, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { User } from "firebase/auth";
import {
  findDonorByToken,
  findDonorByQrToken,
  findDonorByProjectNumber,
  getDonor,
} from "@/services/donorService";
import { validatePortalLogin } from "@/services/portalAccessService";
import { listOrgProjects } from "@/services/projectManagementService";
import { filterDonorProjects } from "@/lib/donor-project-utils";
import { resolveDonorForAuthUser } from "@/lib/portal/donor-auth";
import { FORM_PLACEHOLDERS } from "@/lib/admin/form-placeholders";
import { DonorProjectDashboard } from "@/components/portal/DonorProjectDashboard";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { useAuth } from "@/context/AuthContext";
import type { Donor, OrgProject } from "@/types/project-management";

type LoginMode = "project" | "username";

function GoogleIcon() {
  return (
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
  );
}

function DonorPortalContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const qr = searchParams.get("qr");
  const { portalEnabled, loading: settingsLoading } = useSystemSettings();
  const {
    user,
    loading: authLoading,
    profileLoading,
    signInWithGoogle,
    signOut,
    refreshProfile,
  } = useAuth();

  const [donor, setDonor] = useState<Donor | null>(null);
  const [projects, setProjects] = useState<OrgProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [loginMode, setLoginMode] = useState<LoginMode>("project");
  const [showLegacyLogin, setShowLegacyLogin] = useState(false);
  const [projectNumberInput, setProjectNumberInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const autoGoogleTried = useRef(false);

  const loadDonorProjects = useCallback(async (d: Donor) => {
    setDonor(d);
    const all = await listOrgProjects();
    setProjects(filterDonorProjects(all, d.id));
  }, []);

  const resolveGoogleDonor = useCallback(
    async (firebaseUser: User) => {
      setError(null);
      const result = await resolveDonorForAuthUser(firebaseUser);
      if (!result.ok) {
        setError(result.message);
        return false;
      }
      await refreshProfile();
      await loadDonorProjects(result.donor);
      return true;
    },
    [loadDonorProjects, refreshProfile]
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (token) {
        const d = await findDonorByToken(token);
        if (cancelled) return;
        if (!d) setError("رابط غير صالح");
        else await loadDonorProjects(d);
        setBootstrapping(false);
        return;
      }
      if (qr) {
        const d = await findDonorByQrToken(qr);
        if (cancelled) return;
        if (!d) setError("رمز QR غير صالح");
        else await loadDonorProjects(d);
        setBootstrapping(false);
        return;
      }
      setBootstrapping(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [token, qr, loadDonorProjects]);

  useEffect(() => {
    if (token || qr || donor || authLoading || bootstrapping || !user) return;
    if (autoGoogleTried.current) return;
    autoGoogleTried.current = true;
    void resolveGoogleDonor(user);
  }, [token, qr, donor, authLoading, bootstrapping, user, resolveGoogleDonor]);

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError(null);
    try {
      const firebaseUser = user ?? (await signInWithGoogle());
      await resolveGoogleDonor(firebaseUser);
    } catch {
      setError("فشل تسجيل الدخول عبر Google");
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleProjectNumberLogin() {
    setError(null);
    setGoogleLoading(true);
    const result = await findDonorByProjectNumber(projectNumberInput.trim());
    if (!result) {
      setError("رقم المشروع غير موجود أو غير مرتبط بمتبرع");
      setGoogleLoading(false);
      return;
    }
    await loadDonorProjects(result.donor);
    if (result.projectId) setSelectedProjectId(result.projectId);
    setGoogleLoading(false);
  }

  async function handleUsernameLogin() {
    setError(null);
    setGoogleLoading(true);
    const access = await validatePortalLogin(usernameInput, pinInput);
    if (!access) {
      setError("اسم المستخدم أو الرمز غير صحيح");
      setGoogleLoading(false);
      return;
    }
    const d = await getDonor(access.donorId);
    if (!d) {
      setError("حساب المتبرع غير موجود");
      setGoogleLoading(false);
      return;
    }
    await loadDonorProjects(d);
    setGoogleLoading(false);
  }

  async function handleSignOut() {
    await signOut();
    setDonor(null);
    setProjects([]);
    setSelectedProjectId(null);
    setError(null);
    autoGoogleTried.current = false;
  }

  const busy =
    settingsLoading || bootstrapping || authLoading || profileLoading || googleLoading;

  if (busy && !donor) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!portalEnabled) {
    return (
      <>
        <SitePageHeader title="بوابة المتبرعين" breadcrumbs={[{ label: "بوابة المتبرعين" }]} />
        <div className="section-padding">
          <Card padding="lg" className="mx-auto max-w-md text-center">
            <p className="text-muted-foreground">بوابة المتبرعين غير متاحة حالياً.</p>
          </Card>
        </div>
      </>
    );
  }

  if (selectedProjectId && donor) {
    return (
      <DonorProjectDashboard
        projectId={selectedProjectId}
        donor={donor}
        onBack={() => setSelectedProjectId(null)}
      />
    );
  }

  if (!donor) {
    return (
      <>
        <SitePageHeader title="بوابة المتبرعين" breadcrumbs={[{ label: "بوابة المتبرعين" }]} />
        <div className="section-padding bg-background">
          <Card padding="lg" className="mx-auto w-full max-w-md space-y-5">
            <div className="space-y-2 text-center">
              <p className="text-sm text-muted-foreground">
                سجّل دخولك عبر Google — يُربط حسابك تلقائياً إذا كان بريدك مسجّلاً لدى المؤسسة
              </p>
              <Button
                className="w-full"
                loading={googleLoading}
                loadingText="جاري التسجيل..."
                onClick={handleGoogleSignIn}
              >
                <GoogleIcon />
                الدخول عبر Google
              </Button>
              {user && (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => void resolveGoogleDonor(user)}
                    disabled={googleLoading}
                  >
                    إعادة محاولة الربط
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                    تسجيل الخروج وتجربة حساب آخر
                  </Button>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">أو</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLegacyLogin((v) => !v)}
              className="w-full text-center text-sm text-brand-green-dark hover:underline"
            >
              {showLegacyLogin ? "إخفاء الدخول التقليدي" : "الدخول برقم المشروع أو اسم المستخدم"}
            </button>

            {showLegacyLogin && (
              <div className="space-y-4 border-t border-border pt-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginMode("project")}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                      loginMode === "project"
                        ? "bg-brand-green/10 text-brand-green-dark"
                        : "bg-border-subtle text-muted-foreground"
                    }`}
                  >
                    رقم المشروع
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMode("username")}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                      loginMode === "username"
                        ? "bg-brand-green/10 text-brand-green-dark"
                        : "bg-border-subtle text-muted-foreground"
                    }`}
                  >
                    اسم المستخدم
                  </button>
                </div>

                {loginMode === "project" ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      أدخل رقم المشروع للوصول إلى لوحة المتابعة
                    </p>
                    <Input
                      label="رقم المشروع"
                      dir="ltr"
                      placeholder={FORM_PLACEHOLDERS.portal.projectNumber}
                      hint="للمتبرع الرئيسي فقط — المتبرعون الإضافيون يدخلون باسم المستخدم"
                      value={projectNumberInput}
                      onChange={(e) => setProjectNumberInput(e.target.value)}
                    />
                    <Button className="w-full" onClick={handleProjectNumberLogin}>
                      دخول
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      أدخل اسم المستخدم والرمز السري
                    </p>
                    <Input
                      label="اسم المستخدم"
                      dir="ltr"
                      placeholder={FORM_PLACEHOLDERS.portal.username}
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                    />
                    <Input
                      label="الرمز السري"
                      type="password"
                      dir="ltr"
                      placeholder={FORM_PLACEHOLDERS.portal.pin}
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                    />
                    <Button className="w-full" onClick={handleUsernameLogin}>
                      دخول
                    </Button>
                  </>
                )}
              </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SitePageHeader
        title={`مرحباً، ${donor.fullName}`}
        subtitle="بوابة متابعة مشاريعك الخيرية"
      />
      <div className="section-padding bg-background">
        <div className="container-dif mx-auto max-w-4xl">
          {user && (
            <div className="mb-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                تسجيل الخروج
              </Button>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <Card
                key={p.id}
                padding="lg"
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => setSelectedProjectId(p.id)}
              >
                <p className="font-semibold">{p.projectName}</p>
                <p className="text-sm text-muted-foreground">{p.projectNumber}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-border-subtle">
                  <div className="h-full bg-brand-green" style={{ width: `${p.progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{p.progress}% مكتمل</p>
              </Card>
            ))}
          </div>
          {projects.length === 0 && (
            <Card padding="lg">
              <p className="text-center text-muted-foreground">لا توجد مشاريع مرتبطة بحسابك</p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

export default function DonorPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      }
    >
      <DonorPortalContent />
    </Suspense>
  );
}
