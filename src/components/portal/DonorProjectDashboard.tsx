"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  getOrgProject,
  listProjectPhotos,
  listProjectSubItems,
  getProjectLocation,
  getProjectBeneficiaries,
} from "@/services/projectManagementService";
import { getProjectFinancial } from "@/services/financialService";
import { getDonorRating, saveDonorRating } from "@/services/ratingService";
import { MapView } from "@/components/map/MapView";
import { isValidLatLng, googleMapsUrl, formatCoordinates } from "@/lib/map/constants";
import { DonorSupporterCard } from "@/components/site/DonorSupporterCard";
import { ProjectPhotoGallery } from "@/components/site/ProjectPhotoGallery";
import { ProjectVideosGallery } from "@/components/site/ProjectVideosGallery";
import { ProjectTimelineOverview } from "@/components/site/ProjectTimelineOverview";
import { useLocale } from "@/context/LocaleContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { Spinner } from "@/components/ui/Spinner";
import {
  PROJECT_SUBCOLLECTIONS,
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
  type PhotoPhase,
} from "@/types/project-management";

type DonorProjectDashboardProps = {
  projectId: string;
  donor: Donor;
  onBack: () => void;
  onLogout?: () => void;
};

export function DonorProjectDashboard({
  projectId,
  donor,
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
  const [location, setLocation] = useState<ProjectLocation | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<ProjectBeneficiaries | null>(null);
  const [financial, setFinancial] = useState<ProjectFinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState({ quality: 5, execution: 5, communication: 5 });
  const [suggestions, setSuggestions] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    async function load() {
      const p = await getOrgProject(projectId);
      setProject(p);
      const photoData = await Promise.all(
        PHOTO_PHASES.map(async (phase) => [phase, await listProjectPhotos(projectId, phase)] as const)
      );
      setPhotos(Object.fromEntries(photoData) as Record<PhotoPhase, ProjectPhoto[]>);
      const [upd, vids, tl, reps, loc, ben, fin, existingRating] = await Promise.all([
        listProjectSubItems<ProjectUpdate>(projectId, PROJECT_SUBCOLLECTIONS.updates),
        listProjectSubItems<ProjectVideo>(projectId, PROJECT_SUBCOLLECTIONS.videos),
        listProjectSubItems<ProjectTimelineEntry>(projectId, PROJECT_SUBCOLLECTIONS.timeline),
        listProjectSubItems<ProjectReport>(projectId, PROJECT_SUBCOLLECTIONS.reports),
        getProjectLocation(projectId),
        getProjectBeneficiaries(projectId),
        getProjectFinancial(projectId),
        getDonorRating(projectId, donor.id),
      ]);
      setUpdates(upd.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")));
      setVideos(vids);
      setTimeline(tl);
      setReports(reps.filter((r) => r.file));
      setLocation(loc);
      setBeneficiaries(ben);
      setFinancial(fin);
      setRated(!!existingRating);
      setLoading(false);
    }
    load();
  }, [projectId, donor.id]);

  async function handleSubmitRating() {
    setSubmittingRating(true);
    try {
      await saveDonorRating({
        projectId,
        donorId: donor.id,
        qualityRating: rating.quality,
        executionRating: rating.execution,
        communicationRating: rating.communication,
        suggestions,
      });
      setRated(true);
    } finally {
      setSubmittingRating(false);
    }
  }

  if (loading || !project) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
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
          {onLogout && (
            <Button variant="outline" size="sm" onClick={onLogout}>
              تسجيل الخروج
            </Button>
          )}
        </div>

        <h1 className="mb-2 text-2xl font-bold">{project.projectName}</h1>
        <p className="mb-6 text-muted-foreground">
          {project.projectNumber} · {project.projectType}
        </p>

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

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">سجل التحديثات</h2>
          <div className="space-y-3">
            {updates.map((u) => (
              <Card key={u.id} padding="md">
                <p className="font-medium">{u.title}</p>
                <p className="text-sm text-muted-foreground">{u.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">{u.createdAt?.slice(0, 10)}</p>
              </Card>
            ))}
            {updates.length === 0 && (
              <p className="text-sm text-muted-foreground">لا توجد تحديثات بعد</p>
            )}
          </div>
        </section>

        <div className="mb-8 space-y-8">
          <ProjectPhotoGallery photos={photos} title={t.projectDetail.photoGallery} />
          <ProjectVideosGallery videos={videos} title={t.projectDetail.videosTitle} />
        </div>

        {reports.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">{t.transparency.reportsTitle}</h2>
            <div className="space-y-3">
              {reports.map((report) => (
                <Card key={report.id} padding="md">
                  <p className="font-semibold">{report.title}</p>
                  {report.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{report.description}</p>
                  )}
                  <a
                    href={report.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-green hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t.transparency.downloadReport}
                  </a>
                </Card>
              ))}
            </div>
          </section>
        )}

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
