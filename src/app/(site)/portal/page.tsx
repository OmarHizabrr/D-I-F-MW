"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  findDonorByToken,
  findDonorByQrToken,
  findDonorByProjectNumber,
  getDonor,
} from "@/services/donorService";
import { validatePortalLogin } from "@/services/portalAccessService";
import { listOrgProjects } from "@/services/projectManagementService";
import { filterDonorProjects } from "@/lib/donor-project-utils";
import { FORM_PLACEHOLDERS } from "@/lib/admin/form-placeholders";
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
  const token = searchParams.get("token");
  const qr = searchParams.get("qr");
  const { portalEnabled, loading: settingsLoading } = useSystemSettings();

  const [donor, setDonor] = useState<Donor | null>(null);
  const [projects, setProjects] = useState<OrgProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginMode, setLoginMode] = useState<LoginMode>("project");
  const [projectNumberInput, setProjectNumberInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadDonorProjects = useCallback(async (d: Donor) => {
    setDonor(d);
    const all = await listOrgProjects();
    setProjects(filterDonorProjects(all, d.id));
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (token) {
        const d = await findDonorByToken(token);
        if (cancelled) return;
        if (!d) setError("رابط غير صالح");
        else await loadDonorProjects(d);
        setLoading(false);
        return;
      }
      if (qr) {
        const d = await findDonorByQrToken(qr);
        if (cancelled) return;
        if (!d) setError("رمز QR غير صالح");
        else await loadDonorProjects(d);
        setLoading(false);
        return;
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [token, qr, loadDonorProjects]);

  async function handleProjectNumberLogin() {
    setError(null);
    setLoading(true);
    const result = await findDonorByProjectNumber(projectNumberInput.trim());
    if (!result) {
      setError("رقم المشروع غير موجود أو غير مرتبط بمتبرع");
      setLoading(false);
      return;
    }
    await loadDonorProjects(result.donor);
    if (result.projectId) setSelectedProjectId(result.projectId);
    setLoading(false);
  }

  async function handleUsernameLogin() {
    setError(null);
    setLoading(true);
    const access = await validatePortalLogin(usernameInput, pinInput);
    if (!access) {
      setError("اسم المستخدم أو الرمز غير صحيح");
      setLoading(false);
      return;
    }
    const d = await getDonor(access.donorId);
    if (!d) {
      setError("حساب المتبرع غير موجود");
      setLoading(false);
      return;
    }
    await loadDonorProjects(d);
    setLoading(false);
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
          <Card padding="lg" className="mx-auto w-full max-w-md space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              أدخل بيانات الدخول التي زوّدتك بها المؤسسة لمتابعة مشاريعك
            </p>

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
                  للمتبرع الرئيسي — أدخل رقم المشروع
                </p>
                <Input
                  label="رقم المشروع"
                  dir="ltr"
                  placeholder={FORM_PLACEHOLDERS.portal.projectNumber}
                  hint="المتبرعون الإضافيون يدخلون باسم المستخدم والرمز"
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
