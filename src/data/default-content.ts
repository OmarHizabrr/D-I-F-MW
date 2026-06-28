import ar from "@/i18n/locales/ar";
import en from "@/i18n/locales/en";
import ny from "@/i18n/locales/ny";
import type {
  FooterContent,
  HeroContent,
  HowWeWorkStep,
  LicenseItem,
  LocalizedString,
  MapPointItem,
  MediaItem,
  NavItem,
  NewsItem,
  NewsletterContent,
  PartnerItem,
  ProgramItem,
  ProjectItem,
  SiteConfig,
  StatItem,
  TestimonialItem,
  TopbarContent,
  WhyUsItem,
} from "@/types/cms";
import { statsData, programsData, ongoingProjectsData, newsData, partnersData, testimonialsData, mapPointsData, mediaItems, licenseItems, howWeWorkSteps } from "@/data/mock";

const whyUsKeys = ["transparency", "followUp", "reports", "team", "documented", "quality"] as const;

function L(arText: string, enText: string, nyText: string): LocalizedString {
  return { ar: arText, en: enText, ny: nyText };
}

const navKeys = [
  "home", "about", "projects", "programs", "achievements", "news", "reports", "media", "contact",
] as const;

export function getDefaultTopbar(): TopbarContent {
  return {
    phone: ar.topBar.phone,
    email: ar.topBar.email,
    donorPortalLabel: L(ar.topBar.donorPortal, en.topBar.donorPortal, ny.topBar.donorPortal),
    loginLabel: L(ar.topBar.login, en.topBar.login, ny.topBar.login),
    socialLinks: [
      { id: "fb", platform: "facebook", url: "#", enabled: true, order: 1 },
      { id: "tw", platform: "twitter", url: "#", enabled: true, order: 2 },
      { id: "yt", platform: "youtube", url: "#", enabled: true, order: 3 },
      { id: "ig", platform: "instagram", url: "#", enabled: true, order: 4 },
    ],
  };
}

export function getDefaultNavItems(): NavItem[] {
  return navKeys.map((key, i) => ({
    id: key,
    label: L(ar.nav[key], en.nav[key], ny.nav[key]),
    href: `#${key}`,
    order: i + 1,
    enabled: true,
  }));
}

export function getDefaultHero(): HeroContent {
  return {
    title: L(ar.hero.title, en.hero.title, ny.hero.title),
    subtitle: L(ar.hero.subtitle, en.hero.subtitle, ny.hero.subtitle),
    ctaProjects: L(ar.hero.ctaProjects, en.hero.ctaProjects, ny.hero.ctaProjects),
    ctaTrack: L(ar.hero.ctaTrack, en.hero.ctaTrack, ny.hero.ctaTrack),
    backgroundImageUrl: "",
    backgroundVideoUrl: "",
    youtubeUrl: "",
  };
}

export function getDefaultStats(): StatItem[] {
  return statsData.map((s, i) => ({
    id: s.labelKey,
    iconKey: s.icon,
    value: s.value,
    label: L(ar.stats[s.labelKey], en.stats[s.labelKey], ny.stats[s.labelKey]),
    order: i + 1,
    enabled: true,
  }));
}

export function getDefaultPrograms(): ProgramItem[] {
  return programsData.map((p, i) => ({
    id: p.id,
    iconKey: p.id,
    title: L(
      ar.programs.items[p.id as keyof typeof ar.programs.items],
      en.programs.items[p.id as keyof typeof en.programs.items],
      ny.programs.items[p.id as keyof typeof ny.programs.items]
    ),
    description: L("", "", ""),
    imageUrl: "",
    color: p.color,
    order: i + 1,
    enabled: true,
  }));
}

export function getDefaultProjects(): ProjectItem[] {
  return ongoingProjectsData.map((p, i) => ({
    id: p.id,
    code: p.id,
    name: L(p.name.ar, p.name.en, p.name.ny),
    country: L(p.country.ar, p.country.en, p.country.ny),
    city: "",
    programId: p.program,
    progress: p.progress,
    status: "ongoing" as const,
    imageUrl: "",
    lastUpdate: p.lastUpdate,
    donorName: "",
    showDonor: false,
    enabled: true,
    order: i + 1,
  }));
}

export function getDefaultNews(): NewsItem[] {
  return newsData.map((n, i) => ({
    id: String(n.id),
    title: L(n.title.ar, n.title.en, n.title.ny),
    excerpt: L(n.title.ar, n.title.en, n.title.ny),
    body: L(
      "تفاصيل الخبر متاحة من لوحة التحكم.",
      "News details can be edited from the admin panel.",
      "Zambiri zitha kukonzedwa kuchokera pa panel ya admin."
    ),
    category: L(n.category.ar, n.category.en, n.category.ny),
    imageUrl: "",
    youtubeUrl: "",
    date: n.date,
    enabled: true,
    order: i + 1,
  }));
}

export function getDefaultPartners(): PartnerItem[] {
  return partnersData.map((name, i) => ({
    id: `partner-${i}`,
    name,
    logoUrl: "",
    websiteUrl: "",
    enabled: true,
    order: i + 1,
  }));
}

export function getDefaultTestimonials(): TestimonialItem[] {
  return testimonialsData.map((t, i) => ({
    id: String(t.id),
    name: L(t.name.ar, t.name.en, t.name.ny),
    role: L(t.role.ar, t.role.en, t.role.ny),
    quote: L(t.quote.ar, t.quote.en, t.quote.ny),
    imageUrl: "",
    youtubeUrl: "",
    enabled: true,
    order: i + 1,
    status: "approved" as const,
    source: "seed" as const,
  }));
}

export function getDefaultMedia(): MediaItem[] {
  const typeMap = {
    mediaPhoto: "photo" as const,
    mediaVideo: "video" as const,
    mediaOpening: "opening" as const,
    mediaVisit: "visit" as const,
  };
  return mediaItems.map((m, i) => ({
    id: `media-${i}`,
    type: typeMap[m.type as keyof typeof typeMap] || "photo",
    title: L("", "", ""),
    imageUrl: "",
    youtubeUrl: "",
    enabled: true,
    order: i + 1,
  }));
}

export function getDefaultLicenses(): LicenseItem[] {
  return licenseItems.map((key, i) => ({
    id: key,
    title: L(ar.licenses[key], en.licenses[key], ny.licenses[key]),
    pdfUrl: "",
    iconKey: key,
    enabled: true,
    order: i + 1,
  }));
}

export function getDefaultMapPoints(): MapPointItem[] {
  return mapPointsData.map((p, i) => ({
    id: String(p.id),
    name: L(p.name.ar, p.name.en, p.name.ny),
    country: L(p.country.ar, p.country.en, p.country.ny),
    lat: p.lat,
    lng: p.lng,
    mapX: p.x,
    mapY: p.y,
    projectId: "",
    order: i + 1,
    enabled: true,
  }));
}

export function getDefaultHowWeWork(): HowWeWorkStep[] {
  return howWeWorkSteps.map((step, i) => ({
    id: step,
    title: L(ar.howWeWork.steps[step].title, en.howWeWork.steps[step].title, ny.howWeWork.steps[step].title),
    description: L(ar.howWeWork.steps[step].desc, en.howWeWork.steps[step].desc, ny.howWeWork.steps[step].desc),
    iconKey: step,
    order: i + 1,
    enabled: true,
  }));
}

export function getDefaultWhyUs(): WhyUsItem[] {
  return whyUsKeys.map((key, i) => ({
    id: key,
    title: L(ar.whyUs.items[key], en.whyUs.items[key], ny.whyUs.items[key]),
    iconKey: key,
    order: i + 1,
    enabled: true,
  }));
}

export function getDefaultFooter(): FooterContent {
  return {
    description: L(ar.footer.description, en.footer.description, ny.footer.description),
    address: L(ar.footer.address, en.footer.address, ny.footer.address),
    workingHours: L(ar.footer.hours, en.footer.hours, ny.footer.hours),
    rights: L(ar.footer.rights, en.footer.rights, ny.footer.rights),
    quickLinkIds: ["home", "about", "projects", "programs", "news", "contact"],
  };
}

export function getDefaultNewsletter(): NewsletterContent {
  return {
    title: L(ar.newsletter.title, en.newsletter.title, ny.newsletter.title),
    subtitle: L(ar.newsletter.subtitle, en.newsletter.subtitle, ny.newsletter.subtitle),
    placeholder: L(ar.newsletter.placeholder, en.newsletter.placeholder, ny.newsletter.placeholder),
    buttonLabel: L(ar.newsletter.subscribe, en.newsletter.subscribe, ny.newsletter.subscribe),
  };
}

export function getDefaultSiteConfig(): SiteConfig {
  return {
    siteName: L("مؤسسة التطوير والتنمية", "D.I.F", "D.I.F"),
    seeded: false,
    maintenanceMode: false,
  };
}

export function getDefaultSectionTitles() {
  return {
    stats: L(ar.stats.title, en.stats.title, ny.stats.title),
    programs: L(ar.programs.title, en.programs.title, ny.programs.title),
    programsSubtitle: L(ar.programs.subtitle, en.programs.subtitle, ny.programs.subtitle),
    projects: L(ar.ongoingProjects.title, en.ongoingProjects.title, ny.ongoingProjects.title),
    projectsSubtitle: L(ar.ongoingProjects.subtitle, en.ongoingProjects.subtitle, ny.ongoingProjects.subtitle),
    howWeWork: L(ar.howWeWork.title, en.howWeWork.title, ny.howWeWork.title),
    howWeWorkSubtitle: L(ar.howWeWork.subtitle, en.howWeWork.subtitle, ny.howWeWork.subtitle),
    whyUs: L(ar.whyUs.title, en.whyUs.title, ny.whyUs.title),
    whyUsSubtitle: L(ar.whyUs.subtitle, en.whyUs.subtitle, ny.whyUs.subtitle),
    media: L(ar.mediaGallery.title, en.mediaGallery.title, ny.mediaGallery.title),
    mediaSubtitle: L(ar.mediaGallery.subtitle, en.mediaGallery.subtitle, ny.mediaGallery.subtitle),
    news: L(ar.latestNews.title, en.latestNews.title, ny.latestNews.title),
    newsSubtitle: L(ar.latestNews.subtitle, en.latestNews.subtitle, ny.latestNews.subtitle),
    partners: L(ar.partners.title, en.partners.title, ny.partners.title),
    partnersSubtitle: L(ar.partners.subtitle, en.partners.subtitle, ny.partners.subtitle),
    testimonials: L(ar.testimonials.title, en.testimonials.title, ny.testimonials.title),
    testimonialsSubtitle: L(ar.testimonials.subtitle, en.testimonials.subtitle, ny.testimonials.subtitle),
    licenses: L(ar.licenses.title, en.licenses.title, ny.licenses.title),
    licensesSubtitle: L(ar.licenses.subtitle, en.licenses.subtitle, ny.licenses.subtitle),
    map: L(ar.projectMap.title, en.projectMap.title, ny.projectMap.title),
    mapSubtitle: L(ar.projectMap.subtitle, en.projectMap.subtitle, ny.projectMap.subtitle),
    mapHint: L(ar.projectMap.clickHint, en.projectMap.clickHint, ny.projectMap.clickHint),
    viewAll: L(ar.common.viewAll, en.common.viewAll, ny.common.viewAll),
    projectsCountry: L(ar.ongoingProjects.country, en.ongoingProjects.country, ny.ongoingProjects.country),
    projectsProgress: L(ar.ongoingProjects.progress, en.ongoingProjects.progress, ny.ongoingProjects.progress),
    projectsLastUpdate: L(ar.ongoingProjects.lastUpdate, en.ongoingProjects.lastUpdate, ny.ongoingProjects.lastUpdate),
    projectsViewDetails: L(ar.ongoingProjects.viewDetails, en.ongoingProjects.viewDetails, ny.ongoingProjects.viewDetails),
    projectsTableName: L(ar.nav.projects, en.nav.projects, ny.nav.projects),
    newsReadMore: L(ar.latestNews.readMore, en.latestNews.readMore, ny.latestNews.readMore),
    licensesPdf: L("PDF", "PDF", "PDF"),
    mediaTypePhoto: L(ar.mediaGallery.photos, en.mediaGallery.photos, ny.mediaGallery.photos),
    mediaTypeVideo: L(ar.mediaGallery.videos, en.mediaGallery.videos, ny.mediaGallery.videos),
    mediaTypeOpening: L(ar.mediaGallery.openings, en.mediaGallery.openings, ny.mediaGallery.openings),
    mediaTypeVisit: L(ar.mediaGallery.visits, en.mediaGallery.visits, ny.mediaGallery.visits),
    footerQuickLinks: L(ar.footer.quickLinks, en.footer.quickLinks, ny.footer.quickLinks),
    footerContactInfo: L(ar.footer.contactInfo, en.footer.contactInfo, ny.footer.contactInfo),
    footerWorkingHours: L(ar.footer.workingHours, en.footer.workingHours, ny.footer.workingHours),
  };
}
