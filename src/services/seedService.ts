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
  getDefaultPartners,
  getDefaultPrograms,
  getDefaultProjects,
  getDefaultSiteConfig,
  getDefaultStats,
  getDefaultTestimonials,
  getDefaultTopbar,
  getDefaultWhyUs,
  getDefaultSectionTitles,
} from "@/data/default-content";
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
}

export async function registerAdmin(uid: string, email: string, userData: UserMeta = {}) {
  await api.setData({
    docRef: api.getAdminDoc(uid),
    data: { email, active: true, role: "superadmin" },
    userData,
  });
}

/** حفظ/تحديث المستخدم في users/global/users/{uid} بعد تسجيل الدخول */
export async function registerUser(
  uid: string,
  email: string,
  userData: UserMeta = {}
) {
  await api.setData({
    docRef: api.getUserDoc(uid),
    data: {
      id: uid,
      uid,
      email,
      displayName: userData.displayName || email,
      photoURL: userData.photoURL || "",
      role: "admin",
      active: true,
    },
    userData: { ...userData, uid },
  });
}
