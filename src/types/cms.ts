export type LocaleCode = "ar" | "en" | "ny";

export type LocalizedString = Record<LocaleCode, string>;

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  enabled: boolean;
  order: number;
};

export type TopbarContent = {
  phone: string;
  email: string;
  donorPortalLabel: LocalizedString;
  loginLabel: LocalizedString;
  socialLinks: SocialLink[];
};

export type NavItem = {
  id: string;
  label: LocalizedString;
  href: string;
  order: number;
  enabled: boolean;
};

export type HeroContent = {
  title: LocalizedString;
  subtitle: LocalizedString;
  ctaProjects: LocalizedString;
  ctaTrack: LocalizedString;
  backgroundImageUrl: string;
  backgroundVideoUrl: string;
  youtubeUrl: string;
};

export type StatItem = {
  id: string;
  iconKey: string;
  value: number;
  label: LocalizedString;
  order: number;
  enabled: boolean;
};

export type ProgramItem = {
  id: string;
  iconKey: string;
  title: LocalizedString;
  description: LocalizedString;
  imageUrl: string;
  color: string;
  order: number;
  enabled: boolean;
};

export type ProjectStatus = "ongoing" | "completed" | "delayed" | "needs_update";

export type ProjectItem = {
  id: string;
  code: string;
  name: LocalizedString;
  country: LocalizedString;
  city: string;
  programId: string;
  progress: number;
  status: ProjectStatus;
  imageUrl: string;
  lastUpdate: string;
  donorName: string;
  showDonor: boolean;
  enabled: boolean;
  order: number;
};

export type NewsItem = {
  id: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  body: LocalizedString;
  category: LocalizedString;
  imageUrl: string;
  youtubeUrl: string;
  date: string;
  enabled: boolean;
  order: number;
};

export type PartnerItem = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  enabled: boolean;
  order: number;
};

export type TestimonialItem = {
  id: string;
  name: LocalizedString;
  role: LocalizedString;
  quote: LocalizedString;
  imageUrl: string;
  youtubeUrl: string;
  enabled: boolean;
  order: number;
};

export type MediaItem = {
  id: string;
  type: "photo" | "video" | "opening" | "visit";
  title: LocalizedString;
  imageUrl: string;
  youtubeUrl: string;
  enabled: boolean;
  order: number;
};

export type LicenseItem = {
  id: string;
  title: LocalizedString;
  pdfUrl: string;
  iconKey: string;
  enabled: boolean;
  order: number;
};

export type MapPointItem = {
  id: string;
  name: LocalizedString;
  country: LocalizedString;
  lat: number;
  lng: number;
  mapX: number;
  mapY: number;
  projectId: string;
  order: number;
  enabled: boolean;
};

export type HowWeWorkStep = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  iconKey: string;
  order: number;
  enabled: boolean;
};

export type WhyUsItem = {
  id: string;
  title: LocalizedString;
  iconKey: string;
  order: number;
  enabled: boolean;
};

export type FooterContent = {
  description: LocalizedString;
  address: LocalizedString;
  workingHours: LocalizedString;
  rights: LocalizedString;
  quickLinkIds: string[];
};

export type NewsletterContent = {
  title: LocalizedString;
  subtitle: LocalizedString;
  placeholder: LocalizedString;
  buttonLabel: LocalizedString;
};

export type SiteConfig = {
  siteName: LocalizedString;
  seeded: boolean;
  maintenanceMode: boolean;
  updatedAt?: string;
};

export type DashboardStats = {
  projects: number;
  programs: number;
  news: number;
  media: number;
  partners: number;
  testimonials: number;
  activeProjects: number;
  completedProjects: number;
  delayedProjects: number;
};

export function emptyLocalized(): LocalizedString {
  return { ar: "", en: "", ny: "" };
}

export function pickLocalized(
  value: LocalizedString | undefined,
  locale: LocaleCode,
  fallback = ""
): string {
  if (!value) return fallback;
  return value[locale] || value.ar || value.en || fallback;
}
