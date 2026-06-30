import { getDocs, query, where } from "firebase/firestore";
import FirestoreApi, { type UserMeta } from "@/services/firestoreApi";
import type { ProjectGroup } from "@/types/project-management";

const api = FirestoreApi.Api;

export async function listGroups(): Promise<ProjectGroup[]> {
  const snap = await getDocs(api.getGroupsCollection());
  return snap.docs
    .map((d) => api.docToData<ProjectGroup>(d))
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

export async function getGroup(groupId: string): Promise<ProjectGroup | null> {
  const data = await api.getData(api.getGroupDoc(groupId));
  return data ? ({ id: groupId, ...data } as ProjectGroup) : null;
}

export async function getGroupByProjectId(projectId: string): Promise<ProjectGroup | null> {
  const q = query(api.getGroupsCollection(), where("projectId", "==", projectId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return api.docToData<ProjectGroup>(snap.docs[0]);
}

export async function createGroup(
  data: Omit<ProjectGroup, "id" | "createdAt" | "updatedAt" | "membersCount">,
  user: UserMeta
): Promise<string> {
  const id = api.getNewId("group");
  await api.setData({
    docRef: api.getGroupDoc(id),
    data: {
      ...data,
      id,
      membersCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    merge: false,
    userData: user,
  });
  return id;
}

export async function updateGroup(
  groupId: string,
  data: Partial<ProjectGroup>,
  user: UserMeta
): Promise<void> {
  const { id: _id, ...rest } = data;
  await api.updateData({
    docRef: api.getGroupDoc(groupId),
    data: { ...rest, updatedAt: new Date().toISOString() },
    userData: user,
  });
}

export async function incrementMembersCount(groupId: string, delta: number): Promise<void> {
  const group = await getGroup(groupId);
  if (!group) return;
  const newCount = Math.max(0, (group.membersCount ?? 0) + delta);
  await api.updateData({
    docRef: api.getGroupDoc(groupId),
    data: { membersCount: newCount },
    userData: {},
  });
}

export async function deleteGroup(groupId: string): Promise<void> {
  await api.deleteData(api.getGroupDoc(groupId));
}
