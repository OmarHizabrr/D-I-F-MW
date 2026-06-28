"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { query, orderBy, type QuerySnapshot } from "firebase/firestore";
import FirestoreApi from "@/services/firestoreApi";
import {
  getDefaultFooter,
  getDefaultHero,
  getDefaultHowWeWork,
  getDefaultLicenses,
  getDefaultMapPoints,
  getDefaultMedia,
  getDefaultNavItems,
  getDefaultNews,
  getDefaultNewsletter,
  getDefaultDonation,
  getDefaultPartners,
  getDefaultPrograms,
  getDefaultProjects,
  getDefaultStats,
  getDefaultTeam,
  getDefaultTestimonials,
  getDefaultTopbar,
  getDefaultWhyUs,
  getDefaultSectionTitles,
} from "@/data/default-content";
import {
  getDefaultSuccessStories,
  getDefaultFaq,
  getDefaultDownloads,
  getDefaultEvents,
  getDefaultVolunteerOpportunities,
} from "@/data/extended-defaults";
import {
  getDefaultCampaignBanner,
  getDefaultZakatSettings,
  getDefaultPrivacy,
} from "@/data/trust-features-defaults";
import type {
  FooterContent,
  HeroContent,
  HowWeWorkStep,
  LicenseItem,
  MapPointItem,
  MediaItem,
  NavItem,
  NewsItem,
  NewsletterContent,
  DonationContent,
  PartnerItem,
  ProgramItem,
  ProjectItem,
  StatItem,
  TeamMember,
  TestimonialItem,
  TopbarContent,
  WhyUsItem,
  LocalizedString,
  SuccessStoryItem,
  FaqItem,
  DownloadItem,
  EventItem,
  VolunteerOpportunity,
  CampaignBannerContent,
  ZakatSettings,
  PrivacyPageContent,
} from "@/types/cms";
import { pickLocalized, type LocaleCode } from "@/types/cms";
import { useLocale } from "@/context/LocaleContext";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { isTestimonialPublished } from "@/services/testimonialService";

const api = FirestoreApi.Api;

type SectionTitles = ReturnType<typeof getDefaultSectionTitles>;

type SiteContentState = {
  loading: boolean;
  seeded: boolean;
  topbar: TopbarContent;
  navItems: NavItem[];
  hero: HeroContent;
  stats: StatItem[];
  programs: ProgramItem[];
  projects: ProjectItem[];
  news: NewsItem[];
  partners: PartnerItem[];
  testimonials: TestimonialItem[];
  media: MediaItem[];
  licenses: LicenseItem[];
  mapPoints: MapPointItem[];
  howWeWork: HowWeWorkStep[];
  whyUs: WhyUsItem[];
  team: TeamMember[];
  successStories: SuccessStoryItem[];
  faq: FaqItem[];
  downloads: DownloadItem[];
  events: EventItem[];
  volunteerOpportunities: VolunteerOpportunity[];
  footer: FooterContent;
  newsletter: NewsletterContent;
  donation: DonationContent;
  campaignBanner: CampaignBannerContent;
  zakatSettings: ZakatSettings;
  privacy: PrivacyPageContent;
  sectionTitles: SectionTitles;
};

const defaults: SiteContentState = {
  loading: isFirebaseConfigured(),
  seeded: false,
  topbar: getDefaultTopbar(),
  navItems: getDefaultNavItems(),
  hero: getDefaultHero(),
  stats: getDefaultStats(),
  programs: getDefaultPrograms(),
  projects: getDefaultProjects(),
  news: getDefaultNews(),
  partners: getDefaultPartners(),
  testimonials: getDefaultTestimonials(),
  media: getDefaultMedia(),
  licenses: getDefaultLicenses(),
  mapPoints: getDefaultMapPoints(),
  howWeWork: getDefaultHowWeWork(),
  whyUs: getDefaultWhyUs(),
  team: getDefaultTeam(),
  successStories: getDefaultSuccessStories(),
  faq: getDefaultFaq(),
  downloads: getDefaultDownloads(),
  events: getDefaultEvents(),
  volunteerOpportunities: getDefaultVolunteerOpportunities(),
  footer: getDefaultFooter(),
  newsletter: getDefaultNewsletter(),
  donation: getDefaultDonation(),
  campaignBanner: getDefaultCampaignBanner(),
  zakatSettings: getDefaultZakatSettings(),
  privacy: getDefaultPrivacy(),
  sectionTitles: getDefaultSectionTitles(),
};

type SiteContentContextValue = SiteContentState & {
  text: (value: LocalizedString | undefined, fallback?: string) => string;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

function mapCollection<T>(snap: QuerySnapshot, filter?: (item: T) => boolean): T[] {
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as T)
    .filter((item) => (item as { enabled?: boolean }).enabled !== false)
    .filter((item) => (filter ? filter(item) : true))
    .sort((a, b) => ((a as { order?: number }).order ?? 0) - ((b as { order?: number }).order ?? 0));
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const [state, setState] = useState<SiteContentState>(defaults);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const unsubs: (() => void)[] = [];

    const subscribeDoc = <T,>(
      docRef: ReturnType<typeof api.getTopbarDoc>,
      key: keyof SiteContentState,
      fallback: T
    ) => {
      unsubs.push(
        api.subscribeDocSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setState((prev) => ({ ...prev, [key]: docSnap.data() as T }));
          } else {
            setState((prev) => ({ ...prev, [key]: fallback }));
          }
        })
      );
    };

    const subscribeList = <T,>(
      colRef: ReturnType<typeof api.getStatsCollection>,
      key: keyof SiteContentState,
      fallback: T[],
      filter?: (item: T) => boolean
    ) => {
      const q = query(colRef, orderBy("order", "asc"));
      unsubs.push(
        api.subscribeQuerySnapshot(q, (snap) => {
          const items = mapCollection<T>(snap, filter);
          setState((prev) => ({
            ...prev,
            [key]: items.length ? items : fallback,
          }));
        })
      );
    };

    subscribeDoc(api.getTopbarDoc(), "topbar", defaults.topbar);
    subscribeDoc(api.getHeroDoc(), "hero", defaults.hero);
    subscribeDoc(api.getFooterDoc(), "footer", defaults.footer);
    subscribeDoc(api.getNewsletterDoc(), "newsletter", defaults.newsletter);
    subscribeDoc(api.getDonationDoc(), "donation", defaults.donation);
    subscribeDoc(api.getCampaignBannerDoc(), "campaignBanner", defaults.campaignBanner);
    subscribeDoc(api.getZakatSettingsDoc(), "zakatSettings", defaults.zakatSettings);
    subscribeDoc(api.getPrivacyDoc(), "privacy", defaults.privacy);

    subscribeList(api.getNavItemsCollection(), "navItems", defaults.navItems);
    subscribeList(api.getStatsCollection(), "stats", defaults.stats);
    subscribeList(api.getProgramsCollection(), "programs", defaults.programs);
    subscribeList(api.getProjectsCollection(), "projects", defaults.projects);
    subscribeList(api.getNewsCollection(), "news", defaults.news);
    subscribeList(api.getPartnersCollection(), "partners", defaults.partners);
    subscribeList(
      api.getTestimonialsCollection(),
      "testimonials",
      defaults.testimonials,
      isTestimonialPublished
    );
    subscribeList(api.getMediaCollection(), "media", defaults.media);
    subscribeList(api.getLicensesCollection(), "licenses", defaults.licenses);
    subscribeList(api.getMapPointsCollection(), "mapPoints", defaults.mapPoints);
    subscribeList(api.getHowWeWorkCollection(), "howWeWork", defaults.howWeWork);
    subscribeList(api.getWhyUsCollection(), "whyUs", defaults.whyUs);
    subscribeList(api.getTeamCollection(), "team", defaults.team);
    subscribeList(api.getSuccessStoriesCollection(), "successStories", defaults.successStories);
    subscribeList(api.getFaqCollection(), "faq", defaults.faq);
    subscribeList(api.getDownloadsCollection(), "downloads", defaults.downloads);
    subscribeList(api.getEventsCollection(), "events", defaults.events);
    subscribeList(
      api.getVolunteerOpportunitiesCollection(),
      "volunteerOpportunities",
      defaults.volunteerOpportunities
    );

    unsubs.push(
      api.subscribeDocSnapshot(api.getSiteConfigDoc(), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setState((prev) => ({
            ...prev,
            seeded: Boolean(data.seeded),
            sectionTitles: (data.sectionTitles as SectionTitles) || prev.sectionTitles,
            loading: false,
          }));
        } else {
          setState((prev) => ({ ...prev, loading: false }));
        }
      })
    );

    return () => unsubs.forEach((u) => u());
  }, []);

  const value = useMemo<SiteContentContextValue>(
    () => ({
      ...state,
      text: (value, fallback = "") =>
        pickLocalized(value, locale as LocaleCode, fallback),
    }),
    [state, locale]
  );

  return (
    <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error("useSiteContent must be used within SiteContentProvider");
  return ctx;
}
