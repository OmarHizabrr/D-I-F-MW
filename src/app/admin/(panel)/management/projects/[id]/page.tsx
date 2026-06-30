"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getOrgProject,
  updateOrgProject,
  listProjectPhotos,
  saveProjectPhoto,
  deleteProjectPhoto,
  listProjectSubItems,
  saveProjectSubItem,
  deleteProjectSubItem,
  getProjectLocation,
  saveProjectLocation,
  getProjectBeneficiaries,
  saveProjectBeneficiaries,
} from "@/services/projectManagementService";
import { getGroupByProjectId } from "@/services/groupService";
import {
  listGroupMembers,
  addGroupMember,
  removeGroupMember,
} from "@/services/memberService";
import { listDonors } from "@/services/donorService";
import { getProjectFinancial, saveProjectFinancial } from "@/services/financialService";
import { assignDonorToProject } from "@/services/projectOrchestrationService";
import FirestoreApi from "@/services/firestoreApi";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFormDialog } from "@/components/admin/AdminFormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { LocationPicker } from "@/components/admin/LocationPicker";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { Card } from "@/components/ui/Card";
import {
  PROJECT_SUBCOLLECTIONS,
  PHOTO_PHASES,
  PROJECT_STATUS_LABELS,
  PROJECT_ROLES,
  ROLE_LABELS,
  REPORT_TYPE_LABELS,
  type OrgProject,
  type ProjectGroup,
  type GroupMember,
  type ProjectPhoto,
  type ProjectUpdate,
  type ProjectTimelineEntry,
  type ProjectVideo,
  type ProjectReport,
  type ProjectContract,
  type ProjectInvoice,
  type PhotoPhase,
  type ReportType,
  type ProjectRole,
  type ProjectStatus,
  type Donor,
  type ProjectFinancialSummary,
} from "@/types/project-management";
import type { ProgramItem } from "@/types/cms";
import type { AppUser } from "@/types/user";

const api = FirestoreApi.Api;

const TABS = [
  { id: "overview", label: "نظرة عامة" },
  { id: "members", label: "الأعضاء" },
  { id: "photos", label: "الصور" },
  { id: "videos", label: "الفيديوهات" },
  { id: "updates", label: "التحديثات" },
  { id: "timeline", label: "الجدول الزمني" },
  { id: "location", label: "الموقع" },
  { id: "reports", label: "التقارير" },
  { id: "contracts", label: "العقود" },
  { id: "invoices", label: "الفواتير" },
  { id: "financial", label: "المالي" },
  { id: "beneficiaries", label: "المستفيدون" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const projectId = params.id as string;

  const [tab, setTab] = useState<TabId>("overview");
  const [project, setProject] = useState<OrgProject | null>(null);
  const [group, setGroup] = useState<ProjectGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [photos, setPhotos] = useState<Record<PhotoPhase, ProjectPhoto[]>>({
    Before: [],
    During: [],
    After: [],
  });
  const [videos, setVideos] = useState<ProjectVideo[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [timeline, setTimeline] = useState<ProjectTimelineEntry[]>([]);
  const [reports, setReports] = useState<ProjectReport[]>([]);
  const [contracts, setContracts] = useState<ProjectContract[]>([]);
  const [invoices, setInvoices] = useState<ProjectInvoice[]>([]);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0, address: "" });
  const [beneficiaries, setBeneficiaries] = useState({
    count: 0,
    categories: [] as string[],
    stories: "",
    images: [] as string[],
  });
  const [donors, setDonors] = useState<Donor[]>([]);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [financial, setFinancial] = useState<ProjectFinancialSummary>({
    projectValue: 0,
    donationAmount: 0,
    expenses: 0,
    remaining: 0,
    spendRatio: 0,
    currency: "USD",
  });
  const [prevDonorId, setPrevDonorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [newMemberUserId, setNewMemberUserId] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<ProjectRole>("Engineer");
  const [deleteMemberTarget, setDeleteMemberTarget] = useState<GroupMember | null>(null);
  const [newVideoTitle, setNewVideoTitle] = useState("فيديو جديد");
  const [newPhotoTitle, setNewPhotoTitle] = useState("صورة جديدة");

  const userMeta = user ? { uid: user.uid, displayName: user.email ?? undefined } : null;

  const loadAll = useCallback(async () => {
    const p = await getOrgProject(projectId);
    if (!p) {
      router.push("/admin/management/projects");
      return;
    }
    setProject(p);
    setPrevDonorId(p.donorId ?? "");
    const g = await getGroupByProjectId(projectId);
    setGroup(g);
    if (g) {
      setMembers(await listGroupMembers(g.id));
    }
    const photoData = await Promise.all(
      PHOTO_PHASES.map(async (phase) => [phase, await listProjectPhotos(projectId, phase)] as const)
    );
    setPhotos(Object.fromEntries(photoData) as Record<PhotoPhase, ProjectPhoto[]>);
    setVideos(await listProjectSubItems<ProjectVideo>(projectId, PROJECT_SUBCOLLECTIONS.videos));
    setUpdates(await listProjectSubItems<ProjectUpdate>(projectId, PROJECT_SUBCOLLECTIONS.updates));
    setTimeline(
      await listProjectSubItems<ProjectTimelineEntry>(projectId, PROJECT_SUBCOLLECTIONS.timeline)
    );
    setReports(await listProjectSubItems<ProjectReport>(projectId, PROJECT_SUBCOLLECTIONS.reports));
    setContracts(
      await listProjectSubItems<ProjectContract>(projectId, PROJECT_SUBCOLLECTIONS.contracts)
    );
    setInvoices(await listProjectSubItems<ProjectInvoice>(projectId, PROJECT_SUBCOLLECTIONS.invoices));
    const loc = await getProjectLocation(projectId);
    if (loc) setLocation(loc);
    const ben = await getProjectBeneficiaries(projectId);
    if (ben) setBeneficiaries(ben);
    setFinancial(await getProjectFinancial(projectId));
    setDonors(await listDonors());
    const programsSnap = await api.getOrderedDocuments(api.getProgramsCollection());
    setPrograms(programsSnap.map((d) => api.docToData<ProgramItem>(d)));
    const usersSnap = await api.getDocuments(api.getUsersCollection());
    setAllUsers(usersSnap.map((d) => api.docToData<AppUser>(d)));
    setLoading(false);
  }, [projectId, router]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handleSaveOverview() {
    if (!project || !userMeta || !group) return;
    setSaving(true);
    try {
      await updateOrgProject(projectId, project, userMeta);
      if (project.donorId && project.donorId !== prevDonorId) {
        await assignDonorToProject(
          projectId,
          group.id,
          project.donorId,
          {
            projectName: project.projectName,
            projectNumber: project.projectNumber,
            groupName: group.groupName,
          },
          userMeta
        );
        setPrevDonorId(project.donorId);
      }
      await loadAll();
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveFinancial() {
    if (!userMeta) return;
    setSaving(true);
    try {
      await saveProjectFinancial(projectId, financial, userMeta);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddMember() {
    if (!group || !project || !userMeta || !newMemberUserId) return;
    setSaving(true);
    try {
      await addGroupMember(
        {
          groupId: group.id,
          userId: newMemberUserId,
          role: newMemberRole,
          addedBy: userMeta.uid!,
          project: {
            id: project.id,
            projectName: project.projectName,
            projectNumber: project.projectNumber,
          },
          group: { groupName: group.groupName },
        },
        userMeta
      );
      setAddMemberOpen(false);
      setNewMemberUserId("");
      await loadAll();
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveMember() {
    if (!deleteMemberTarget || !project || !userMeta) return;
    setSaving(true);
    try {
      await removeGroupMember(
        group!.id,
        deleteMemberTarget.userId,
        project.projectName,
        userMeta
      );
      setDeleteMemberTarget(null);
      await loadAll();
    } finally {
      setSaving(false);
    }
  }

  async function handleAddUpdate() {
    if (!userMeta) return;
    const title = prompt("عنوان التحديث:");
    if (!title) return;
    const description = prompt("وصف التحديث:") ?? "";
    await saveProjectSubItem(
      projectId,
      PROJECT_SUBCOLLECTIONS.updates,
      { title, description, createdBy: userMeta.uid, images: [], videos: [] },
      userMeta,
      "update"
    );
    await loadAll();
  }

  async function handleAddTimeline() {
    if (!userMeta) return;
    const phase = prompt("اسم المرحلة:") ?? "";
    if (!phase.trim()) return;
    await saveProjectSubItem(
      projectId,
      PROJECT_SUBCOLLECTIONS.timeline,
      {
        phase,
        startDate: project?.startDate || new Date().toISOString().slice(0, 10),
        endDate: project?.expectedEndDate || "",
        status: "pending",
        progress: 0,
      },
      userMeta,
      "timeline"
    );
    await loadAll();
  }

  function patchTimelineEntry(id: string, patch: Partial<ProjectTimelineEntry>) {
    setTimeline((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  async function handleSaveTimelineEntry(entry: ProjectTimelineEntry) {
    if (!userMeta) return;
    setSaving(true);
    try {
      await saveProjectSubItem(
        projectId,
        PROJECT_SUBCOLLECTIONS.timeline,
        entry,
        userMeta,
        "timeline"
      );
      await loadAll();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTimelineEntry(entryId: string) {
    if (!userMeta || !confirm("حذف هذه المرحلة؟")) return;
    setSaving(true);
    try {
      await deleteProjectSubItem(projectId, PROJECT_SUBCOLLECTIONS.timeline, entryId);
      await loadAll();
    } finally {
      setSaving(false);
    }
  }

  function patchPhoto(phase: PhotoPhase, id: string, patch: Partial<ProjectPhoto>) {
    setPhotos((prev) => ({
      ...prev,
      [phase]: prev[phase].map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }

  async function handleSavePhoto(phase: PhotoPhase, photo: ProjectPhoto) {
    if (!userMeta) return;
    setSaving(true);
    try {
      await saveProjectPhoto(projectId, phase, photo, userMeta);
      await loadAll();
    } finally {
      setSaving(false);
    }
  }

  function patchVideo(id: string, patch: Partial<ProjectVideo>) {
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  }

  async function handleSaveVideo(video: ProjectVideo) {
    if (!userMeta) return;
    setSaving(true);
    try {
      await saveProjectSubItem(
        projectId,
        PROJECT_SUBCOLLECTIONS.videos,
        video,
        userMeta,
        "video"
      );
      await loadAll();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteVideo(videoId: string) {
    if (!userMeta || !confirm("حذف هذا الفيديو؟")) return;
    setSaving(true);
    try {
      await deleteProjectSubItem(projectId, PROJECT_SUBCOLLECTIONS.videos, videoId);
      await loadAll();
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveLocation() {
    if (!userMeta) return;
    setSaving(true);
    try {
      await saveProjectLocation(projectId, location, userMeta);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveBeneficiaries() {
    if (!userMeta) return;
    setSaving(true);
    try {
      await saveProjectBeneficiaries(projectId, beneficiaries, userMeta);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !project) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={project.projectName}
        description={`${project.projectNumber} · ${PROJECT_STATUS_LABELS[project.status]}`}
        actions={
          <Link href="/admin/management/projects">
            <Button variant="outline">
              <ArrowRight className="h-4 w-4" />
              العودة
            </Button>
          </Link>
        }
        previewHref={project.publishedOnSite ? `/projects/${project.id}` : null}
      />

      <div className="mb-6 flex flex-wrap gap-2 border-b border-border-subtle pb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-brand-green/10 text-brand-green-dark dark:text-brand-green"
                : "text-muted-foreground hover:bg-border-subtle"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <Card padding="lg" className="space-y-4">
          <Input
            label="اسم المشروع"
            value={project.projectName}
            onChange={(e) => setProject({ ...project, projectName: e.target.value })}
          />
          <Select
            label="الحالة"
            value={project.status}
            onChange={(status) =>
              setProject({ ...project, status: status as ProjectStatus })
            }
            options={Object.entries(PROJECT_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          />
          <RangeSlider
            label="نسبة الإنجاز"
            value={project.progress}
            onChange={(progress) => setProject({ ...project, progress })}
          />
          <Select
            label="المتبرع"
            value={project.donorId}
            onChange={(donorId) => setProject({ ...project, donorId })}
            options={[
              { value: "", label: "— بدون متبرع —" },
              ...donors.map((d) => ({ value: d.id, label: d.fullName })),
            ]}
          />
          <Select
            label="البرنامج (تصفية الموقع)"
            value={project.programId ?? ""}
            onChange={(programId) => setProject({ ...project, programId })}
            options={[
              { value: "", label: "— عام —" },
              ...programs.filter((p) => p.enabled).map((p) => ({
                value: p.id,
                label: p.title?.ar ?? p.id,
              })),
            ]}
          />
          <FileUploadField
            label="صورة الغلاف (الموقع العام)"
            value={project.coverImage ?? ""}
            folder={`projects/${projectId}/cover`}
            onChange={(url) => setProject({ ...project, coverImage: url })}
            accept="image/*"
          />
          <Input
            label="ترتيب العرض"
            type="number"
            value={project.order ?? 0}
            onChange={(e) => setProject({ ...project, order: Number(e.target.value) })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={project.publishedOnSite ?? false}
              onChange={(e) => setProject({ ...project, publishedOnSite: e.target.checked })}
              className="h-4 w-4 rounded border-border text-brand-green"
            />
            نشر على الموقع العام
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={project.featuredOnHome ?? false}
              onChange={(e) => setProject({ ...project, featuredOnHome: e.target.checked })}
              className="h-4 w-4 rounded border-border text-brand-green"
            />
            إبراز في صفحة أعمالنا
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={project.showDonorPublic ?? false}
              onChange={(e) => setProject({ ...project, showDonorPublic: e.target.checked })}
              className="h-4 w-4 rounded border-border text-brand-green"
            />
            إظهار المتبرع والدولة على الموقع (مع أيقونة حسب النوع: فرد / جمعية / مؤسسة / جهة)
          </label>
          <Button loading={saving} onClick={handleSaveOverview}>
            حفظ التغييرات
          </Button>
        </Card>
      )}

      {tab === "members" && group && (
        <div>
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setAddMemberOpen(true)}>
              <Plus className="h-4 w-4" />
              إضافة عضو
            </Button>
          </div>
          <div className="space-y-2">
            {members.map((m) => {
              const u = allUsers.find((x) => x.uid === m.userId);
              return (
                <Card key={m.userId} padding="md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{u?.displayName ?? m.userId}</p>
                      <p className="text-sm text-muted-foreground">
                        {ROLE_LABELS[m.role]} · {m.title || "—"}
                      </p>
                    </div>
                    {!m.isOwner && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteMemberTarget(m)}
                      >
                        إزالة
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
          <AdminFormDialog
            open={addMemberOpen}
            onClose={() => setAddMemberOpen(false)}
            title="إضافة عضو للمشروع"
            onSave={handleAddMember}
            saving={saving}
          >
            <Select
              label="المستخدم"
              value={newMemberUserId}
              onChange={setNewMemberUserId}
              options={allUsers
                .filter((u) => !members.some((m) => m.userId === u.uid))
                .map((u) => ({ value: u.uid, label: u.displayName || u.email }))}
            />
            <Select
              label="الدور"
              value={newMemberRole}
              onChange={(role) => setNewMemberRole(role as ProjectRole)}
              options={PROJECT_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
            />
          </AdminFormDialog>
          <ConfirmDialog
            open={!!deleteMemberTarget}
            onClose={() => setDeleteMemberTarget(null)}
            onConfirm={handleRemoveMember}
            loading={saving}
            message="هل أنت متأكد من إزالة هذا العضو؟"
          />
        </div>
      )}

      {tab === "photos" && (
        <div className="space-y-8">
          {PHOTO_PHASES.map((phase) => (
            <div key={phase}>
              <h3 className="mb-3 font-semibold">
                {phase === "Before" ? "قبل التنفيذ" : phase === "During" ? "أثناء التنفيذ" : "بعد الإنجاز"}
              </h3>
              <div className="mb-3 grid gap-3 sm:grid-cols-3">
                {photos[phase].map((photo) => (
                  <Card key={photo.id} padding="sm">
                    {photo.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo.image} alt={photo.title} className="mb-2 h-32 w-full rounded-lg object-cover" />
                    )}
                    <Input
                      label="عنوان الصورة"
                      value={photo.title}
                      onChange={(e) => patchPhoto(phase, photo.id, { title: e.target.value })}
                    />
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        loading={saving}
                        onClick={() => handleSavePhoto(phase, photo)}
                      >
                        حفظ
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          await deleteProjectPhoto(projectId, phase, photo.id);
                          await loadAll();
                        }}
                      >
                        حذف
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
              <Input
                label="عنوان الصور الجديدة"
                value={newPhotoTitle}
                onChange={(e) => setNewPhotoTitle(e.target.value)}
                className="mb-2"
              />
              <FileUploadField
                label={`رفع صور — ${phase} (يمكن اختيار أكثر من صورة)`}
                value=""
                folder={`projects/${projectId}/photos/${phase}`}
                multiple
                onChange={async (url) => {
                  if (!url || !userMeta) return;
                  await saveProjectPhoto(
                    projectId,
                    phase,
                    {
                      title: newPhotoTitle.trim() || "صورة جديدة",
                      image: url,
                      description: "",
                      uploadedBy: userMeta.uid!,
                    },
                    userMeta
                  );
                  await loadAll();
                }}
                accept="image/*"
              />
            </div>
          ))}
        </div>
      )}

      {tab === "videos" && (
        <div>
          <Input
            label="عنوان الفيديو الجديد"
            value={newVideoTitle}
            onChange={(e) => setNewVideoTitle(e.target.value)}
            className="mb-3"
          />
          <FileUploadField
            label="رفع فيديو (يمكن اختيار أكثر من فيديو أو رابط YouTube لاحقاً)"
            value=""
            folder={`projects/${projectId}/videos`}
            multiple
            accept="video/*,video/mp4,video/webm,.mp4,.webm"
            onChange={async (url) => {
              if (!url || !userMeta) return;
              await saveProjectSubItem(
                projectId,
                PROJECT_SUBCOLLECTIONS.videos,
                {
                  title: newVideoTitle.trim() || "فيديو جديد",
                  video: url,
                  uploadedBy: userMeta.uid,
                },
                userMeta,
                "video"
              );
              await loadAll();
            }}
          />
          <div className="mt-4 space-y-3">
            {videos.map((v) => (
              <Card key={v.id} padding="md" className="space-y-3">
                <Input
                  label="عنوان الفيديو"
                  value={v.title}
                  onChange={(e) => patchVideo(v.id, { title: e.target.value })}
                />
                <Input
                  label="رابط الفيديو (ملف أو YouTube)"
                  dir="ltr"
                  value={v.video}
                  onChange={(e) => patchVideo(v.id, { video: e.target.value })}
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" loading={saving} onClick={() => handleSaveVideo(v)}>
                    حفظ
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    loading={saving}
                    onClick={() => handleDeleteVideo(v.id)}
                  >
                    حذف
                  </Button>
                  <a
                    href={v.video}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-sm text-brand-green"
                  >
                    معاينة
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "updates" && (
        <div>
          <Button className="mb-4" onClick={handleAddUpdate}>
            <Plus className="h-4 w-4" />
            تحديث جديد
          </Button>
          <div className="space-y-3">
            {updates.map((u) => (
              <Card key={u.id} padding="md">
                <p className="font-semibold">{u.title}</p>
                <p className="text-sm text-muted-foreground">{u.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">{u.createdAt?.slice(0, 10)}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "timeline" && (
        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            يعرض على الموقع: تاريخ البداية، المدة المتوقعة، المرحلة الحالية، وتاريخ التسليم —
            بالإضافة إلى المراحل التفصيلية أدناه.
          </p>
          <Button className="mb-4" onClick={handleAddTimeline}>
            <Plus className="h-4 w-4" />
            مرحلة جديدة
          </Button>
          <div className="space-y-4">
            {timeline.map((entry) => (
              <Card key={entry.id} padding="md" className="space-y-3">
                <Input
                  label="اسم المرحلة"
                  value={entry.phase}
                  onChange={(e) => patchTimelineEntry(entry.id, { phase: e.target.value })}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="تاريخ البداية"
                    type="date"
                    dir="ltr"
                    value={entry.startDate}
                    onChange={(e) => patchTimelineEntry(entry.id, { startDate: e.target.value })}
                  />
                  <Input
                    label="تاريخ النهاية"
                    type="date"
                    dir="ltr"
                    value={entry.endDate}
                    onChange={(e) => patchTimelineEntry(entry.id, { endDate: e.target.value })}
                  />
                </div>
                <Select
                  label="الحالة"
                  value={entry.status}
                  onChange={(status) =>
                    patchTimelineEntry(entry.id, {
                      status: status as ProjectTimelineEntry["status"],
                    })
                  }
                  options={[
                    { value: "pending", label: "قادمة" },
                    { value: "in_progress", label: "جارية" },
                    { value: "completed", label: "مكتملة" },
                    { value: "delayed", label: "متأخرة" },
                  ]}
                />
                <RangeSlider
                  label="نسبة التقدم"
                  value={entry.progress}
                  onChange={(progress) => patchTimelineEntry(entry.id, { progress })}
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" loading={saving} onClick={() => handleSaveTimelineEntry(entry)}>
                    حفظ المرحلة
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    loading={saving}
                    onClick={() => handleDeleteTimelineEntry(entry.id)}
                  >
                    حذف
                  </Button>
                </div>
              </Card>
            ))}
            {timeline.length === 0 && (
              <Card padding="lg">
                <p className="text-center text-sm text-muted-foreground">
                  لا توجد مراحل بعد — أضف مراحل لعرض الجدول الزمني على الموقع
                </p>
              </Card>
            )}
          </div>
        </div>
      )}

      {tab === "location" && (
        <Card padding="lg" className="space-y-4">
          <LocationPicker
            lat={location.latitude}
            lng={location.longitude}
            onChange={(lat, lng) => setLocation({ ...location, latitude: lat, longitude: lng })}
          />
          <Input
            label="العنوان"
            value={location.address}
            onChange={(e) => setLocation({ ...location, address: e.target.value })}
          />
          <Button loading={saving} onClick={handleSaveLocation}>
            حفظ الموقع
          </Button>
        </Card>
      )}

      {tab === "reports" && (
        <div>
          <FileUploadField
            label="رفع تقرير PDF"
            value=""
            folder={`projects/${projectId}/reports`}
            onChange={async (url) => {
              if (!url || !userMeta) return;
              await saveProjectSubItem(
                projectId,
                PROJECT_SUBCOLLECTIONS.reports,
                {
                  title: "تقرير",
                  reportType: "interim" as ReportType,
                  file: url,
                  uploadedBy: userMeta.uid,
                },
                userMeta,
                "report"
              );
              await loadAll();
            }}
            accept=".pdf"
          />
          <div className="mt-4 space-y-2">
            {reports.map((r) => (
              <Card key={r.id} padding="md">
                <p className="font-medium">{r.title}</p>
                <p className="text-sm text-muted-foreground">
                  {REPORT_TYPE_LABELS[r.reportType]}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "contracts" && (
        <div>
          <FileUploadField
            label="رفع عقد"
            value=""
            folder={`projects/${projectId}/contracts`}
            onChange={async (url) => {
              if (!url || !userMeta) return;
              await saveProjectSubItem(
                projectId,
                PROJECT_SUBCOLLECTIONS.contracts,
                {
                  contractNumber: `C-${Date.now()}`,
                  file: url,
                  signedAt: new Date().toISOString().slice(0, 10),
                  uploadedBy: userMeta.uid,
                },
                userMeta,
                "contract"
              );
              await loadAll();
            }}
            accept=".pdf"
          />
          <div className="mt-4 space-y-2">
            {contracts.map((c) => (
              <Card key={c.id} padding="md">
                <p className="font-medium">{c.contractNumber}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "invoices" && (
        <div>
          <FileUploadField
            label="رفع فاتورة"
            value=""
            folder={`projects/${projectId}/invoices`}
            onChange={async (url) => {
              if (!url || !userMeta) return;
              await saveProjectSubItem(
                projectId,
                PROJECT_SUBCOLLECTIONS.invoices,
                {
                  invoiceNumber: `INV-${Date.now()}`,
                  amount: 0,
                  supplier: "",
                  file: url,
                  date: new Date().toISOString().slice(0, 10),
                },
                userMeta,
                "invoice"
              );
              await loadAll();
            }}
            accept=".pdf"
          />
          <div className="mt-4 space-y-2">
            {invoices.map((inv) => (
              <Card key={inv.id} padding="md">
                <p className="font-medium">{inv.invoiceNumber}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "financial" && (
        <Card padding="lg" className="space-y-4">
          <Input
            label="قيمة المشروع"
            type="number"
            dir="ltr"
            value={financial.projectValue}
            onChange={(e) =>
              setFinancial({ ...financial, projectValue: Number(e.target.value) })
            }
          />
          <Input
            label="قيمة التبرع"
            type="number"
            dir="ltr"
            value={financial.donationAmount}
            onChange={(e) =>
              setFinancial({ ...financial, donationAmount: Number(e.target.value) })
            }
          />
          <Input
            label="المصروفات"
            type="number"
            dir="ltr"
            value={financial.expenses}
            onChange={(e) =>
              setFinancial({ ...financial, expenses: Number(e.target.value) })
            }
          />
          <Input
            label="العملة"
            dir="ltr"
            value={financial.currency}
            onChange={(e) => setFinancial({ ...financial, currency: e.target.value })}
          />
          <p className="text-sm text-muted-foreground">
            المتبقي: {(financial.donationAmount - financial.expenses).toLocaleString()}{" "}
            {financial.currency} · نسبة الصرف:{" "}
            {financial.donationAmount > 0
              ? Math.round((financial.expenses / financial.donationAmount) * 100)
              : 0}
            %
          </p>
          <Button loading={saving} onClick={handleSaveFinancial}>
            حفظ البيانات المالية
          </Button>
        </Card>
      )}

      {tab === "beneficiaries" && (
        <Card padding="lg" className="space-y-4">
          <Input
            label="عدد المستفيدين"
            type="number"
            value={beneficiaries.count}
            onChange={(e) =>
              setBeneficiaries({ ...beneficiaries, count: Number(e.target.value) })
            }
          />
          <Input
            label="الفئات (مفصولة بفاصلة)"
            value={beneficiaries.categories.join(", ")}
            onChange={(e) =>
              setBeneficiaries({
                ...beneficiaries,
                categories: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
          />
          <Input
            label="قصص النجاح"
            value={beneficiaries.stories}
            onChange={(e) => setBeneficiaries({ ...beneficiaries, stories: e.target.value })}
          />
          <Button loading={saving} onClick={handleSaveBeneficiaries}>
            حفظ المستفيدين
          </Button>
        </Card>
      )}
    </div>
  );
}
