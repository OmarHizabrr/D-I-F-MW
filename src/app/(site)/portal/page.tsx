"use client";

import { useEffect, useState, Suspense, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FORM_PLACEHOLDERS } from "@/lib/admin/form-placeholders";
import { DONOR_PORTAL_DISABLED_MESSAGE, isDonorPortalActive } from "@/lib/portal/donor-access";
import {
  loginDonorWithCredentials,
  loginDonorWithToken,
  loginDonorWithProjectNumber,
  fetchDonorPortalProjects,
  fetchDonorFromSession,
} from "@/lib/portal/portal-login-client";
import {
  clearDonorSession,
  getDonorSession,
  saveDonorSession,
} from "@/lib/portal/donor-session";
import { DonorProjectDashboard } from "@/components/portal/DonorProjectDashboard";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import type { Donor, OrgProject } from "@/types/project-management";

type LoginMode = "project" | "username";

function DonorPortalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const qr = searchParams.get("qr");
  const projectParam = searchParams.get("project");
  const { portalEnabled, loading: settingsLoading } = useSystemSettings();

  const [donor, setDonor] = useState<Donor | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [projects, setProjects] = useState<OrgProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginMode, setLoginMode] = useState<LoginMode>("project");
  const [projectNumberInput, setProjectNumberInput] = useState(projectParam ?? "");
  const [usernameInput, setUsernameInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const autoLoginAttempted = useRef(false);

  const stripSensitiveQueryParams = useCallback(() => {
    if (token || qr) router.replace("/portal");
  }, [router, token, qr]);

  const applyAuth = useCallback(
    async (d: Donor, token: string, preferredProjectId?: string) => {
      if (!isDonorPortalActive(d)) {
        setError(DONOR_PORTAL_DISABLED_MESSAGE);
        setDonor(null);
        return;
      }
      setDonor(d);
      setSessionToken(token);
      saveDonorSession(d.id, token);
      const mine = await fetchDonorPortalProjects(token);
      setProjects(mine);
      if (preferredProjectId && mine.some((p) => p.id === preferredProjectId)) {
        setSelectedProjectId(preferredProjectId);
      } else if (projectParam) {
        const match = mine.find((p) => p.projectNumber === projectParam.trim());
        if (match) setSelectedProjectId(match.id);
      }
    },
    [projectParam]
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const linkToken = token || qr;
      if (linkToken) {
        const result = await loginDonorWithToken(linkToken);
        if (cancelled) return;
        if (!result.ok) setError(result.message);
        else {
          await applyAuth(result.data.donor, result.data.sessionToken);
          stripSensitiveQueryParams();
        }
        setLoading(false);
        return;
      }

      const session = getDonorSession();
      if (session?.sessionToken) {
        const d = await fetchDonorFromSession(session.sessionToken);
        if (!cancelled && d && isDonorPortalActive(d)) {
          await applyAuth(d, session.sessionToken);
          setLoading(false);
          return;
        }
        clearDonorSession();
      }

      setLoading(false);

      if (projectParam && !autoLoginAttempted.current) {
        autoLoginAttempted.current = true;
        setSubmitting(true);
        const result = await loginDonorWithProjectNumber(projectParam.trim());
        if (cancelled) return;
        if (result.ok) {
          await applyAuth(
            result.data.donor,
            result.data.sessionToken,
            result.data.projectId
          );
        }
        setSubmitting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, qr, projectParam, applyAuth, stripSensitiveQueryParams]);

  async function handleProjectNumberLogin(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await loginDonorWithProjectNumber(projectNumberInput.trim());
    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
      return;
    }
    await applyAuth(
      result.data.donor,
      result.data.sessionToken,
      result.data.projectId
    );
    setSubmitting(false);
  }

  async function handleUsernameLogin(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await loginDonorWithCredentials(usernameInput, pinInput);
    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
      return;
    }
    await applyAuth(result.data.donor, result.data.sessionToken);
    setSubmitting(false);
  }

  function handleLogout() {
    clearDonorSession();
    setDonor(null);
    setSessionToken(null);
    setProjects([]);
    setSelectedProjectId(null);
    setError(null);
  }

  if (settingsLoading || loading) {
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

  if (selectedProjectId && donor && sessionToken) {
    return (
      <DonorProjectDashboard
        projectId={selectedProjectId}
        donor={donor}
        sessionToken={sessionToken}
        onBack={() => setSelectedProjectId(null)}
        onLogout={handleLogout}
      />
    );
  }

  if (!donor) {
    return (
      <>
        <SitePageHeader title="بوابة المتبرعين" breadcrumbs={[{ label: "بوابة المتبرعين" }]} />
        <div className="section-padding bg-background">
          <Card padding="lg" className="mx-auto w-full max-w-md space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              أدخل بيانات الدخول التي زوّدتك بها المؤسسة لمتابعة مشاريعك بشكل مستمر
            </p>
            <p className="text-center text-xs text-muted-foreground">
              تبقى جلستك نشطة في هذا المتصفح حتى تسجيل الخروج
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLoginMode("project")}
                className={`min-h-11 flex-1 rounded-lg px-3 py-2.5 text-sm font-medium ${
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
                className={`min-h-11 flex-1 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  loginMode === "username"
                    ? "bg-brand-green/10 text-brand-green-dark"
                    : "bg-border-subtle text-muted-foreground"
                }`}
              >
                اسم المستخدم
              </button>
            </div>

            {loginMode === "project" ? (
              <form onSubmit={handleProjectNumberLogin} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  <strong>للمتبرع الرئيسي فقط</strong> — أدخل رقم المشروع الذي زوّدتك به المؤسسة
                </p>
                <Input
                  label="رقم المشروع"
                  dir="ltr"
                  placeholder={FORM_PLACEHOLDERS.portal.projectNumber}
                  hint="المتبرعون الإضافيون: استخدم تبويب «اسم المستخدم»"
                  value={projectNumberInput}
                  onChange={(e) => setProjectNumberInput(e.target.value)}
                />
                <Button type="submit" className="w-full" loading={submitting}>
                  دخول
                </Button>
              </form>
            ) : (
              <form onSubmit={handleUsernameLogin} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  للمتبرع الرئيسي والمتبرعين الإضافيين — اسم المستخدم والرمز السري
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
                <Button type="submit" className="w-full" loading={submitting}>
                  دخول
                </Button>
              </form>
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
        subtitle="بوابة متابعة مشاريعك الخيرية — محدّثة باستمرار"
      />
      <div className="section-padding bg-background">
        <div className="container-dif mx-auto max-w-4xl">
          <div className="mb-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              تسجيل الخروج
            </Button>
          </div>
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
              <p className="text-center text-muted-foreground">
                لا توجد مشاريع مرتبطة بحسابك حالياً — تواصل مع المؤسسة لربط مشروعك
              </p>
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
