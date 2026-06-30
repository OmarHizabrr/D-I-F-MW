"use client";

import { useEffect, useState } from "react";
import { listPublishedOrgProjects, getProjectLocation } from "@/services/projectManagementService";
import { isValidLatLng } from "@/lib/map/constants";

export type OrgMapMarker = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  href: string;
  country?: string;
};

export function useOrgMapMarkers() {
  const [markers, setMarkers] = useState<OrgMapMarker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const projects = await listPublishedOrgProjects();
        const results = await Promise.all(
          projects.map(async (p) => {
            const loc = await getProjectLocation(p.id);
            if (!loc || !isValidLatLng(loc.latitude, loc.longitude)) return null;
            return {
              id: `org-${p.id}`,
              lat: loc.latitude,
              lng: loc.longitude,
              label: p.projectName,
              href: `/projects/${p.id}`,
              country: p.country,
            } satisfies OrgMapMarker;
          })
        );
        if (!cancelled) setMarkers(results.filter(Boolean) as OrgMapMarker[]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { markers, loading };
}
