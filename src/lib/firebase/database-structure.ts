/**
 * هيكل قاعدة بيانات Firestore — مؤسسة D.I.F
 *
 * النمط: {collection}/{parentId}/{subCollection}/{documentId}
 */

export const SITE_ROOT = "global" as const;

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
  { id: "howWeWork", label: "كيف نعمل", href: "/admin/how-we-work" },
  { id: "whyUs", label: "لماذا نحن", href: "/admin/why-us" },
  { id: "team", label: "فريق العمل", href: "/admin/team" },
  { id: "media", label: "معرض الوسائط", href: "/admin/media" },
  { id: "news", label: "الأخبار", href: "/admin/news" },
  { id: "partners", label: "الشركاء", href: "/admin/partners" },
  { id: "testimonials", label: "آراء المستفيدين", href: "/admin/testimonials" },
  { id: "licenses", label: "التراخيص", href: "/admin/licenses" },
  { id: "sections", label: "عناوين الأقسام", href: "/admin/sections" },
  { id: "mapPoints", label: "خريطة المشاريع", href: "/admin/map" },
  { id: "newsletter", label: "النشرة البريدية", href: "/admin/newsletter" },
  { id: "donation", label: "التبرعات", href: "/admin/donation" },
  { id: "contactMessages", label: "رسائل التواصل", href: "/admin/contact-messages" },
  { id: "footer", label: "التذييل", href: "/admin/footer" },
] as const;
