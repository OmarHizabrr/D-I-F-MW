import type { UserMeta } from "@/services/firestoreApi";
import { createOrgProject, updateOrgProject } from "@/services/projectManagementService";
import { createGroup } from "@/services/groupService";
import { addGroupMember } from "@/services/memberService";
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

  return { projectId, groupId };
}
