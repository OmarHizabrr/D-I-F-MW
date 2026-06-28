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
  getDefaultSiteConfig,
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
import type { UserMeta } from "@/services/firestoreApi";

const api = FirestoreApi.Api;

export async function seedSiteContent(userData: UserMeta = {}) {
  await api.setData({
    docRef: api.getSiteConfigDoc(),
    data: { ...getDefaultSiteConfig(), seeded: true },
    userData,
  });

  await api.setData({ docRef: api.getTopbarDoc(), data: getDefaultTopbar(), userData });
  await api.setData({ docRef: api.getHeroDoc(), data: getDefaultHero(), userData });
  await api.setData({ docRef: api.getFooterDoc(), data: getDefaultFooter(), userData });
  await api.setData({ docRef: api.getNewsletterDoc(), data: getDefaultNewsletter(), userData });
  await api.setData({ docRef: api.getDonationDoc(), data: getDefaultDonation(), userData });
  await api.setData({
    docRef: api.getSiteConfigDoc(),
    data: { sectionTitles: getDefaultSectionTitles() },
    merge: true,
    userData,
  });

  for (const item of getDefaultNavItems()) {
    await api.setData({ docRef: api.getNavItemDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultStats()) {
    await api.setData({ docRef: api.getStatDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultPrograms()) {
    await api.setData({ docRef: api.getProgramDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultProjects()) {
    await api.setData({ docRef: api.getProjectDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultNews()) {
    await api.setData({ docRef: api.getNewsDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultPartners()) {
    await api.setData({ docRef: api.getPartnerDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultTestimonials()) {
    await api.setData({ docRef: api.getTestimonialDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultMedia()) {
    await api.setData({ docRef: api.getMediaDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultLicenses()) {
    await api.setData({ docRef: api.getLicenseDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultMapPoints()) {
    await api.setData({ docRef: api.getMapPointDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultHowWeWork()) {
    await api.setData({ docRef: api.getHowWeWorkDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultWhyUs()) {
    await api.setData({ docRef: api.getWhyUsDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultTeam()) {
    await api.setData({ docRef: api.getTeamDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultSuccessStories()) {
    await api.setData({ docRef: api.getSuccessStoryDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultFaq()) {
    await api.setData({ docRef: api.getFaqDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultDownloads()) {
    await api.setData({ docRef: api.getDownloadDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultEvents()) {
    await api.setData({ docRef: api.getEventDoc(item.id), data: item, userData });
  }
  for (const item of getDefaultVolunteerOpportunities()) {
    await api.setData({
      docRef: api.getVolunteerOpportunityDoc(item.id),
      data: item,
      userData,
    });
  }
  await api.setData({
    docRef: api.getCampaignBannerDoc(),
    data: getDefaultCampaignBanner(),
    userData,
  });
  await api.setData({
    docRef: api.getZakatSettingsDoc(),
    data: getDefaultZakatSettings(),
    userData,
  });
  await api.setData({
    docRef: api.getPrivacyDoc(),
    data: getDefaultPrivacy(),
    userData,
  });
}

export async function registerAdmin(uid: string, email: string, userData: UserMeta = {}) {
  await api.setData({
    docRef: api.getAdminDoc(uid),
    data: { email, active: true, role: "superadmin" },
    userData,
  });
}

/** @deprecated استخدم registerAdminUser من userService */
export async function registerUser(
  uid: string,
  email: string,
  userData: UserMeta = {}
) {
  const { registerAdminUser } = await import("@/services/userService");
  await registerAdminUser(uid, email, userData);
}

export async function getSiteSeedStatus() {
  const config = await api.getData(api.getSiteConfigDoc());

  const collections = [
    api.getNavItemsCollection(),
    api.getStatsCollection(),
    api.getProgramsCollection(),
    api.getProjectsCollection(),
    api.getNewsCollection(),
    api.getPartnersCollection(),
    api.getTestimonialsCollection(),
    api.getMediaCollection(),
    api.getLicensesCollection(),
    api.getMapPointsCollection(),
    api.getHowWeWorkCollection(),
    api.getWhyUsCollection(),
  ] as const;

  const counts = await Promise.all(
    collections.map(async (col) => {
      const docs = await api.getOrderedDocuments(col);
      return docs.length;
    })
  );

  const docCount = counts.reduce((a, b) => a + b, 0);
  const hasDocs = docCount > 0;

  return {
    seeded: Boolean(config?.seeded) || hasDocs,
    totalItems: docCount + 4,
    docCount,
  };
}
