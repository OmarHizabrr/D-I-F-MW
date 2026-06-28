import type {
  CampaignBannerContent,
  LocalizedString,
  PrivacyPageContent,
  ZakatSettings,
} from "@/types/cms";
import ar from "@/i18n/locales/ar";
import en from "@/i18n/locales/en";
import ny from "@/i18n/locales/ny";

function L(arText: string, enText: string, nyText: string): LocalizedString {
  return { ar: arText, en: enText, ny: nyText };
}

export function getDefaultCampaignBanner(): CampaignBannerContent {
  return {
    enabled: false,
    message: L(
      "🚨 حملة إغاثة عاجلة — ساهم الآن في توفير المياه للأسر المتضررة",
      "🚨 Urgent relief campaign — help provide water to affected families now",
      "🚨 Kampeni yachangu — thandizani kupatsa madzi kwa mabanja"
    ),
    linkLabel: L("تبرع للحملة", "Donate to campaign", "Perekani chothandizo"),
    linkHref: "/ways-to-give",
    dismissible: true,
    variant: "urgent",
    endDate: "",
  };
}

export function getDefaultZakatSettings(): ZakatSettings {
  return {
    enabled: true,
    goldPricePerGram: 75,
    silverPricePerGram: 0.85,
    nisabGoldGrams: 85,
    nisabSilverGrams: 595,
    zakatRate: 0.025,
    currencyCode: "USD",
    currencySymbol: "$",
    pageTitle: L(ar.zakat.title, en.zakat.title, ny.zakat.title),
    pageSubtitle: L(ar.zakat.subtitle, en.zakat.subtitle, ny.zakat.subtitle),
    pageIntro: L(ar.zakat.intro, en.zakat.intro, ny.zakat.intro),
    resultLabel: L(ar.zakat.resultLabel, en.zakat.resultLabel, ny.zakat.resultLabel),
    belowNisabLabel: L(ar.zakat.belowNisab, en.zakat.belowNisab, ny.zakat.belowNisab),
    donateZakatLabel: L(ar.zakat.donateZakat, en.zakat.donateZakat, ny.zakat.donateZakat),
    fieldCash: L(ar.zakat.fieldCash, en.zakat.fieldCash, ny.zakat.fieldCash),
    fieldGold: L(ar.zakat.fieldGold, en.zakat.fieldGold, ny.zakat.fieldGold),
    fieldSilver: L(ar.zakat.fieldSilver, en.zakat.fieldSilver, ny.zakat.fieldSilver),
    fieldInvestments: L(ar.zakat.fieldInvestments, en.zakat.fieldInvestments, ny.zakat.fieldInvestments),
    fieldDebts: L(ar.zakat.fieldDebts, en.zakat.fieldDebts, ny.zakat.fieldDebts),
    calculateLabel: L(ar.zakat.calculate, en.zakat.calculate, ny.zakat.calculate),
    nisabNote: L(ar.zakat.nisabNote, en.zakat.nisabNote, ny.zakat.nisabNote),
  };
}

export function getDefaultPrivacy(): PrivacyPageContent {
  return {
    title: L(ar.privacy.title, en.privacy.title, ny.privacy.title),
    subtitle: L(ar.privacy.subtitle, en.privacy.subtitle, ny.privacy.subtitle),
    body: L(ar.privacy.body, en.privacy.body, ny.privacy.body),
    lastUpdated: "2026-01-01",
  };
}

export function getDefaultDonationImpacts(): LocalizedString[] {
  return [
    L("توفير مياه لأسرة لمدة أسبوع", "Water for one family for a week", "Madzi kwa banja kwa sabata"),
    L("حقيبة مدرسية لطفلين", "School kits for two children", "Chikwama cha sukulu kwa ana awiri"),
    L("وجبات إغاثة لـ 5 أسر", "Relief meals for 5 families", "Chakudya cha thandizo kwa mabanja 5"),
    L("دعم مشروع تنموي صغير", "Support a small development project", "Thandizo la pulojekiti"),
  ];
}
