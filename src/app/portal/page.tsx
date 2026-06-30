"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  findDonorByToken,
  findDonorByQrToken,
  findDonorByProjectNumber,
  getDonor,
} from "@/services/donorService";
import { validatePortalLogin } from "@/services/portalAccessService";
import { listOrgProjects } from "@/services/projectManagementService";
import { DonorProjectDashboard } from "@/components/portal/DonorProjectDashboard";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { Donor, OrgProject } from "@/types/project-management";

type LoginMode = "project" | "username";

function DonorPortalContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const qr = searchParams.get("qr");

  const [donor, setDonor] = useState<Donor | null>(null);
  const [projects, setProjects] = useState<OrgProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginMode, setLoginMode] = useState<LoginMode>("project");
  const [projectNumberInput, setProjectNumberInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadDonorProjects(d: Donor) {
    setDonor(d);
    const all = await listOrgProjects();
    setProjects(all.filter((p) => p.donorId === d.id && !p.isArchived));
  }

  useEffect(() => {
    async function autoLogin() {
      if (token) {
        const d = await findDonorByToken(token);
        if (!d) {
          setError("رابط غير صالح");
          setLoading(false);
          return;
        }
        await loadDonorProjects(d);
        setLoading(false);
        return;
      }
      if (qr) {
        const d = await findDonorByQrToken(qr);
        if (!d) {
          setError("رمز QR غير صالح");
          setLoading(false);
          return;
        }
        await loadDonorProjects(d);
        setLoading(false);
        return;
      }
      setLoading(false);
    }
    autoLogin();
  }, [token, qr]);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
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
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card padding="lg" className="w-full max-w-md space-y-4">
          <h1 className="text-xl font-bold text-brand-green-dark dark:text-brand-green">
            بوابة المتبرعين
          </h1>

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
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
              />
              <Input
                label="الرمز السري"
                type="password"
                dir="ltr"
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
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card padding="lg">
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-1 text-2xl font-bold">مرحباً، {donor.fullName}</h1>
        <p className="mb-8 text-muted-foreground">بوابة متابعة مشاريعك الخيرية</p>
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
  );
}

export default function DonorPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <DonorPortalContent />
    </Suspense>
  );
}
