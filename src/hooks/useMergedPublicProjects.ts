"use client";

import { useCallback, useEffect, useState } from "react";
import { useSiteContent } from "@/context/SiteContentContext";
import { listPublishedOrgProjects } from "@/services/projectManagementService";
import { getDonor } from "@/services/donorService";
import { orgProjectToPublic, type PublicProject } from "@/lib/public-projects";
import type { ProjectItem } from "@/types/cms";
import type { LocalizedString } from "@/types/cms";

function cmsToPublic(
  project: ProjectItem,
  text: (v: LocalizedString) => string
): PublicProject {
  return {
    id: project.id,
    source: "cms",
    name: text(project.name),
    country: text(project.country),
    city: project.city,
    progress: project.progress,
    status: project.status,
    imageUrl: project.imageUrl,
    code: project.code,
    donorName: project.donorName,
    showDonor: project.showDonor,
    programId: project.programId,
    order: project.order,
    featured: project.featured ?? false,
    description: project.description ? text(project.description) : undefined,
    youtubeUrl: project.youtubeUrl,
    lastUpdate: project.lastUpdate,
  };
}

export function useMergedPublicProjects() {
  const { projects: cmsProjects, text, loading: cmsLoading } = useSiteContent();
  const [orgPublic, setOrgPublic] = useState<PublicProject[]>([]);
  const [orgLoading, setOrgLoading] = useState(true);

  const loadOrg = useCallback(async () => {
    try {
      const orgProjects = await listPublishedOrgProjects();
      const mapped = await Promise.all(
        orgProjects.map(async (p) => {
          let donorName: string | undefined;
          if (p.showDonorPublic && p.donorId) {
            const donor = await getDonor(p.donorId);
            donorName = donor?.fullName;
          }
          return orgProjectToPublic(p, donorName);
        })
      );
      setOrgPublic(mapped);
    } finally {
      setOrgLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrg();
  }, [loadOrg]);

  const cmsPublic = cmsProjects
    .filter((p) => p.enabled)
    .map((p) => cmsToPublic(p, text));

  const allProjects = [...cmsPublic, ...orgPublic].sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name)
  );

  return {
    projects: allProjects,
    cmsProjects: cmsPublic,
    orgProjects: orgPublic,
    loading: cmsLoading || orgLoading,
    reloadOrg: loadOrg,
  };
}

export function usePublicProject(id: string) {
  const { projects, loading } = useMergedPublicProjects();
  const project = projects.find((p) => p.id === id);
  return { project, loading };
}
