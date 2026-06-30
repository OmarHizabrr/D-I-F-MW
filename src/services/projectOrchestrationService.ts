import type { UserMeta } from "@/services/firestoreApi";
import {
  createOrgProject,
  listOrgProjects,
  updateOrgProject,
} from "@/services/projectManagementService";
import { createGroup, getGroupByProjectId } from "@/services/groupService";
import { addGroupMember, getGroupMember } from "@/services/memberService";
import { getDonor } from "@/services/donorService";
import { sendNotification } from "@/services/notificationService";
import { projectBelongsToDonor } from "@/lib/donor-project-utils";
import type { OrgProject } from "@/types/project-management";

export type CreateProjectInput = Omit<
  OrgProject,
  "id" | "groupId" | "createdAt" | "updatedAt" | "createdBy"
>;

/** إنشاء مشروع + مجموعة + إضافة المالك كعضو */
export async function createProjectWithGroup(
  input: CreateProjectInput,
  ownerUserId: string,
  user: UserMeta
): Promise<{ projectId: string; groupId: string }> {
  const projectId = await createOrgProject(
    {
      ...input,
      groupId: "",
      createdBy: ownerUserId,
    },
    user
  );

  const groupId = await createGroup(
    {
      projectId,
      groupName: `فريق ${input.projectName}`,
      groupType: "project_team",
      ownerId: ownerUserId,
      createdBy: ownerUserId,
      status: "active",
    },
    user
  );

  await updateOrgProject(projectId, { groupId }, user);

  await addGroupMember(
    {
      groupId,
      userId: ownerUserId,
      role: "Owner",
      title: "مالك المشروع",
      addedBy: ownerUserId,
      isOwner: true,
      project: {
        id: projectId,
        projectName: input.projectName,
        projectNumber: input.projectNumber,
      },
      group: { groupName: `فريق ${input.projectName}` },
    },
    user
  );

  if (input.donorId) {
    await assignDonorToProject(
      projectId,
      groupId,
      input.donorId,
      {
        projectName: input.projectName,
        projectNumber: input.projectNumber,
        groupName: `فريق ${input.projectName}`,
      },
      user
    );
  }

  for (const donorId of input.additionalDonorIds ?? []) {
    await assignDonorToProject(
      projectId,
      groupId,
      donorId,
      {
        projectName: input.projectName,
        projectNumber: input.projectNumber,
        groupName: `فريق ${input.projectName}`,
      },
      user
    );
  }

  return { projectId, groupId };
}

/** ربط المتبرع بالمشروع عبر MyGroups إذا كان له حساب مستخدم */
export async function assignDonorToProject(
  projectId: string,
  groupId: string,
  donorId: string,
  meta: { projectName: string; projectNumber: string; groupName: string },
  actor: UserMeta
): Promise<void> {
  const donor = await getDonor(donorId);
  if (!donor?.linkedUserId) return;

  const existing = await getGroupMember(groupId, donor.linkedUserId);
  if (existing) return;

  await addGroupMember(
    {
      groupId,
      userId: donor.linkedUserId,
      role: "Donor",
      title: "متبرع",
      addedBy: actor.uid ?? "",
      project: { id: projectId, projectName: meta.projectName, projectNumber: meta.projectNumber },
      group: { groupName: meta.groupName },
    },
    actor
  );

  await sendNotification({
    userId: donor.linkedUserId,
    title: "مشروع جديد للمتابعة",
    body: `يمكنك الآن متابعة مشروع «${meta.projectName}»`,
    type: "project_started",
    projectId,
    groupId,
  });
}

/** مزامنة المتبرع المرتبط بـ Google مع كل مشاريعه في MyGroups */
export async function syncDonorToAllProjects(
  donorId: string,
  actor: UserMeta
): Promise<void> {
  const donor = await getDonor(donorId);
  if (!donor?.linkedUserId) return;

  const projects = await listOrgProjects();
  const groupNames = new Map<string, string>();

  for (const project of projects) {
    if (!projectBelongsToDonor(project, donorId) || !project.groupId) continue;

    let groupName = groupNames.get(project.groupId);
    if (!groupName) {
      const group = await getGroupByProjectId(project.id);
      groupName = group?.groupName ?? `فريق ${project.projectName}`;
      groupNames.set(project.groupId, groupName);
    }

    await assignDonorToProject(
      project.id,
      project.groupId,
      donorId,
      {
        projectName: project.projectName,
        projectNumber: project.projectNumber,
        groupName,
      },
      actor
    );
  }
}

/** ربط كل متبرعي المشروع (رئيسي + إضافيون) بفريق العمل */
export async function syncProjectDonorsToGroup(
  project: Pick<
    OrgProject,
    "id" | "groupId" | "projectName" | "projectNumber" | "donorId" | "additionalDonorIds"
  >,
  groupName: string,
  actor: UserMeta
): Promise<void> {
  if (!project.groupId) return;

  const donorIds = [
    ...(project.donorId ? [project.donorId] : []),
    ...(project.additionalDonorIds ?? []),
  ];

  for (const donorId of donorIds) {
    await assignDonorToProject(
      project.id,
      project.groupId,
      donorId,
      {
        projectName: project.projectName,
        projectNumber: project.projectNumber,
        groupName,
      },
      actor
    );
  }
}
