import type { Donor, OrgProject } from "@/types/project-management";

export type PortalAuthResult = {
  donor: Donor;
  sessionToken: string;
  projectId?: string;
};

async function parsePortalResponse(res: Response): Promise<PortalAuthResult | { error: string }> {
  const body = (await res.json().catch(() => ({}))) as {
    error?: string;
    donor?: Donor;
    sessionToken?: string;
    projectId?: string;
  };
  if (!res.ok) {
    return { error: body.error ?? "فشل تسجيل الدخول" };
  }
  if (!body.donor?.id || !body.sessionToken) {
    return { error: "استجابة غير صالحة من الخادم" };
  }
  return {
    donor: body.donor,
    sessionToken: body.sessionToken,
    projectId: body.projectId,
  };
}

export async function loginDonorWithCredentials(
  username: string,
  pin: string
): Promise<{ ok: true; data: PortalAuthResult } | { ok: false; message: string }> {
  const res = await fetch("/api/portal/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, pin }),
  });
  const parsed = await parsePortalResponse(res);
  if ("error" in parsed) return { ok: false, message: parsed.error };
  return { ok: true, data: parsed };
}

export async function loginDonorWithToken(
  token: string
): Promise<{ ok: true; data: PortalAuthResult } | { ok: false; message: string }> {
  const res = await fetch("/api/portal/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const parsed = await parsePortalResponse(res);
  if ("error" in parsed) return { ok: false, message: parsed.error };
  return { ok: true, data: parsed };
}

export async function loginDonorWithProjectNumber(
  projectNumber: string
): Promise<{ ok: true; data: PortalAuthResult } | { ok: false; message: string }> {
  const res = await fetch("/api/portal/project-number", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectNumber }),
  });
  const parsed = await parsePortalResponse(res);
  if ("error" in parsed) return { ok: false, message: parsed.error };
  return { ok: true, data: parsed };
}

export async function fetchDonorPortalProjects(sessionToken: string): Promise<OrgProject[]> {
  const res = await fetch("/api/portal/projects", {
    headers: { "X-Portal-Session": sessionToken },
  });
  if (!res.ok) return [];
  const body = (await res.json()) as { projects?: OrgProject[] };
  return body.projects ?? [];
}

export async function fetchDonorFromSession(
  sessionToken: string
): Promise<Donor | null> {
  const res = await fetch("/api/portal/donor", {
    headers: { "X-Portal-Session": sessionToken },
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { donor?: Donor };
  return body.donor ?? null;
}

export async function fetchDonorProjectDetail(sessionToken: string, projectId: string) {
  const res = await fetch(`/api/portal/projects/${projectId}`, {
    headers: { "X-Portal-Session": sessionToken },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function submitDonorRating(
  sessionToken: string,
  rating: {
    projectId: string;
    qualityRating: number;
    executionRating: number;
    communicationRating: number;
    suggestions?: string;
  }
): Promise<boolean> {
  const res = await fetch("/api/portal/ratings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Portal-Session": sessionToken,
    },
    body: JSON.stringify(rating),
  });
  return res.ok;
}
