/** أنواع نظام إدارة المشاريع والمتبرعين */

export const PROJECT_ROLES = [
  "Owner",
  "Admin",
  "Manager",
  "Engineer",
  "Financial",
  "Media",
  "Supervisor",
  "Donor",
  "Volunteer",
  "Viewer",
] as const;

export type ProjectRole = (typeof PROJECT_ROLES)[number];

export type ProjectStatus =
  | "draft"
  | "planning"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "cancelled"
  | "archived";

export type GroupStatus = "active" | "inactive" | "archived";

export type MemberStatus = "active" | "inactive" | "pending" | "removed";

export type ReportType =
  | "initial"
  | "interim"
  | "financial"
  | "technical"
  | "final";

export type PhotoPhase = "Before" | "During" | "After";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type MemberPermissions = {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canUpload: boolean;
  canApprove: boolean;
  canInvite: boolean;
};

export const DEFAULT_PERMISSIONS: Record<ProjectRole, MemberPermissions> = {
  Owner: {
    canView: true,
    canEdit: true,
    canDelete: true,
    canUpload: true,
    canApprove: true,
    canInvite: true,
  },
  Admin: {
    canView: true,
    canEdit: true,
    canDelete: true,
    canUpload: true,
    canApprove: true,
    canInvite: true,
  },
  Manager: {
    canView: true,
    canEdit: true,
    canDelete: false,
    canUpload: true,
    canApprove: true,
    canInvite: true,
  },
  Engineer: {
    canView: true,
    canEdit: true,
    canDelete: false,
    canUpload: true,
    canApprove: false,
    canInvite: false,
  },
  Financial: {
    canView: true,
    canEdit: true,
    canDelete: false,
    canUpload: true,
    canApprove: false,
    canInvite: false,
  },
  Media: {
    canView: true,
    canEdit: true,
    canDelete: false,
    canUpload: true,
    canApprove: false,
    canInvite: false,
  },
  Supervisor: {
    canView: true,
    canEdit: true,
    canDelete: false,
    canUpload: true,
    canApprove: true,
    canInvite: false,
  },
  Donor: {
    canView: true,
    canEdit: false,
    canDelete: false,
    canUpload: false,
    canApprove: false,
    canInvite: false,
  },
  Volunteer: {
    canView: true,
    canEdit: false,
    canDelete: false,
    canUpload: false,
    canApprove: false,
    canInvite: false,
  },
  Viewer: {
    canView: true,
    canEdit: false,
    canDelete: false,
    canUpload: false,
    canApprove: false,
    canInvite: false,
  },
};

/** مشروع تشغيلي — projects/{projectId} */
export type OrgProject = {
  id: string;
  projectNumber: string;
  projectName: string;
  projectType: string;
  description: string;
  groupId: string;
  donorId: string;
  country: string;
  city: string;
  address: string;
  coordinates?: Coordinates;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
  isArchived: boolean;
  /** عرض على الموقع العام */
  publishedOnSite?: boolean;
  coverImage?: string;
  programId?: string;
  featuredOnHome?: boolean;
  showDonorPublic?: boolean;
  order?: number;
};

/** مجموعة المشروع — groups/{groupId} */
export type ProjectGroup = {
  id: string;
  projectId: string;
  groupName: string;
  groupType: string;
  ownerId: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
  membersCount: number;
  status: GroupStatus;
};

/** عضو المجموعة — members/{groupId}/members/{userId} */
export type GroupMember = {
  userId: string;
  groupId: string;
  role: ProjectRole;
  title: string;
  permissions: MemberPermissions;
  status: MemberStatus;
  joinedAt: string;
  addedBy: string;
  isOwner: boolean;
};

/** مرجع سريع — MyGroups/{userId}/MyGroups/{groupId} */
export type MyGroupEntry = {
  groupId: string;
  projectId: string;
  projectName: string;
  projectNumber: string;
  groupName: string;
  role: ProjectRole;
  joinedAt: string;
  status: MemberStatus;
  lastActivity?: string;
};

/** نوع المتبرع — فرد، جمعية، مؤسسة، جهة */
export type DonorKind = "individual" | "association" | "organization" | "entity";

/** متبرع — donors/{donorId} */
export type Donor = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  image?: string;
  organization?: string;
  country?: string;
  donorKind?: DonorKind;
  status: "active" | "inactive";
  portalUsername?: string;
  portalPin?: string;
  portalEnabled: boolean;
  linkedUserId?: string;
  qrCodeToken?: string;
  secureLinkToken?: string;
  createdAt?: string;
  updatedAt?: string;
};

/** إشعار — notifications/{notificationId} */
export type AppNotification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  type:
    | "project_started"
    | "phase_completed"
    | "report_uploaded"
    | "photo_uploaded"
    | "video_uploaded"
    | "project_completed"
    | "member_added"
    | "member_removed"
    | "role_changed"
    | "general";
  projectId?: string;
  groupId?: string;
  read: boolean;
  createdAt?: string;
};

/** إعدادات النظام — settings/global */
export type SystemSettings = {
  id: string;
  organizationName: string;
  defaultCurrency: string;
  enableDonorPortal: boolean;
  enableNotifications: boolean;
  updatedAt?: string;
};

/** صورة — projects/{id}/Photos/{phase}/{photoId} */
export type ProjectPhoto = {
  id: string;
  title: string;
  image: string;
  description: string;
  uploadedBy: string;
  uploadedAt?: string;
  phase: PhotoPhase;
};

/** فيديو — projects/{id}/Videos/{videoId} */
export type ProjectVideo = {
  id: string;
  title: string;
  video: string;
  thumbnail?: string;
  duration?: string;
  uploadedBy: string;
  uploadedAt?: string;
};

/** عقد — projects/{id}/Contracts/{contractId} */
export type ProjectContract = {
  id: string;
  contractNumber: string;
  file: string;
  signedAt: string;
  uploadedBy: string;
};

/** فاتورة — projects/{id}/Invoices/{invoiceId} */
export type ProjectInvoice = {
  id: string;
  invoiceNumber: string;
  amount: number;
  supplier: string;
  file: string;
  date: string;
};

/** تقرير — projects/{id}/Reports/{reportId} */
export type ProjectReport = {
  id: string;
  title: string;
  reportType: ReportType;
  file: string;
  description?: string;
  uploadedBy: string;
  uploadedAt?: string;
};

/** تحديث — projects/{id}/Updates/{updateId} */
export type ProjectUpdate = {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt?: string;
  images: string[];
  videos: string[];
};

/** مرحلة زمنية — projects/{id}/Timeline/{timelineId} */
export type ProjectTimelineEntry = {
  id: string;
  phase: string;
  startDate: string;
  endDate: string;
  status: "pending" | "in_progress" | "completed" | "delayed";
  progress: number;
};

/** موقع — projects/{id}/Location/main */
export type ProjectLocation = {
  latitude: number;
  longitude: number;
  googleMap?: string;
  address: string;
};

/** مستفيدون — projects/{id}/Beneficiaries/main */
export type ProjectBeneficiaries = {
  count: number;
  categories: string[];
  stories: string;
  images: string[];
};

/** ملخص مالي — projects/{id}/Progress/financial */
export type ProjectFinancialSummary = {
  projectValue: number;
  donationAmount: number;
  expenses: number;
  remaining: number;
  spendRatio: number;
  currency: string;
};

/** وصول بوابة المتبرع — portal_access/{username} */
export type PortalAccess = {
  username: string;
  donorId: string;
  pin: string;
  fullName: string;
};

/** تقييم المتبرع — projects/{projectId}/DonorRatings/{donorId} */
export type DonorRating = {
  id: string;
  projectId: string;
  donorId: string;
  qualityRating: number;
  executionRating: number;
  communicationRating: number;
  suggestions?: string;
  createdAt?: string;
};

export const PROJECT_SUBCOLLECTIONS = {
  photos: "Photos",
  videos: "Videos",
  documents: "Documents",
  reports: "Reports",
  timeline: "Timeline",
  updates: "Updates",
  invoices: "Invoices",
  contracts: "Contracts",
  finalReport: "FinalReport",
  location: "Location",
  progress: "Progress",
  beneficiaries: "Beneficiaries",
  donorRatings: "DonorRatings",
} as const;

export const PHOTO_PHASES: PhotoPhase[] = ["Before", "During", "After"];

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  initial: "التقرير الابتدائي",
  interim: "التقرير المرحلي",
  financial: "التقرير المالي",
  technical: "التقرير الفني",
  final: "التقرير النهائي",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: "مسودة",
  planning: "تخطيط",
  in_progress: "قيد التنفيذ",
  on_hold: "متوقف",
  completed: "مكتمل",
  cancelled: "ملغي",
  archived: "مؤرشف",
};

export const ROLE_LABELS: Record<ProjectRole, string> = {
  Owner: "مالك",
  Admin: "مدير نظام",
  Manager: "مدير مشروع",
  Engineer: "مهندس",
  Financial: "محاسب",
  Media: "إعلامي",
  Supervisor: "مشرف",
  Donor: "متبرع",
  Volunteer: "متطوع",
  Viewer: "مشاهد",
};
