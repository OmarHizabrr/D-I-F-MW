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
  DonationContent,
  PartnerItem,
  ProgramItem,
  ProjectItem,
  SiteConfig,
  StatItem,
  TestimonialItem,
  TeamMember,
  TopbarContent,
  WhyUsItem,
} from "@/types/cms";
import { statsData, programsData, ongoingProjectsData, newsData, partnersData, testimonialsData, mapPointsData, mediaItems, licenseItems, howWeWorkSteps } from "@/data/mock";
import {
  getDefaultSuccessStories,
  getDefaultFaq,
  getDefaultDownloads,
  getDefaultEvents,
  getDefaultVolunteerOpportunities,
} from "@/data/extended-defaults";

export {
  getDefaultSuccessStories,
  getDefaultFaq,
  getDefaultDownloads,
  getDefaultEvents,
  getDefaultVolunteerOpportunities,
} from "@/data/extended-defaults";

const whyUsKeys = ["transparency", "followUp", "reports", "team", "documented", "quality"] as const;

function L(arText: string, enText: string, nyText: string): LocalizedString {
  return { ar: arText, en: enText, ny: nyText };
}

const navKeys = [
  { id: "home", href: "/" },
  { id: "about", href: "/about" },
  { id: "impact", href: "/our-work" },
  { id: "newsEvents", href: "/news" },
  { id: "joinUs", href: "/volunteer" },
  { id: "resources", href: "/resources" },
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
  return navKeys.map((item, i) => ({
    id: item.id,
    label: L(
      ar.nav[item.id as keyof typeof ar.nav],
      en.nav[item.id as keyof typeof en.nav],
      ny.nav[item.id as keyof typeof ny.nav]
    ),
    href: item.href,
    order: i + 1,
    enabled: true,
  }));
}

export function getDefaultTeam(): TeamMember[] {
  return [
    {
      id: "team-1",
      name: L("أحمد المنصور", "Ahmed Al-Mansour", "Ahmed Al-Mansour"),
      role: L("المدير التنفيذي", "Executive Director", "Mtsogoleri Woyendetsa"),
      bio: L(
        "يقود المؤسسة في تنفيذ المشاريع التنموية والإنسانية بخبرة تمتد لأكثر من 15 عاماً.",
        "Leads the foundation in implementing development and humanitarian projects with over 15 years of experience.",
        "Akuyendetsa fundo mu kukwaniritsa mapulojekiti a chitukuko ndi anthu ndi zaka zoposa 15."
      ),
      imageUrl: "",
      order: 1,
      enabled: true,
    },
    {
      id: "team-2",
      name: L("فاطمة الزبير", "Fatima Al-Zubair", "Fatima Al-Zubair"),
      role: L("مديرة البرامج", "Programs Director", "Mtsogoleri wa Mapulogalamu"),
      bio: L(
        "تشرف على تصميم وتنفيذ البرامج الميدانية في عدة دول.",
        "Oversees the design and implementation of field programs across multiple countries.",
        "Amayang'anira kukonza ndi kukwaniritsa mapulogalamu m'maiko ambiri."
      ),
      imageUrl: "",
      order: 2,
      enabled: true,
    },
    {
      id: "team-3",
      name: L("محمد الحكيم", "Mohammed Al-Hakim", "Mohammed Al-Hakim"),
      role: L("مدير العمليات الميدانية", "Field Operations Manager", "Mtsogoleri wa Ntchito za M'munda"),
      bio: L(
        "يتابع تنفيذ المشاريع على الأرض ويضمن جودة التسليم.",
        "Monitors on-the-ground project execution and ensures delivery quality.",
        "Amatsata kukwaniritsidwa kwa mapulojekiti m'munda ndi kuonetsetsa ubwino."
      ),
      imageUrl: "",
      order: 3,
      enabled: true,
    },
  ];
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
    featured: i < 2,
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
    quickLinkIds: ["about", "impact", "newsEvents", "joinUs", "resources"],
    mapsUrl: "",
  };
}

export function getDefaultNewsletter(): NewsletterContent {
  return {
    title: L(ar.newsletter.title, en.newsletter.title, ny.newsletter.title),
    subtitle: L(ar.newsletter.subtitle, en.newsletter.subtitle, ny.newsletter.subtitle),
    placeholder: L(ar.newsletter.placeholder, en.newsletter.placeholder, ny.newsletter.placeholder),
    buttonLabel: L(ar.newsletter.subscribe, en.newsletter.subscribe, ny.newsletter.subscribe),
    successMessage: L(
      ar.newsletter.successMessage,
      en.newsletter.successMessage,
      ny.newsletter.successMessage
    ),
    duplicateMessage: L(
      ar.newsletter.duplicateMessage,
      en.newsletter.duplicateMessage,
      ny.newsletter.duplicateMessage
    ),
  };
}

export function getDefaultDonation(): DonationContent {
  return {
    enabled: true,
    currencyCode: "USD",
    currencySymbol: "$",
    presetAmounts: [10, 25, 50, 100],
    allowCustomAmount: true,
    minAmount: 1,
    paymentMode: "record",
    externalPaymentUrl: "",
    modalTitle: L(ar.donation.modalTitle, en.donation.modalTitle, ny.donation.modalTitle),
    modalSubtitle: L(ar.donation.modalSubtitle, en.donation.modalSubtitle, ny.donation.modalSubtitle),
    amountLabel: L(ar.donation.amountLabel, en.donation.amountLabel, ny.donation.amountLabel),
    customAmountLabel: L(
      ar.donation.customAmountLabel,
      en.donation.customAmountLabel,
      ny.donation.customAmountLabel
    ),
    nameLabel: L(ar.donation.nameLabel, en.donation.nameLabel, ny.donation.nameLabel),
    emailLabel: L(ar.donation.emailLabel, en.donation.emailLabel, ny.donation.emailLabel),
    submitLabel: L(ar.donation.submitLabel, en.donation.submitLabel, ny.donation.submitLabel),
    successMessage: L(
      ar.donation.successMessage,
      en.donation.successMessage,
      ny.donation.successMessage
    ),
    ctaTitle: L(ar.donation.ctaTitle, en.donation.ctaTitle, ny.donation.ctaTitle),
    ctaSubtitle: L(ar.donation.ctaSubtitle, en.donation.ctaSubtitle, ny.donation.ctaSubtitle),
    ctaButtonLabel: L(ar.donation.ctaButton, en.donation.ctaButton, ny.donation.ctaButton),
    navButtonLabel: L(ar.donation.navButton, en.donation.navButton, ny.donation.navButton),
    showHeroButton: true,
    heroButtonLabel: L(ar.donation.heroButton, en.donation.heroButton, ny.donation.heroButton),
    cancelLabel: L(ar.common.cancel, en.common.cancel, ny.common.cancel),
    okLabel: L(ar.common.ok, en.common.ok, ny.common.ok),
    paymentHintRecord: L(
      ar.donation.paymentHintRecord,
      en.donation.paymentHintRecord,
      ny.donation.paymentHintRecord
    ),
    paymentHintExternal: L(
      ar.donation.paymentHintExternal,
      en.donation.paymentHintExternal,
      ny.donation.paymentHintExternal
    ),
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
    programsViewProjects: L(ar.programs.viewProjects, en.programs.viewProjects, ny.programs.viewProjects),
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
    aboutTitle: L(ar.nav.about, en.nav.about, ny.nav.about),
    aboutIntro: L(ar.pages.aboutIntro, en.pages.aboutIntro, ny.pages.aboutIntro),
    teamTitle: L(ar.pages.teamTitle, en.pages.teamTitle, ny.pages.teamTitle),
    teamSubtitle: L(ar.pages.teamSubtitle, en.pages.teamSubtitle, ny.pages.teamSubtitle),
    contactTitle: L(ar.pages.contactTitle, en.pages.contactTitle, ny.pages.contactTitle),
    contactSubtitle: L(ar.pages.contactSubtitle, en.pages.contactSubtitle, ny.pages.contactSubtitle),
    storiesTitle: L(ar.pages.storiesTitle, en.pages.storiesTitle, ny.pages.storiesTitle),
    storiesSubtitle: L(ar.pages.storiesSubtitle, en.pages.storiesSubtitle, ny.pages.storiesSubtitle),
    navTeam: L(ar.nav.team, en.nav.team, ny.nav.team),
    navAllProjects: L(ar.nav.allProjects, en.nav.allProjects, ny.nav.allProjects),
    navAboutOverview: L(ar.nav.aboutOverview, en.nav.aboutOverview, ny.nav.aboutOverview),
    navFaq: L(ar.nav.faq, en.nav.faq, ny.nav.faq),
    navOurWork: L(ar.nav.ourWork, en.nav.ourWork, ny.nav.ourWork),
    navSuccessStories: L(ar.nav.successStories, en.nav.successStories, ny.nav.successStories),
    navStories: L(ar.nav.stories, en.nav.stories, ny.nav.stories),
    navNews: L(ar.nav.news, en.nav.news, ny.nav.news),
    navEvents: L(ar.nav.events, en.nav.events, ny.nav.events),
    navMedia: L(ar.nav.media, en.nav.media, ny.nav.media),
    navVolunteer: L(ar.nav.volunteer, en.nav.volunteer, ny.nav.volunteer),
    navContact: L(ar.nav.contact, en.nav.contact, ny.nav.contact),
    navShareStory: L(ar.pages.shareStory, en.pages.shareStory, ny.pages.shareStory),
    navResources: L(ar.nav.resources, en.nav.resources, ny.nav.resources),
    contactFormName: L(ar.pages.contactFormName, en.pages.contactFormName, ny.pages.contactFormName),
    contactFormEmail: L(ar.pages.contactFormEmail, en.pages.contactFormEmail, ny.pages.contactFormEmail),
    contactFormMessage: L(ar.pages.contactFormMessage, en.pages.contactFormMessage, ny.pages.contactFormMessage),
    contactFormSubmit: L(ar.pages.contactFormSubmit, en.pages.contactFormSubmit, ny.pages.contactFormSubmit),
    contactFormSuccess: L(ar.pages.contactFormSuccess, en.pages.contactFormSuccess, ny.pages.contactFormSuccess),
    contactMapsLink: L(ar.pages.contactMapsLink, en.pages.contactMapsLink, ny.pages.contactMapsLink),
    shareStory: L(ar.pages.shareStory, en.pages.shareStory, ny.pages.shareStory),
    successStories: L(ar.successStories.title, en.successStories.title, ny.successStories.title),
    successStoriesSubtitle: L(ar.successStories.subtitle, en.successStories.subtitle, ny.successStories.subtitle),
    successStoriesReadMore: L(ar.successStories.readMore, en.successStories.readMore, ny.successStories.readMore),
    successStoriesImpact: L(ar.successStories.impact, en.successStories.impact, ny.successStories.impact),
    ourWork: L(ar.ourWork.title, en.ourWork.title, ny.ourWork.title),
    ourWorkSubtitle: L(ar.ourWork.subtitle, en.ourWork.subtitle, ny.ourWork.subtitle),
    events: L(ar.events.title, en.events.title, ny.events.title),
    eventsSubtitle: L(ar.events.subtitle, en.events.subtitle, ny.events.subtitle),
    eventsRegister: L(ar.events.register, en.events.register, ny.events.register),
    eventsLocation: L(ar.events.location, en.events.location, ny.events.location),
    eventsReadMore: L(ar.events.readMore, en.events.readMore, ny.events.readMore),
    faq: L(ar.faq.title, en.faq.title, ny.faq.title),
    faqSubtitle: L(ar.faq.subtitle, en.faq.subtitle, ny.faq.subtitle),
    volunteer: L(ar.volunteer.title, en.volunteer.title, ny.volunteer.title),
    volunteerSubtitle: L(ar.volunteer.subtitle, en.volunteer.subtitle, ny.volunteer.subtitle),
    volunteerApply: L(ar.volunteer.apply, en.volunteer.apply, ny.volunteer.apply),
    volunteerCommitment: L(ar.volunteer.commitment, en.volunteer.commitment, ny.volunteer.commitment),
    volunteerRequirements: L(ar.volunteer.requirements, en.volunteer.requirements, ny.volunteer.requirements),
    volunteerFormSuccess: L(ar.volunteer.formSuccess, en.volunteer.formSuccess, ny.volunteer.formSuccess),
    downloads: L(ar.downloads.title, en.downloads.title, ny.downloads.title),
    downloadsSubtitle: L(ar.downloads.subtitle, en.downloads.subtitle, ny.downloads.subtitle),
    downloadsButton: L(ar.downloads.download, en.downloads.download, ny.downloads.download),
    successStoriesPageTitle: L(ar.pages.successStoriesTitle, en.pages.successStoriesTitle, ny.pages.successStoriesTitle),
    successStoriesPageSubtitle: L(ar.pages.successStoriesSubtitle, en.pages.successStoriesSubtitle, ny.pages.successStoriesSubtitle),
    faqPageTitle: L(ar.pages.faqTitle, en.pages.faqTitle, ny.pages.faqTitle),
    faqPageSubtitle: L(ar.pages.faqSubtitle, en.pages.faqSubtitle, ny.pages.faqSubtitle),
    eventsPageTitle: L(ar.pages.eventsTitle, en.pages.eventsTitle, ny.pages.eventsTitle),
    eventsPageSubtitle: L(ar.pages.eventsSubtitle, en.pages.eventsSubtitle, ny.pages.eventsSubtitle),
    volunteerPageTitle: L(ar.pages.volunteerTitle, en.pages.volunteerTitle, ny.pages.volunteerTitle),
    volunteerPageSubtitle: L(ar.pages.volunteerSubtitle, en.pages.volunteerSubtitle, ny.pages.volunteerSubtitle),
    ourWorkPageTitle: L(ar.pages.ourWorkTitle, en.pages.ourWorkTitle, ny.pages.ourWorkTitle),
    ourWorkPageSubtitle: L(ar.pages.ourWorkSubtitle, en.pages.ourWorkSubtitle, ny.pages.ourWorkSubtitle),
    resourcesPageTitle: L(ar.pages.resourcesTitle, en.pages.resourcesTitle, ny.pages.resourcesTitle),
    resourcesPageSubtitle: L(ar.pages.resourcesSubtitle, en.pages.resourcesSubtitle, ny.pages.resourcesSubtitle),
  };
}
