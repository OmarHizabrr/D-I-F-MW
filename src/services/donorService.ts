import { getDocs, query, where } from "firebase/firestore";
import FirestoreApi, { type UserMeta } from "@/services/firestoreApi";
import { syncPortalAccess } from "@/services/portalAccessService";
import type { Donor } from "@/types/project-management";

const api = FirestoreApi.Api;

function generateToken(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}

export async function listDonors(): Promise<Donor[]> {
  const snap = await getDocs(api.getDonorsCollection());
  return snap.docs
    .map((d) => api.docToData<Donor>(d))
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

export async function getDonor(donorId: string): Promise<Donor | null> {
  const data = await api.getData(api.getDonorDoc(donorId));
  return data ? ({ id: donorId, ...data } as Donor) : null;
}

export async function createDonor(
  data: Omit<Donor, "id" | "createdAt" | "updatedAt" | "qrCodeToken" | "secureLinkToken">,
  user: UserMeta
): Promise<string> {
  const id = api.getNewId("donor");
  const qrCodeToken = generateToken();
  const secureLinkToken = generateToken();
  await api.setData({
    docRef: api.getDonorDoc(id),
    data: {
      ...data,
      id,
      qrCodeToken,
      secureLinkToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    merge: false,
    userData: user,
  });
  await api.setData({
    docRef: api.getPortalTokenDoc(secureLinkToken),
    data: { donorId: id, type: "secure" },
    merge: false,
    userData: user,
  });
  await api.setData({
    docRef: api.getPortalTokenDoc(qrCodeToken),
    data: { donorId: id, type: "qr" },
    merge: false,
    userData: user,
  });
  await syncPortalAccess(
    id,
    data.fullName,
    data.portalUsername,
    data.portalPin,
    data.portalEnabled,
    user
  );
  return id;
}

export async function updateDonor(
  donorId: string,
  data: Partial<Donor>,
  user: UserMeta
): Promise<void> {
  const { id: _id, ...rest } = data;
  await api.updateData({
    docRef: api.getDonorDoc(donorId),
    data: { ...rest, updatedAt: new Date().toISOString() },
    userData: user,
  });
  if (rest.fullName !== undefined || rest.portalUsername !== undefined || rest.portalPin !== undefined || rest.portalEnabled !== undefined) {
    const donor = await getDonor(donorId);
    if (donor) {
      await syncPortalAccess(
        donorId,
        donor.fullName,
        donor.portalUsername,
        donor.portalPin,
        donor.portalEnabled,
        user
      );
    }
  }
}

export async function deleteDonor(donorId: string): Promise<void> {
  await api.deleteData(api.getDonorDoc(donorId));
}

export async function findDonorByToken(token: string): Promise<Donor | null> {
  const tokenDoc = await api.getData(api.getPortalTokenDoc(token));
  if (tokenDoc && typeof tokenDoc.donorId === "string") {
    return getDonor(tokenDoc.donorId);
  }
  const q = query(api.getDonorsCollection(), where("secureLinkToken", "==", token));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return api.docToData<Donor>(snap.docs[0]);
}

export async function findDonorByQrToken(token: string): Promise<Donor | null> {
  return findDonorByToken(token);
}

export async function findDonorByProjectNumber(
  projectNumber: string
): Promise<{ donor: Donor; projectId: string } | null> {
  const projects = await import("@/services/projectManagementService").then((m) =>
    m.listOrgProjects()
  );
  const project = projects.find((p) => p.projectNumber === projectNumber);
  if (!project?.donorId) return null;
  const donor = await getDonor(project.donorId);
  if (!donor) return null;
  return { donor, projectId: project.id };
}

export function getDonorPortalUrl(donor: Donor): string {
  if (typeof window === "undefined") return `/portal?token=${donor.secureLinkToken}`;
  return `${window.location.origin}/portal?token=${donor.secureLinkToken}`;
}

export function getDonorQrPortalUrl(donor: Donor): string {
  if (typeof window === "undefined") return `/portal?qr=${donor.qrCodeToken}`;
  return `${window.location.origin}/portal?qr=${donor.qrCodeToken}`;
}

export function generatePortalPin(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
