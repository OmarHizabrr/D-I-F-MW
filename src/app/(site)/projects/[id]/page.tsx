"use client";

import { useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSiteContent } from "@/context/SiteContentContext";
import { useLocale } from "@/context/LocaleContext";
import { useDonation } from "@/context/DonationContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { YouTubePlayer } from "@/components/site/YouTubePlayer";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_VARIANT } from "@/lib/project-status";
import { formatCoordinates, googleMapsUrl, isValidLatLng } from "@/lib/map/constants";
import { sectionIcons } from "@/lib/icons";
import type { LocaleCode } from "@/types/cms";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

const MapView = dynamic(
  () => import("@/components/map/MapView").then((m) => m.MapView),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-2xl bg-border-subtle" /> }
);

export default function ProjectDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const { projects, mapPoints, donation, text, loading } = useSiteContent();
  const { locale } = useLocale();
  const { openDonation } = useDonation();

  const project = useMemo(
    () => projects.find((p) => p.id === id && p.enabled),
    [projects, id]
  );

  const mapPoint = useMemo(
    () => mapPoints.find((m) => m.enabled && m.projectId === id && isValidLatLng(m.lat, m.lng)),
    [mapPoints, id]
  );

  if (loading) {
    return (
      <div className="section-padding">
        <SitePageSkeleton />
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  const statusLabel =
    PROJECT_STATUS_LABELS[project.status][locale as LocaleCode] ?? project.status;
  const description = text(project.description);

  return (
    <>
      <SitePageHeader
        title={text(project.name)}
        subtitle={`${text(project.country)}${project.city ? ` · ${project.city}` : ""}`}
        backHref="/projects"
        backLabel="جميع المشاريع"
      />

      <article className="section-padding bg-background">
        <div className="container-dif grid gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-6 lg:col-span-2">
            {project.imageUrl ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border-subtle">
                <Image
                  src={project.imageUrl}
                  alt={text(project.name)}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            ) : (
              <MediaPlaceholder icon={sectionIcons.project} className="aspect-[16/10] rounded-3xl" />
            )}

            {project.youtubeUrl && (
              <YouTubePlayer url={project.youtubeUrl} title={text(project.name)} />
            )}

            {description ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {description}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                تفاصيل المشروع قيد التحديث من لوحة التحكم.
              </p>
            )}
          </div>

          <aside className="space-y-4">
            <Card padding="md">
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge variant={PROJECT_STATUS_VARIANT[project.status]}>{statusLabel}</Badge>
                {project.code && <Badge variant="outline">{project.code}</Badge>}
              </div>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">نسبة الإنجاز</dt>
                  <dd className="mt-1 font-bold text-brand-green">{project.progress}%</dd>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-border-subtle">
                    <div
                      className="h-full rounded-full bg-brand-green"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div>
                  <dt className="text-muted-foreground">آخر تحديث</dt>
                  <dd className="mt-1 font-medium">{project.lastUpdate}</dd>
                </div>
                {project.showDonor && project.donorName && (
                  <div>
                    <dt className="text-muted-foreground">الجهة الداعمة</dt>
                    <dd className="mt-1 font-medium">{project.donorName}</dd>
                  </div>
                )}
              </dl>
              <Button
                className="mt-4 w-full"
                onClick={() =>
                  openDonation({ projectId: project.id, projectName: text(project.name) })
                }
              >
                {text(donation.navButtonLabel)}
              </Button>
            </Card>

            {mapPoint && (
              <Card padding="md">
                <h3 className="mb-3 font-semibold">موقع المشروع</h3>
                <MapView
                  markers={[
                    {
                      id: mapPoint.id,
                      lat: mapPoint.lat,
                      lng: mapPoint.lng,
                      label: text(mapPoint.name),
                    },
                  ]}
                  center={[mapPoint.lat, mapPoint.lng]}
                  zoom={10}
                  height="180px"
                />
                <p className="mt-2 text-xs text-muted-foreground" dir="ltr">
                  {formatCoordinates(mapPoint.lat, mapPoint.lng)}
                </p>
                <Link
                  href={googleMapsUrl(mapPoint.lat, mapPoint.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-green hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Google Maps
                </Link>
              </Card>
            )}

            <Link
              href="/projects"
              className="block rounded-2xl border border-border-subtle bg-surface px-4 py-3 text-center text-sm font-semibold text-brand-green hover:bg-brand-green/5"
            >
              ← العودة لجميع المشاريع
            </Link>
          </aside>
        </div>
      </article>
    </>
  );
}
