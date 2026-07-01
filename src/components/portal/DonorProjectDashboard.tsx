"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, RefreshCw } from "lucide-react";
import { fetchDonorProjectDetail, submitDonorRating } from "@/lib/portal/portal-login-client";
import { MapView } from "@/components/map/MapView";
import { isValidLatLng, googleMapsUrl, formatCoordinates } from "@/lib/map/constants";
import { DonorSupporterCard } from "@/components/site/DonorSupporterCard";
import { ProjectPhotoGallery } from "@/components/site/ProjectPhotoGallery";
import { ProjectVideosGallery } from "@/components/site/ProjectVideosGallery";
import { ProjectTimelineOverview } from "@/components/site/ProjectTimelineOverview";
import { ProjectUpdatesFeed } from "@/components/site/ProjectUpdatesFeed";
import { ProjectAttachmentsSection } from "@/components/site/ProjectAttachmentsSection";
import { buildProjectAttachments } from "@/lib/project-attachments";
import {
  getProjectLastVisit,
  markProjectVisited,
  getLatestContentDate,
} from "@/lib/portal/project-visit";
import { useLocale } from "@/context/LocaleContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { Spinner } from "@/components/ui/Spinner";
import {
  PROJECT_STATUS_LABELS,
  PHOTO_PHASES,
  type OrgProject,
  type Donor,
  type ProjectUpdate,
  type ProjectPhoto,
  type ProjectVideo,
  type ProjectTimelineEntry,
  type ProjectLocation,
  type ProjectBeneficiaries,
  type ProjectFinancialSummary,
  type ProjectReport,
  type ProjectContract,
  type ProjectInvoice,
  type PhotoPhase,
} from "@/types/project-management";

type DonorProjectDashboardProps = {
  projectId: string;
  donor: Donor;
  sessionToken?: string;
  onBack: () => void;
  onLogout?: () => void;
};

export function DonorProjectDashboard({
  projectId,
  donor,
  sessionToken,
  onBack,
  onLogout,
}: DonorProjectDashboardProps) {
  const { t } = useLocale();
  const [project, setProject] = useState<OrgProject | null>(null);
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
  const [location, setLocation] = useState<ProjectLocation | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<ProjectBeneficiaries | null>(null);
  const [financial, setFinancial] = useState<ProjectFinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState({ quality: 5, execution: 5, communication: 5 });
  const [suggestions, setSuggestions] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [lastVisit, setLastVisit] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!sessionToken) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }
      const prevVisit = getProjectLastVisit(projectId);
      const data = await fetchDonorProjectDetail(sessionToken, projectId);
      if (cancelled) return;
      if (!data?.project) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }
      setProject(data.project);
      setUpdates(
        (data.updates ?? []).sort((a: ProjectUpdate, b: ProjectUpdate) =>
          (b.createdAt ?? "").localeCompare(a.createdAt ?? "")
        )
      );
      setPhotos(data.photos ?? { Before: [], During: [], After: [] });
      setVideos(data.videos ?? []);
      setTimeline(data.timeline ?? []);
      setReports((data.reports ?? []).filter((r: ProjectReport) => r.file));
      setContracts((data.contracts ?? []).filter((c: ProjectContract) => c.file));
      setInvoices((data.invoices ?? []).filter((i: ProjectInvoice) => i.file));
      setLocation(data.location);
      setBeneficiaries(data.beneficiaries);
      setFinancial(data.financial);
      setRated(!!data.existingRating);
      setLastVisit(prevVisit);
      markProjectVisited(projectId);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId, sessionToken]);

  async function refreshProjectData() {
    if (!sessionToken) return;
    setRefreshing(true);
    const prevVisit = getProjectLastVisit(projectId);
    const data = await fetchDonorProjectDetail(sessionToken, projectId);
    if (data?.project) {
      setProject(data.project);
      setUpdates(
        (data.updates ?? []).sort((a: ProjectUpdate, b: ProjectUpdate) =>
          (b.createdAt ?? "").localeCompare(a.createdAt ?? "")
        )
      );
      setPhotos(data.photos ?? { Before: [], During: [], After: [] });
      setVideos(data.videos ?? []);
      setTimeline(data.timeline ?? []);
      setReports((data.reports ?? []).filter((r: ProjectReport) => r.file));
      setContracts((data.contracts ?? []).filter((c: ProjectContract) => c.file));
      setInvoices((data.invoices ?? []).filter((i: ProjectInvoice) => i.file));
      setLocation(data.location);
      setBeneficiaries(data.beneficiaries);
      setFinancial(data.financial);
      setRated(!!data.existingRating);
      setLastVisit(prevVisit);
      markProjectVisited(projectId);
    }
    setRefreshing(false);
  }

  const attachments = useMemo(
    () => buildProjectAttachments(reports, contracts, invoices),
    [reports, contracts, invoices]
  );

  const isNew = (date?: string) => {
    if (!date || !lastVisit) return false;
    return date > lastVisit;
  };

  const newContentCount = useMemo(() => {
    let count = 0;
    for (const u of updates) if (isNew(u.createdAt)) count++;
    for (const v of videos) if (isNew(v.uploadedAt)) count++;
    for (const a of attachments) if (isNew(a.date)) count++;
    for (const phase of PHOTO_PHASES) {
      for (const p of photos[phase]) if (isNew(p.uploadedAt)) count++;
    }
    return count;
  }, [updates, videos, attachments, photos, projectId, lastVisit]);

  const latestActivity = getLatestContentDate([
    ...updates.map((u) => u.createdAt),
    ...videos.map((v) => v.uploadedAt),
    ...attachments.map((a) => a.date),
    project?.updatedAt,
  ]);

  async function handleSubmitRating() {
    if (!sessionToken) return;
    setSubmittingRating(true);
    try {
      const ok = await submitDonorRating(sessionToken, {
        projectId,
        qualityRating: rating.quality,
        executionRating: rating.execution,
        communicationRating: rating.communication,
        suggestions,
      });
      if (ok) setRated(true);
    } finally {
      setSubmittingRating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (accessDenied || !project) {
    return (
      <div className="section-padding">
        <Card padding="lg" className="mx-auto max-w-md text-center">
          <p className="text-muted-foreground">لا يمكنك الوصول إلى هذا المشروع</p>
          <Button className="mt-4" onClick={onBack}>
            العودة للمشاريع
          </Button>
        </Card>
      </div>
    );
  }

  const showTimeline =
    Boolean(project.startDate || project.expectedEndDate || timeline.length > 0);

  return (
    <div className="section-padding bg-background">
      <div className="container-dif mx-auto max-w-4xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <button type="button" onClick={onBack} className="text-sm font-semibold text-brand-green">
            ← العودة للمشاريع
          </button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" loading={refreshing} onClick={() => void refreshProjectData()}>
              <RefreshCw className="h-4 w-4" />
              تحديث
            </Button>
            {onLogout && (
              <Button variant="outline" size="sm" onClick={onLogout}>
                تسجيل الخروج
              </Button>
            )}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="mb-2 text-2xl font-bold">{project.projectName}</h1>
            <p className="text-muted-foreground">
              {project.projectNumber} · {project.projectType}
            </p>
            {latestActivity && (
              <p className="mt-2 text-xs text-muted-foreground">
                آخر نشاط: {latestActivity.slice(0, 10)}
              </p>
            )}
          </div>
          {newContentCount > 0 && (
            <Badge variant="default">{newContentCount} جديد منذ زيارتك الأخيرة</Badge>
          )}
        </div>

        {project.description && (
          <Card padding="md" className="mb-6">
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </Card>
        )}

        {project.coverImage && (
          <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-3xl border border-border-subtle">
            <Image
              src={project.coverImage}
              alt={project.projectName}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>
        )}

        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card padding="lg">
              <p className="mb-2 text-sm font-medium">{t.projectDetail.currentPhase}</p>
              <div className="h-3 overflow-hidden rounded-full bg-border-subtle">
                <div
                  className="h-full bg-brand-green transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm">
                {project.progress}% · {PROJECT_STATUS_LABELS[project.status]}
              </p>
            </Card>
          </div>
          <DonorSupporterCard
            donor={donor}
            country={donor.country || project.country}
            city={project.city}
            supportedByLabel={t.common.supportedBy}
            countryLabel={t.projectDetail.country}
          />
        </div>

        {financial && financial.donationAmount > 0 && (
          <Card padding="lg" className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">التقرير المالي</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">قيمة المشروع</p>
                <p className="font-semibold">
                  {financial.projectValue.toLocaleString()} {financial.currency}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">قيمة التبرع</p>
                <p className="font-semibold">
                  {financial.donationAmount.toLocaleString()} {financial.currency}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">المصروفات</p>
                <p className="font-semibold">
                  {financial.expenses.toLocaleString()} {financial.currency}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">المتبقي</p>
                <p className="font-semibold text-brand-green">
                  {financial.remaining.toLocaleString()} {financial.currency}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              نسبة الصرف: {financial.spendRatio}%
            </p>
          </Card>
        )}

        {showTimeline && (
          <div className="mb-8">
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
          </div>
        )}

        <div className="mb-8">
          <ProjectUpdatesFeed
            updates={updates}
            title="سجل التحديثات"
            emptyMessage="لا توجد تحديثات بعد — سيتم إشعارك عند إضافة محتوى جديد"
            isNew={isNew}
          />
        </div>

        <div className="mb-8 space-y-8">
          <ProjectPhotoGallery photos={photos} title={t.projectDetail.photoGallery} />
          <ProjectVideosGallery videos={videos} title={t.projectDetail.videosTitle} />
        </div>

        <div className="mb-8">
          <ProjectAttachmentsSection
            attachments={attachments}
            title="الملفات المرفقة"
            downloadLabel={t.transparency.downloadReport}
            isNew={isNew}
          />
        </div>

        {location && isValidLatLng(location.latitude, location.longitude) && (
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">{t.common.projectLocation}</h2>
            <Card padding="md">
              <MapView
                markers={[
                  {
                    id: "project",
                    lat: location.latitude,
                    lng: location.longitude,
                    label: project.projectName,
                  },
                ]}
                center={[location.latitude, location.longitude]}
                height="280px"
                scrollWheelZoom={false}
              />
              {location.address && (
                <p className="mt-3 text-sm text-muted-foreground">{location.address}</p>
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
          </section>
        )}

        {beneficiaries && beneficiaries.count > 0 && (
          <Card padding="lg" className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">{t.stats.beneficiaries}</h2>
            <p className="text-2xl font-bold text-brand-green">{beneficiaries.count}</p>
            {beneficiaries.categories.length > 0 && (
              <p className="mt-2 text-sm">الفئات: {beneficiaries.categories.join(" · ")}</p>
            )}
            {beneficiaries.stories && (
              <p className="mt-3 text-sm text-muted-foreground">{beneficiaries.stories}</p>
            )}
          </Card>
        )}

        {project.status === "completed" && (
          <Card padding="lg" className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">تقييم المشروع</h2>
            {rated ? (
              <p className="text-sm text-brand-green">شكراً — تم إرسال تقييمك بنجاح</p>
            ) : (
              <div className="space-y-4">
                <RangeSlider
                  label="جودة التنفيذ"
                  value={rating.quality}
                  onChange={(quality) => setRating({ ...rating, quality })}
                  min={1}
                  max={5}
                />
                <RangeSlider
                  label="التنفيذ في الوقت"
                  value={rating.execution}
                  onChange={(execution) => setRating({ ...rating, execution })}
                  min={1}
                  max={5}
                />
                <RangeSlider
                  label="التواصل"
                  value={rating.communication}
                  onChange={(communication) => setRating({ ...rating, communication })}
                  min={1}
                  max={5}
                />
                <Input
                  label="مقترحاتك"
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                />
                <Button loading={submittingRating} onClick={handleSubmitRating}>
                  إرسال التقييم
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
