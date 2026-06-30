import type { UserMeta } from "@/services/firestoreApi";
import { createOrgProject, updateOrgProject } from "@/services/projectManagementService";
import { createGroup } from "@/services/groupService";
import { addGroupMember, getGroupMember } from "@/services/memberService";
import { getDonor } from "@/services/donorService";
import { sendNotification } from "@/services/notificationService";
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
