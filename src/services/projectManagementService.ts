import { getDocs, query, where, orderBy } from "firebase/firestore";
import FirestoreApi, { type UserMeta } from "@/services/firestoreApi";
import { CMS_PROJECTS_ROOT } from "@/lib/firebase/database-structure";
import { PROJECT_SUBCOLLECTIONS } from "@/types/project-management";
import type {
  OrgProject,
  ProjectPhoto,
  ProjectVideo,
  ProjectContract,
  ProjectInvoice,
  ProjectReport,
  ProjectUpdate,
  ProjectTimelineEntry,
  ProjectLocation,
  ProjectBeneficiaries,
  PhotoPhase,
  ReportType,
} from "@/types/project-management";

const api = FirestoreApi.Api;

export async function listOrgProjects(): Promise<OrgProject[]> {
  const snap = await getDocs(api.getOrgProjectsCollection());
  return snap.docs
    .filter((d) => d.id !== CMS_PROJECTS_ROOT)
    .map((d) => api.docToData<OrgProject>(d))
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

/** مشاريع منشورة على الموقع العام */
export async function listPublishedOrgProjects(): Promise<OrgProject[]> {
  const all = await listOrgProjects();
  return all
    .filter(
      (p) =>
        p.publishedOnSite === true &&
        !p.isArchived &&
        p.status !== "draft" &&
        p.status !== "cancelled"
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getOrgProject(projectId: string): Promise<OrgProject | null> {
  const data = await api.getData(api.getOrgProjectDoc(projectId));
  return data ? ({ id: projectId, ...data } as OrgProject) : null;
}

export async function createOrgProject(
  data: Omit<OrgProject, "id" | "createdAt" | "updatedAt">,
  user: UserMeta
): Promise<string> {
  const id = api.getNewId("org_projects");
  const docRef = api.getOrgProjectDoc(id);
  await api.setData({
    docRef,
    data: {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    merge: false,
    userData: user,
  });
  return id;
}

export async function updateOrgProject(
  projectId: string,
  data: Partial<OrgProject>,
  user: UserMeta
): Promise<void> {
  const { id: _id, ...rest } = data;
  await api.updateData({
    docRef: api.getOrgProjectDoc(projectId),
    data: { ...rest, updatedAt: new Date().toISOString() },
    userData: user,
  });
}

export async function deleteOrgProject(projectId: string): Promise<void> {
  await api.deleteData(api.getOrgProjectDoc(projectId));
}

export async function listProjectSubItems<T>(
  projectId: string,
  subCollection: string
): Promise<T[]> {
  const snap = await getDocs(api.getOrgProjectSubCollection(projectId, subCollection));
  return snap.docs.map((d) => api.docToData<T>(d));
}

export async function listProjectPhotos(
  projectId: string,
  phase: PhotoPhase
): Promise<ProjectPhoto[]> {
  const snap = await getDocs(api.getOrgProjectPhotosPhaseCollection(projectId, phase));
  return snap.docs.map((d) => ({ ...api.docToData<ProjectPhoto>(d), phase }));
}

export async function saveProjectPhoto(
  projectId: string,
  phase: PhotoPhase,
  photo: Omit<ProjectPhoto, "id" | "phase"> & { id?: string },
  user: UserMeta
): Promise<string> {
  const id = photo.id || api.getNewId("photo");
  const docRef = api.getOrgProjectPhotosPhaseDoc(projectId, phase, id);
  await api.setData({
    docRef,
    data: { ...photo, id, phase, uploadedAt: new Date().toISOString() },
    userData: user,
  });
  return id;
}

export async function deleteProjectPhoto(
  projectId: string,
  phase: PhotoPhase,
  photoId: string
): Promise<void> {
  await api.deleteData(api.getOrgProjectPhotosPhaseDoc(projectId, phase, photoId));
}

export async function saveProjectSubItem<T extends { id?: string }>(
  projectId: string,
  subCollection: string,
  item: T & Record<string, unknown>,
  user: UserMeta,
  idPrefix: string
): Promise<string> {
  const id = item.id || api.getNewId(idPrefix);
  const docRef = api.getOrgProjectSubDoc(projectId, subCollection, id);
  await api.setData({
    docRef,
    data: { ...item, id },
    userData: user,
  });
  return id;
}

export async function deleteProjectSubItem(
  projectId: string,
  subCollection: string,
  itemId: string
): Promise<void> {
  await api.deleteData(api.getOrgProjectSubDoc(projectId, subCollection, itemId));
}

export async function saveProjectLocation(
  projectId: string,
  location: ProjectLocation,
  user: UserMeta
): Promise<void> {
  await api.setData({
    docRef: api.getOrgProjectSubDoc(projectId, PROJECT_SUBCOLLECTIONS.location, "main"),
    data: location,
    userData: user,
  });
}

export async function getProjectLocation(projectId: string): Promise<ProjectLocation | null> {
  const data = await api.getData(
    api.getOrgProjectSubDoc(projectId, PROJECT_SUBCOLLECTIONS.location, "main")
  );
  return data as ProjectLocation | null;
}

export async function saveProjectBeneficiaries(
  projectId: string,
  beneficiaries: ProjectBeneficiaries,
  user: UserMeta
): Promise<void> {
  await api.setData({
    docRef: api.getOrgProjectSubDoc(projectId, PROJECT_SUBCOLLECTIONS.beneficiaries, "main"),
    data: beneficiaries,
    userData: user,
  });
}

export async function getProjectBeneficiaries(
  projectId: string
): Promise<ProjectBeneficiaries | null> {
  const data = await api.getData(
    api.getOrgProjectSubDoc(projectId, PROJECT_SUBCOLLECTIONS.beneficiaries, "main")
  );
  return data as ProjectBeneficiaries | null;
}

export type {
  ProjectVideo,
  ProjectContract,
  ProjectInvoice,
  ProjectReport,
  ProjectUpdate,
  ProjectTimelineEntry,
  ReportType,
};
