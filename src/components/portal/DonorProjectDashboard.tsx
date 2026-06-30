"use client";

import { useEffect, useState } from "react";
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
import { isValidLatLng } from "@/lib/map/constants";
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
  type PhotoPhase,
} from "@/types/project-management";

type DonorProjectDashboardProps = {
  projectId: string;
  donor: Donor;
  onBack: () => void;
};

export function DonorProjectDashboard({ projectId, donor, onBack }: DonorProjectDashboardProps) {
  const [project, setProject] = useState<OrgProject | null>(null);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [photos, setPhotos] = useState<Record<PhotoPhase, ProjectPhoto[]>>({
    Before: [],
    During: [],
    After: [],
  });
  const [videos, setVideos] = useState<ProjectVideo[]>([]);
  const [timeline, setTimeline] = useState<ProjectTimelineEntry[]>([]);
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
      const [upd, vids, tl, loc, ben, fin, existingRating] = await Promise.all([
        listProjectSubItems<ProjectUpdate>(projectId, PROJECT_SUBCOLLECTIONS.updates),
        listProjectSubItems<ProjectVideo>(projectId, PROJECT_SUBCOLLECTIONS.videos),
        listProjectSubItems<ProjectTimelineEntry>(projectId, PROJECT_SUBCOLLECTIONS.timeline),
        getProjectLocation(projectId),
        getProjectBeneficiaries(projectId),
        getProjectFinancial(projectId),
        getDonorRating(projectId, donor.id),
      ]);
      setUpdates(upd.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")));
      setVideos(vids);
      setTimeline(tl);
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

  const phaseLabels: Record<PhotoPhase, string> = {
    Before: "قبل التنفيذ",
    During: "أثناء التنفيذ",
    After: "بعد الإنجاز",
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <button type="button" onClick={onBack} className="mb-4 text-sm text-brand-green">
          ← العودة للمشاريع
        </button>

        <h1 className="mb-2 text-2xl font-bold">{project.projectName}</h1>
        <p className="mb-6 text-muted-foreground">
          {project.projectNumber} · {project.projectType} · {project.country} · {project.city}
        </p>

        <Card padding="lg" className="mb-6">
          <p className="mb-2 text-sm font-medium">نسبة الإنجاز</p>
          <div className="h-3 overflow-hidden rounded-full bg-border-subtle">
            <div
              className="h-full bg-brand-green transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm">
            {project.progress}% · {PROJECT_STATUS_LABELS[project.status]}
          </p>
          <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <p>البداية: {project.startDate}</p>
            <p>الانتهاء المتوقع: {project.expectedEndDate || "—"}</p>
            {project.actualEndDate && <p>التسليم الفعلي: {project.actualEndDate}</p>}
          </div>
        </Card>

        {financial && financial.donationAmount > 0 && (
          <Card padding="lg" className="mb-6">
            <h2 className="mb-4 text-lg font-semibold">التقرير المالي</h2>
            <div className="grid gap-3 sm:grid-cols-2">
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

        {timeline.length > 0 && (
          <>
            <h2 className="mb-3 text-lg font-semibold">الجدول الزمني</h2>
            <div className="mb-8 space-y-3">
              {timeline.map((t) => (
                <Card key={t.id} padding="md">
                  <p className="font-semibold">{t.phase}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.startDate} → {t.endDate || "—"} · {t.progress}%
                  </p>
                </Card>
              ))}
            </div>
          </>
        )}

        <h2 className="mb-3 text-lg font-semibold">سجل التحديثات</h2>
        <div className="mb-8 space-y-3">
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

        {PHOTO_PHASES.map((phase) => {
          const phasePhotos = photos[phase];
          if (phasePhotos.length === 0) return null;
          return (
            <div key={phase} className="mb-8">
              <h2 className="mb-3 text-lg font-semibold">{phaseLabels[phase]}</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {phasePhotos.map((p) => (
                  <Card key={p.id} padding="sm">
                    {p.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-32 w-full rounded-lg object-cover"
                      />
                    )}
                    <p className="mt-2 text-sm">{p.title}</p>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        {videos.length > 0 && (
          <>
            <h2 className="mb-3 text-lg font-semibold">الفيديوهات</h2>
            <div className="mb-8 space-y-2">
              {videos.map((v) => (
                <Card key={v.id} padding="md">
                  <p className="font-medium">{v.title}</p>
                  <a
                    href={v.video}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-brand-green"
                  >
                    مشاهدة الفيديو
                  </a>
                </Card>
              ))}
            </div>
          </>
        )}

        {location && isValidLatLng(location.latitude, location.longitude) && (
          <>
            <h2 className="mb-3 text-lg font-semibold">الموقع الجغرافي</h2>
            <Card padding="md" className="mb-4">
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
              <a
                href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-brand-green"
              >
                فتح في Google Maps
              </a>
            </Card>
          </>
        )}

        {beneficiaries && beneficiaries.count > 0 && (
          <Card padding="lg" className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">المستفيدون</h2>
            <p className="text-2xl font-bold text-brand-green">{beneficiaries.count}</p>
            <p className="text-sm text-muted-foreground">مستفيد</p>
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
