const STORAGE_KEY = "donor_project_visits";

type VisitMap = Record<string, string>;

function readVisits(): VisitMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as VisitMap) : {};
  } catch {
    return {};
  }
}

function writeVisits(map: VisitMap) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getProjectLastVisit(projectId: string): string | null {
  return readVisits()[projectId] ?? null;
}

export function markProjectVisited(projectId: string) {
  const map = readVisits();
  map[projectId] = new Date().toISOString();
  writeVisits(map);
}

export function isNewSinceLastVisit(
  createdAt: string | undefined,
  projectId: string
): boolean {
  if (!createdAt) return false;
  const last = getProjectLastVisit(projectId);
  if (!last) return false;
  return createdAt > last;
}

export function getLatestContentDate(
  dates: (string | undefined)[]
): string | null {
  const valid = dates.filter(Boolean) as string[];
  if (valid.length === 0) return null;
  return valid.sort((a, b) => b.localeCompare(a))[0];
}
