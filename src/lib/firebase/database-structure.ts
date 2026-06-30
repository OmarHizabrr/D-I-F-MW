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
  { id: "topbar", label: "الشريط العلوي", href: "/admin/topbar", publicHref: "/" },
  { id: "nav", label: "القائمة الرئيسية", href: "/admin/navigation", publicHref: "/" },
  { id: "hero", label: "الواجهة الرئيسية", href: "/admin/hero", publicHref: "/" },
  { id: "stats", label: "الإحصائيات", href: "/admin/stats", publicHref: "/transparency" },
  { id: "programs", label: "البرامج", href: "/admin/programs", publicHref: "/our-work" },
  { id: "projects", label: "المشاريع", href: "/admin/projects", publicHref: "/projects" },
  { id: "successStories", label: "قصص النجاح", href: "/admin/success-stories", publicHref: "/success-stories" },
  { id: "howWeWork", label: "كيف نعمل", href: "/admin/how-we-work", publicHref: "/about" },
  { id: "whyUs", label: "لماذا نحن", href: "/admin/why-us", publicHref: "/about" },
  { id: "team", label: "فريق العمل", href: "/admin/team", publicHref: "/about/team" },
  { id: "media", label: "معرض الوسائط", href: "/admin/media", publicHref: "/media" },
  { id: "news", label: "الأخبار", href: "/admin/news", publicHref: "/news" },
  { id: "events", label: "الفعاليات", href: "/admin/events", publicHref: "/events" },
  { id: "partners", label: "الشركاء", href: "/admin/partners", publicHref: "/#partners" },
  { id: "testimonials", label: "آراء المستفيدين", href: "/admin/testimonials", publicHref: "/stories" },
  { id: "licenses", label: "التراخيص", href: "/admin/licenses", publicHref: "/transparency" },
  { id: "downloads", label: "التقارير والموارد", href: "/admin/downloads", publicHref: "/resources" },
  { id: "faq", label: "الأسئلة الشائعة", href: "/admin/faq", publicHref: "/faq" },
  { id: "volunteerOpportunities", label: "فرص التطوع", href: "/admin/volunteer", publicHref: "/volunteer" },
  { id: "volunteerApplications", label: "طلبات التطوع", href: "/admin/volunteer-applications" },
  { id: "sections", label: "عناوين الأقسام", href: "/admin/sections", publicHref: "/" },
  { id: "mapPoints", label: "خريطة المشاريع", href: "/admin/map", publicHref: "/#map" },
  { id: "newsletter", label: "النشرة البريدية", href: "/admin/newsletter" },
  { id: "donation", label: "التبرعات", href: "/admin/donation", publicHref: "/ways-to-give" },
  { id: "campaignBanner", label: "بانر الحملات", href: "/admin/campaign-banner", publicHref: "/" },
  { id: "zakatSettings", label: "حاسبة الزكاة", href: "/admin/zakat", publicHref: "/zakat-calculator" },
  { id: "privacy", label: "سياسة الخصوصية", href: "/admin/privacy", publicHref: "/privacy" },
  { id: "contactMessages", label: "رسائل التواصل", href: "/admin/contact-messages", publicHref: "/contact" },
  { id: "footer", label: "التذييل", href: "/admin/footer", publicHref: "/" },
] as const;

/** أقسام إدارة المشاريع والمتبرعين */
export const MANAGEMENT_SECTIONS = [
  { id: "mgmtDashboard", label: "نظرة عامة", href: "/admin/management", publicHref: "/projects" },
  { id: "mgmtProjects", label: "المشاريع", href: "/admin/management/projects", publicHref: "/projects" },
  { id: "mgmtDonors", label: "المتبرعون", href: "/admin/management/donors", publicHref: "/portal" },
  { id: "mgmtNotifications", label: "الإشعارات", href: "/admin/management/notifications" },
  { id: "mgmtSettings", label: "إعدادات البوابة", href: "/admin/management/settings", publicHref: "/portal" },
  { id: "mgmtGroups", label: "فرق العمل", href: "/admin/management/groups" },
] as const;

/** روابط سريعة لصندوق الوارد في الشريط الجانبي */
export const ADMIN_INBOX_LINKS = [
  { id: "donation", label: "طلبات التبرع", href: "/admin/donation?tab=intents", publicHref: "/ways-to-give" },
  { id: "contactMessages", label: "رسائل التواصل", href: "/admin/contact-messages", publicHref: "/contact" },
  { id: "volunteerApplications", label: "طلبات التطوع", href: "/admin/volunteer-applications", publicHref: "/volunteer" },
  { id: "newsletter", label: "مشتركو النشرة", href: "/admin/newsletter?tab=subscribers" },
] as const;
