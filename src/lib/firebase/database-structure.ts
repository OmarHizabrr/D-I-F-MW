/**
 * هيكل قاعدة بيانات Firestore — مؤسسة D.I.F
 *
 * CMS: {collection}/{parentId}/{subCollection}/{documentId}
 * إدارة المشاريع: مجموعات جذرية مستقلة (groups, members, MyGroups, donors, …)
 * المشاريع التشغيلية: projects/{projectId} مع SubCollections
 */

export const SITE_ROOT = "global" as const;

/** مستند الوسيط لمحتوى CMS داخل مجموعة projects */
export const CMS_PROJECTS_ROOT = "global" as const;

/** مجموعات نظام إدارة المشاريع (جذر Firestore) */
export const PM_COLLECTIONS = {
  groups: "groups",
  members: "members",
  myGroups: "MyGroups",
  donors: "donors",
  notifications: "notifications",
  settings: "settings",
  portalAccess: "portal_access",
  portalTokens: "portal_tokens",
} as const;

export const PM_SUBCOLLECTIONS = {
  groupMembers: "members",
  userMyGroups: "MyGroups",
} as const;

export const COLLECTIONS = {
  siteConfig: "site_config",
  users: "users",
  admins: "admins",
  topbar: "topbar",
  navItems: "nav_items",
  hero: "hero",
  stats: "stats",
  programs: "programs",
  projects: "projects",
  news: "news",
  partners: "partners",
  testimonials: "testimonials",
  media: "media",
  licenses: "licenses",
  mapPoints: "map_points",
  howWeWork: "how_we_work",
  whyUs: "why_us",
  footer: "footer",
  newsletter: "newsletter",
  donation: "donation",
  donationIntents: "donation_intents",
  contactMessages: "contact_messages",
  newsletterSubscribers: "newsletter_subscribers",
  faq: "faq",
  downloads: "downloads",
  successStories: "success_stories",
  events: "events",
  volunteerOpportunities: "volunteer_opportunities",
  volunteerApplications: "volunteer_applications",
  campaignBanner: "campaign_banner",
  zakatSettings: "zakat_settings",
  privacy: "privacy",
  team: "team",
} as const;

export const HOME_SECTIONS = [
  { id: "users", label: "إدارة المستخدمين", href: "/admin/users" },
  { id: "topbar", label: "الشريط العلوي", href: "/admin/topbar" },
  { id: "nav", label: "القائمة الرئيسية", href: "/admin/navigation" },
  { id: "hero", label: "الواجهة الرئيسية", href: "/admin/hero" },
  { id: "stats", label: "الإحصائيات", href: "/admin/stats" },
  { id: "programs", label: "البرامج", href: "/admin/programs" },
  { id: "projects", label: "المشاريع", href: "/admin/projects" },
  { id: "successStories", label: "قصص النجاح", href: "/admin/success-stories" },
  { id: "howWeWork", label: "كيف نعمل", href: "/admin/how-we-work" },
  { id: "whyUs", label: "لماذا نحن", href: "/admin/why-us" },
  { id: "team", label: "فريق العمل", href: "/admin/team" },
  { id: "media", label: "معرض الوسائط", href: "/admin/media" },
  { id: "news", label: "الأخبار", href: "/admin/news" },
  { id: "events", label: "الفعاليات", href: "/admin/events" },
  { id: "partners", label: "الشركاء", href: "/admin/partners" },
  { id: "testimonials", label: "آراء المستفيدين", href: "/admin/testimonials" },
  { id: "licenses", label: "التراخيص", href: "/admin/licenses" },
  { id: "downloads", label: "التقارير والموارد", href: "/admin/downloads" },
  { id: "faq", label: "الأسئلة الشائعة", href: "/admin/faq" },
  { id: "volunteerOpportunities", label: "فرص التطوع", href: "/admin/volunteer" },
  { id: "volunteerApplications", label: "طلبات التطوع", href: "/admin/volunteer-applications" },
  { id: "sections", label: "عناوين الأقسام", href: "/admin/sections" },
  { id: "mapPoints", label: "خريطة المشاريع", href: "/admin/map" },
  { id: "newsletter", label: "النشرة البريدية", href: "/admin/newsletter" },
  { id: "donation", label: "التبرعات", href: "/admin/donation" },
  { id: "campaignBanner", label: "بانر الحملات", href: "/admin/campaign-banner" },
  { id: "zakatSettings", label: "حاسبة الزكاة", href: "/admin/zakat" },
  { id: "privacy", label: "سياسة الخصوصية", href: "/admin/privacy" },
  { id: "contactMessages", label: "رسائل التواصل", href: "/admin/contact-messages" },
  { id: "footer", label: "التذييل", href: "/admin/footer" },
] as const;

/** أقسام إدارة المشاريع والمتبرعين */
export const MANAGEMENT_SECTIONS = [
  { id: "mgmtDashboard", label: "لوحة المشاريع", href: "/admin/management" },
  { id: "mgmtProjects", label: "المشاريع التشغيلية", href: "/admin/management/projects" },
  { id: "mgmtGroups", label: "المجموعات", href: "/admin/management/groups" },
  { id: "mgmtDonors", label: "المتبرعون", href: "/admin/management/donors" },
  { id: "mgmtNotifications", label: "الإشعارات", href: "/admin/management/notifications" },
  { id: "mgmtSettings", label: "إعدادات النظام", href: "/admin/management/settings" },
] as const;
