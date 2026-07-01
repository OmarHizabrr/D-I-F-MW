"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  listProjectPhotos,
  listProjectSubItems,
  getProjectLocation,
  getProjectBeneficiaries,
  getOrgProject,
} from "@/services/projectManagementService";
import { getProjectFinancial } from "@/services/financialService";
import { getPublicDonor } from "@/services/donorService";
import { useSiteContent } from "@/context/SiteContentContext";
import { useDonation } from "@/context/DonationContext";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { DonorSupporterCard } from "@/components/site/DonorSupporterCard";
import { ProjectPhotoGallery } from "@/components/site/ProjectPhotoGallery";
import { ProjectVideosGallery } from "@/components/site/ProjectVideosGallery";
import { ProjectTimelineOverview } from "@/components/site/ProjectTimelineOverview";
import { ProjectUpdatesFeed } from "@/components/site/ProjectUpdatesFeed";
import { ProjectAttachmentsSection } from "@/components/site/ProjectAttachmentsSection";
import { buildProjectAttachments } from "@/lib/project-attachments";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { Spinner } from "@/components/ui/Spinner";
import { PROJECT_STATUS_LABELS as ORG_STATUS_LABELS } from "@/types/project-management";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_VARIANT } from "@/lib/project-status";
import { mapOrgStatusToPublicStatus } from "@/lib/public-projects";
import { formatCoordinates, googleMapsUrl, isValidLatLng } from "@/lib/map/constants";
import { sectionIcons } from "@/lib/icons";
import {
  PROJECT_SUBCOLLECTIONS,
  PHOTO_PHASES,
  type OrgProject,
  type ProjectUpdate,
  type ProjectPhoto,
  type ProjectVideo,
  type ProjectTimelineEntry,
  type ProjectReport,
  type ProjectContract,
  type ProjectInvoice,
  type PhotoPhase,
  type Donor,
} from "@/types/project-management";
import type { LocaleCode } from "@/types/cms";
import { useLocale } from "@/context/LocaleContext";
import { ExternalLink, MapPin } from "lucide-react";

const MapView = dynamic(
  () => import("@/components/map/MapView").then((m) => m.MapView),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-2xl bg-border-subtle" /> }
);

type PublicOrgProjectDetailProps = {
  projectId: string;
};

export function PublicOrgProjectDetail({ projectId }: PublicOrgProjectDetailProps) {
  const { sectionTitles, donation, text } = useSiteContent();
  const { locale, t } = useLocale();
  const { openDonation } = useDonation();
  const { portalEnabled } = useSystemSettings();

  const [project, setProject] = useState<OrgProject | null>(null);
  const [donor, setDonor] = useState<Donor | null>(null);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [photos, setPhotos] = useState<Record<PhotoPhase, ProjectPhoto[]>>({
    Before: [],
    During: [],
    After: [],
  });
  const [videos, setVideos] = useState<ProjectVideo[]>([]);
  const [timeline, setTimeline] = useState<ProjectTimelineEntry[]>([]);
  const [reports, setReports] = useState<ProjectReport[]>([]);
  const [contracts, setContracts] = useState<ProjectContract[]>([]);
  const [invoices, setInvoices] = useState<ProjectInvoice[]>([]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [beneficiaryCount, setBeneficiaryCount] = useState(0);
  const [financial, setFinancial] = useState<{
    donationAmount: number;
    expenses: number;
    remaining: number;
    spendRatio: number;
    currency: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const p = await getOrgProject(projectId);
      if (!p) {
        setLoading(false);
        return;
      }
      setProject(p);
      if (p.showDonorPublic && p.donorId) {
        const d = await getPublicDonor(p.donorId);
        setDonor(d);
      }
      const photoData = await Promise.all(
        PHOTO_PHASES.map(async (phase) => [phase, await listProjectPhotos(projectId, phase)] as const)
      );
      setPhotos(Object.fromEntries(photoData) as Record<PhotoPhase, ProjectPhoto[]>);
      const [upd, vids, tl, reps, conts, invs, loc, ben, fin] = await Promise.all([
        listProjectSubItems<ProjectUpdate>(projectId, PROJECT_SUBCOLLECTIONS.updates),
        listProjectSubItems<ProjectVideo>(projectId, PROJECT_SUBCOLLECTIONS.videos),
        listProjectSubItems<ProjectTimelineEntry>(projectId, PROJECT_SUBCOLLECTIONS.timeline),
        listProjectSubItems<ProjectReport>(projectId, PROJECT_SUBCOLLECTIONS.reports),
        listProjectSubItems<ProjectContract>(projectId, PROJECT_SUBCOLLECTIONS.contracts),
        listProjectSubItems<ProjectInvoice>(projectId, PROJECT_SUBCOLLECTIONS.invoices),
        getProjectLocation(projectId),
        getProjectBeneficiaries(projectId),
        getProjectFinancial(projectId),
      ]);
      setUpdates(upd.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")));
      setVideos(vids);
      setTimeline(tl);
      setReports(reps.filter((r) => r.file));
      setContracts(conts.filter((c) => c.file));
      setInvoices(invs.filter((i) => i.file));
      setLocation(loc);
      setBeneficiaryCount(ben?.count ?? 0);
      if (fin.donationAmount > 0) {
        setFinancial({
          donationAmount: fin.donationAmount,
          expenses: fin.expenses,
          remaining: fin.remaining,
          spendRatio: fin.spendRatio,
          currency: fin.currency,
        });
      }
      setLoading(false);
    }
    load();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!project) return null;

  const publicStatus = mapOrgStatusToPublicStatus(project.status);
  const statusLabel =
    PROJECT_STATUS_LABELS[publicStatus][locale as LocaleCode] ?? publicStatus;

  const attachments = buildProjectAttachments(reports, contracts, invoices);

  const showTimeline =
    Boolean(project.startDate || project.expectedEndDate || timeline.length > 0);
  const showCountry =
    Boolean(project.country) && (!project.showDonorPublic || !donor);

  return (
    <article className="section-padding bg-background">
      <div className="container-dif grid gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="space-y-8 lg:col-span-2">
          {project.coverImage ? (
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border-subtle">
              <Image
                src={project.coverImage}
                alt={project.projectName}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          ) : (
            <MediaPlaceholder icon={sectionIcons.project} className="aspect-[16/10] rounded-3xl" />
          )}

          {project.description && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
                {project.description}
              </p>
            </div>
          )}

          {showTimeline && (
            <ProjectTimelineOverview
              project={project}
              timeline={timeline}
              title={t.projectDetail.timelineTitle}
              labels={{
                startDate: t.projectDetail.startDate,
                expectedDuration: t.projectDetail.expectedDuration,
                currentPhase: t.projectDetail.currentPhase,
                expectedDelivery: t.projectDetail.expectedDelivery,
              }}
            />
          )}

          <ProjectUpdatesFeed
            updates={updates}
            title="تحديثات المشروع"
            emptyMessage="لا توجد تحديثات بعد — سيتم نشر التحديثات هنا فور إضافتها"
          />

          <ProjectPhotoGallery photos={photos} title={t.projectDetail.photoGallery} />

          <ProjectVideosGallery videos={videos} title={t.projectDetail.videosTitle} />

          <ProjectAttachmentsSection
            attachments={attachments}
            title="الملفات المرفقة"
            downloadLabel={t.transparency.downloadReport}
          />
        </div>

        <aside className="space-y-4">
          {donor && project.showDonorPublic && (
            <DonorSupporterCard
              donor={donor}
              country={donor.country || project.country}
              city={project.city}
              supportedByLabel={t.common.supportedBy}
              countryLabel={t.projectDetail.country}
            />
          )}

          {showCountry && (
            <Card padding="md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t.projectDetail.country}</p>
                  <p className="font-semibold">
                    {project.country}
                    {project.city ? ` · ${project.city}` : ""}
                  </p>
                </div>
              </div>
            </Card>
          )}

          <Card padding="md">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant={PROJECT_STATUS_VARIANT[publicStatus]}>{statusLabel}</Badge>
              {project.projectNumber && (
                <Badge variant="outline">{project.projectNumber}</Badge>
              )}
              <Badge variant="outline">{project.projectType}</Badge>
            </div>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">{text(sectionTitles.projectsProgress)}</dt>
                <dd className="mt-1 font-bold text-brand-green">{project.progress}%</dd>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-border-subtle">
                  <div
                    className="h-full rounded-full bg-brand-green"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
              <div>
                <dt className="text-muted-foreground">{ORG_STATUS_LABELS[project.status]}</dt>
                <dd className="mt-1 font-medium">
                  {project.startDate}
                  {project.expectedEndDate ? ` → ${project.expectedEndDate}` : ""}
                </dd>
              </div>
              {beneficiaryCount > 0 && (
                <div>
                  <dt className="text-muted-foreground">{t.stats.beneficiaries}</dt>
                  <dd className="mt-1 font-bold text-brand-green">{beneficiaryCount}</dd>
                </div>
              )}
            </dl>
            {donation.enabled && (
              <Button
                className="mt-4 w-full"
                onClick={() =>
                  openDonation({
                    projectId: project.id,
                    projectName: project.projectName,
                  })
                }
              >
                {text(donation.navButtonLabel)}
              </Button>
            )}
            {portalEnabled && (
              <Link
                href={`/portal?project=${encodeURIComponent(project.projectNumber)}`}
                className="mt-2 block text-center text-sm text-brand-green hover:underline"
              >
                {t.topBar.donorPortal}
              </Link>
            )}
          </Card>

          {financial && (
            <Card padding="md">
              <h3 className="mb-3 font-semibold">{t.nav.transparency}</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">التبرع</dt>
                  <dd className="font-medium">
                    {financial.donationAmount.toLocaleString()} {financial.currency}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">المصروفات</dt>
                  <dd>{financial.expenses.toLocaleString()} {financial.currency}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">المتبقي</dt>
                  <dd className="font-bold text-brand-green">
                    {financial.remaining.toLocaleString()} {financial.currency}
                  </dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-muted-foreground">
                نسبة الصرف: {financial.spendRatio}%
              </p>
            </Card>
          )}

          {location && isValidLatLng(location.latitude, location.longitude) && (
            <Card padding="md">
              <h3 className="mb-3 font-semibold">{t.common.projectLocation}</h3>
              <MapView
                markers={[
                  {
                    id: projectId,
                    lat: location.latitude,
                    lng: location.longitude,
                    label: project.projectName,
                  },
                ]}
                center={[location.latitude, location.longitude]}
                zoom={10}
                height="180px"
              />
              {location.address && (
                <p className="mt-2 text-xs text-muted-foreground">{location.address}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground" dir="ltr">
                {formatCoordinates(location.latitude, location.longitude)}
              </p>
              <Link
                href={googleMapsUrl(location.latitude, location.longitude)}
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
            ← {t.common.backToAllProjects}
          </Link>
        </aside>
      </div>
    </article>
  );
}
