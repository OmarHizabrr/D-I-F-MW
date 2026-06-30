import { getDocs } from "firebase/firestore";
import FirestoreApi, { type UserMeta } from "@/services/firestoreApi";
import { DEFAULT_PERMISSIONS } from "@/types/project-management";
import type {
  GroupMember,
  MyGroupEntry,
  ProjectGroup,
  ProjectRole,
  OrgProject,
} from "@/types/project-management";
import { incrementMembersCount } from "@/services/groupService";
import { sendNotification } from "@/services/notificationService";

const api = FirestoreApi.Api;

export async function listGroupMembers(groupId: string): Promise<GroupMember[]> {
  const snap = await getDocs(api.getGroupMembersCollection(groupId));
  return snap.docs.map((d) => api.docToData<GroupMember>(d));
}

export async function getGroupMember(
  groupId: string,
  userId: string
): Promise<GroupMember | null> {
  const data = await api.getData(api.getGroupMemberDoc(groupId, userId));
  return data ? ({ userId, groupId, ...data } as GroupMember) : null;
}

export async function listMyGroups(userId: string): Promise<MyGroupEntry[]> {
  const snap = await getDocs(api.getMyGroupsCollection(userId));
  return snap.docs.map((d) => api.docToData<MyGroupEntry>(d));
}

export type AddMemberInput = {
  groupId: string;
  userId: string;
  role: ProjectRole;
  title?: string;
  addedBy: string;
  isOwner?: boolean;
  project: Pick<OrgProject, "id" | "projectName" | "projectNumber">;
  group: Pick<ProjectGroup, "groupName">;
};

/** إضافة عضو: members + MyGroups + membersCount + إشعار */
export async function addGroupMember(
  input: AddMemberInput,
  actor: UserMeta
): Promise<void> {
  const permissions = DEFAULT_PERMISSIONS[input.role];
  const member: GroupMember = {
    userId: input.userId,
    groupId: input.groupId,
    role: input.role,
    title: input.title ?? "",
    permissions,
    status: "active",
    joinedAt: new Date().toISOString(),
    addedBy: input.addedBy,
    isOwner: input.isOwner ?? false,
  };

  await api.setData({
    docRef: api.getGroupMemberDoc(input.groupId, input.userId),
    data: member,
    merge: false,
    userData: actor,
  });

  const myGroupEntry: MyGroupEntry = {
    groupId: input.groupId,
    projectId: input.project.id,
    projectName: input.project.projectName,
    projectNumber: input.project.projectNumber,
    groupName: input.group.groupName,
    role: input.role,
    joinedAt: member.joinedAt,
    status: "active",
    lastActivity: new Date().toISOString(),
  };

  await api.setData({
    docRef: api.getMyGroupDoc(input.userId, input.groupId),
    data: myGroupEntry,
    merge: false,
    userData: actor,
  });

  await incrementMembersCount(input.groupId, 1);

  await sendNotification({
    userId: input.userId,
    title: "تمت إضافتك إلى مشروع",
    body: `تمت إضافتك إلى مشروع «${input.project.projectName}» بدور ${input.role}`,
    type: "member_added",
    projectId: input.project.id,
    groupId: input.groupId,
  });
}

/** حذف عضو: members + MyGroups + membersCount + إشعار */
export async function removeGroupMember(
  groupId: string,
  userId: string,
  projectName: string,
  actor: UserMeta
): Promise<void> {
  await api.deleteData(api.getGroupMemberDoc(groupId, userId));
  await api.deleteData(api.getMyGroupDoc(userId, groupId));
  await incrementMembersCount(groupId, -1);

  await sendNotification({
    userId,
    title: "تمت إزالتك من مشروع",
    body: `تمت إزالتك من مشروع «${projectName}»`,
    type: "member_removed",
    groupId,
  });
}

/** تحديث صلاحيات/دور العضو */
export async function updateMemberRole(
  groupId: string,
  userId: string,
  role: ProjectRole,
  actor: UserMeta
): Promise<void> {
  const permissions = DEFAULT_PERMISSIONS[role];
  await api.updateData({
    docRef: api.getGroupMemberDoc(groupId, userId),
    data: { role, permissions },
    userData: actor,
  });

  await api.updateData({
    docRef: api.getMyGroupDoc(userId, groupId),
    data: { role, lastActivity: new Date().toISOString() },
    userData: actor,
  });

  await sendNotification({
    userId,
    title: "تغيير الدور",
    body: `تم تغيير دورك إلى ${role}`,
    type: "role_changed",
    groupId,
  });
}
