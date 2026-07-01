const SESSION_KEY = "dif_donor_session";

export type DonorSession = {
  donorId: string;
  sessionToken: string;
  savedAt: string;
};

export function saveDonorSession(donorId: string, sessionToken: string): void {
  if (typeof window === "undefined") return;
  const payload: DonorSession = {
    donorId,
    sessionToken,
    savedAt: new Date().toISOString(),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
}

export function getDonorSession(): DonorSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as DonorSession;
    return parsed?.donorId && parsed?.sessionToken ? parsed : null;
  } catch {
    return null;
  }
}

export function clearDonorSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}
