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

export type NavChild = {
  id: string;
  label: LocalizedString;
  href: string;
};

export type NavItem = {
  id: string;
  label: LocalizedString;
  href: string;
  order: number;
  enabled: boolean;
  children?: NavChild[];
};

export type TeamMember = {
  id: string;
  name: LocalizedString;
  role: LocalizedString;
  bio: LocalizedString;
  imageUrl: string;
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
  iconImageUrl?: string;
  value: number;
  label: LocalizedString;
  order: number;
  enabled: boolean;
};

export type ProgramItem = {
  id: string;
  iconKey: string;
  iconImageUrl?: string;
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
  description?: LocalizedString;
  youtubeUrl?: string;
  featured?: boolean;
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

export type TestimonialSource = "seed" | "admin" | "public";
export type TestimonialStatus = "approved" | "pending" | "rejected";

export type TestimonialItem = {
  id: string;
  name: LocalizedString;
  role: LocalizedString;
  quote: LocalizedString;
  imageUrl: string;
  youtubeUrl: string;
  enabled: boolean;
  order: number;
  userId?: string;
  source?: TestimonialSource;
  status?: TestimonialStatus;
  submittedAt?: string;
};

export type MediaItem = {
  id: string;
  type: "photo" | "video" | "opening" | "visit";
  title: LocalizedString;
  description?: LocalizedString;
  imageUrl: string;
  youtubeUrl: string;
  capturedAt?: string;
  enabled: boolean;
  order: number;
};

export type LicenseItem = {
  id: string;
  title: LocalizedString;
  pdfUrl: string;
  iconKey: string;
  iconImageUrl?: string;
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
  iconImageUrl?: string;
  order: number;
  enabled: boolean;
};

export type WhyUsItem = {
  id: string;
  title: LocalizedString;
  iconKey: string;
  iconImageUrl?: string;
  order: number;
  enabled: boolean;
};

export type FooterContent = {
  description: LocalizedString;
  address: LocalizedString;
  workingHours: LocalizedString;
  rights: LocalizedString;
  mapsUrl: string;
  quickLinkIds: string[];
  showHomeLink?: boolean;
};

export type NewsletterContent = {
  title: LocalizedString;
  subtitle: LocalizedString;
  placeholder: LocalizedString;
  buttonLabel: LocalizedString;
  successMessage: LocalizedString;
  duplicateMessage: LocalizedString;
};

export type DonationPaymentMode = "external" | "record";

export type DonationContent = {
  enabled: boolean;
  currencyCode: string;
  currencySymbol: string;
  presetAmounts: number[];
  allowCustomAmount: boolean;
  minAmount: number;
  paymentMode: DonationPaymentMode;
  externalPaymentUrl: string;
  modalTitle: LocalizedString;
  modalSubtitle: LocalizedString;
  amountLabel: LocalizedString;
  customAmountLabel: LocalizedString;
  nameLabel: LocalizedString;
  emailLabel: LocalizedString;
  submitLabel: LocalizedString;
  successMessage: LocalizedString;
  ctaTitle: LocalizedString;
  ctaSubtitle: LocalizedString;
  ctaButtonLabel: LocalizedString;
  navButtonLabel: LocalizedString;
  showHeroButton: boolean;
  heroButtonLabel: LocalizedString;
  cancelLabel: LocalizedString;
  okLabel: LocalizedString;
  paymentHintRecord: LocalizedString;
  paymentHintExternal: LocalizedString;
};

export type DonationIntentRecord = {
  id: string;
  amount: number;
  currencyCode: string;
  donorName: string;
  donorEmail: string;
  status: "recorded" | "redirected";
  submittedAt?: string;
  read?: boolean;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  submittedAt: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  subscribedAt: string;
};

export type SuccessStoryItem = {
  id: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  body: LocalizedString;
  imageUrl: string;
  youtubeUrl: string;
  country: LocalizedString;
  programId: string;
  projectId: string;
  beneficiaries: LocalizedString;
  impactHighlight: LocalizedString;
  publishedAt: string;
  featured: boolean;
  enabled: boolean;
  order: number;
};

export type FaqItem = {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
  category: LocalizedString;
  order: number;
  enabled: boolean;
};

export type DownloadFileType = "report" | "brochure" | "form" | "other";

export type DownloadItem = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  fileUrl: string;
  fileType: DownloadFileType;
  year: string;
  iconKey: string;
  iconImageUrl?: string;
  order: number;
  enabled: boolean;
};

export type EventItem = {
  id: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  body: LocalizedString;
  location: LocalizedString;
  startDate: string;
  endDate: string;
  imageUrl: string;
  registrationUrl: string;
  enabled: boolean;
  order: number;
};

export type VolunteerOpportunity = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  location: LocalizedString;
  commitment: LocalizedString;
  requirements: LocalizedString;
  enabled: boolean;
  order: number;
};

export type VolunteerApplication = {
  id: string;
  name: string;
  email: string;
  phone: string;
  opportunityId: string;
  opportunityTitle: string;
  message: string;
  read: boolean;
  submittedAt: string;
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
  donationIntents: number;
  totalContactMessages: number;
  unreadContactMessages: number;
  newsletterSubscribers: number;
  teamMembers: number;
  successStories: number;
  events: number;
  faqItems: number;
  downloads: number;
  volunteerOpportunities: number;
  volunteerApplications: number;
  unreadVolunteerApplications: number;
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
