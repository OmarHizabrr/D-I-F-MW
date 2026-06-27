export const statsData = [
  { icon: "projects" as const, value: 125, labelKey: "projects" as const },
  { icon: "wells" as const, value: 40, labelKey: "wells" as const },
  { icon: "mosques" as const, value: 18, labelKey: "mosques" as const },
  { icon: "schools" as const, value: 12, labelKey: "schools" as const },
  { icon: "beneficiaries" as const, value: 85000, labelKey: "beneficiaries" as const },
  { icon: "countries" as const, value: 6, labelKey: "countries" as const },
];

export const programsData = [
  { id: "mosques", color: "from-emerald-600/70 to-emerald-900/80" },
  { id: "wells", color: "from-sky-600/70 to-sky-900/80" },
  { id: "education", color: "from-amber-600/70 to-amber-900/80" },
  { id: "health", color: "from-rose-600/70 to-rose-900/80" },
  { id: "orphans", color: "from-purple-600/70 to-purple-900/80" },
  { id: "relief", color: "from-orange-600/70 to-orange-900/80" },
  { id: "community", color: "from-lime-600/70 to-lime-900/80" },
] as const;

export const ongoingProjectsData = [
  {
    id: "PRJ-2024-001",
    name: { ar: "مسجد الرحمة", en: "Al-Rahma Mosque", ny: "Msikiti wa Al-Rahma" },
    country: { ar: "اليمن", en: "Yemen", ny: "Yemen" },
    progress: 75,
    lastUpdate: "2026-06-20",
    program: "mosques",
  },
  {
    id: "PRJ-2024-015",
    name: { ar: "بئر ماء الحي الشمالي", en: "North District Water Well", ny: "Mtsinje wa Madzi wa Boma la Kum'mwera" },
    country: { ar: "مالاوي", en: "Malawi", ny: "Malawi" },
    progress: 45,
    lastUpdate: "2026-06-18",
    program: "wells",
  },
  {
    id: "PRJ-2024-022",
    name: { ar: "مدرسة النور", en: "Al-Noor School", ny: "Sukulu ya Al-Noor" },
    country: { ar: "السودان", en: "Sudan", ny: "Sudan" },
    progress: 90,
    lastUpdate: "2026-06-22",
    program: "education",
  },
  {
    id: "PRJ-2024-031",
    name: { ar: "مركز صحي المجتمع", en: "Community Health Center", ny: "Center ya Thanzi ya Anthu" },
    country: { ar: "اليمن", en: "Yemen", ny: "Yemen" },
    progress: 60,
    lastUpdate: "2026-06-15",
    program: "health",
  },
];

export const newsData = [
  {
    id: 1,
    title: { ar: "افتتاح مسجد الخير في مالاوي", en: "Al-Khair Mosque Inauguration in Malawi", ny: "Kutsegula kwa Msikiti wa Al-Khair ku Malawi" },
    date: "2026-06-10",
    category: { ar: "افتتاح", en: "Inauguration", ny: "Kutsegula" },
  },
  {
    id: 2,
    title: { ar: "زيارة ميدانية لفريق الإشراف", en: "Supervision Team Field Visit", ny: "Kuyenda kwa Gulu Loyang'anira" },
    date: "2026-06-05",
    category: { ar: "زيارة ميدانية", en: "Field Visit", ny: "Kuyenda m'Malo" },
  },
  {
    id: 3,
    title: { ar: "توقيع اتفاقية شراكة جديدة", en: "New Partnership Agreement Signed", ny: "Kusainidwa kwa Mgwirizano Watsopano" },
    date: "2026-05-28",
    category: { ar: "اتفاقية", en: "Agreement", ny: "Mgwirizano" },
  },
];

export const partnersData = [
  "Global Aid Network",
  "Humanitarian Trust",
  "Community First",
  "Water for Life",
  "Education Bridge",
  "Health Alliance",
];

export const testimonialsData = [
  {
    id: 1,
    name: { ar: "أحمد محمد", en: "Ahmed Mohammed", ny: "Ahmed Mohammed" },
    role: { ar: "مستفيد — مشروع بئر", en: "Beneficiary — Well Project", ny: "Wolandira Thandizo — Pulojekiti ya Mtsinje" },
    quote: {
      ar: "شكراً للمؤسسة على توفير الماء النظيف لقريتنا. لقد غيّر هذا حياتنا.",
      en: "Thank you to the foundation for providing clean water to our village. It changed our lives.",
      ny: "Zikomo kwa ifundo chifukwa cha madzi oyera kwa mudzi wathu. Zinachita kusintha moyo wathu.",
    },
  },
  {
    id: 2,
    name: { ar: "فاطمة علي", en: "Fatima Ali", ny: "Fatima Ali" },
    role: { ar: "مانحة — مشروع مسجد", en: "Donor — Mosque Project", ny: "Wothandizira — Pulojekiti ya Msikiti" },
    quote: {
      ar: "تابعت مشروعي خطوة بخطوة عبر الموقع. الشفافية والتحديثات المستمرة أعطتني ثقة كاملة.",
      en: "I tracked my project step by step through the website. Transparency and continuous updates gave me full confidence.",
      ny: "Ndinatsata pulojekiti yanga ndi sitepe ndi sitepe kudzera pa tsamba. Kuwonekera ndi kusintha kwathandiza.",
    },
  },
];

export const mapPointsData = [
  { id: 1, lat: 15.35, lng: 44.2, name: { ar: "مسجد الرحمة", en: "Al-Rahma Mosque", ny: "Msikiti wa Al-Rahma" }, country: { ar: "اليمن", en: "Yemen", ny: "Yemen" }, x: 58, y: 42 },
  { id: 2, lat: -13.25, lng: 34.3, name: { ar: "بئر ماء", en: "Water Well", ny: "Mtsinje wa Madzi" }, country: { ar: "مالاوي", en: "Malawi", ny: "Malawi" }, x: 62, y: 68 },
  { id: 3, lat: 15.5, lng: 32.5, name: { ar: "مدرسة النور", en: "Al-Noor School", ny: "Sukulu ya Al-Noor" }, country: { ar: "السودان", en: "Sudan", ny: "Sudan" }, x: 55, y: 45 },
  { id: 4, lat: 12.0, lng: 45.0, name: { ar: "مركز إغاثة", en: "Relief Center", ny: "Center ya Thandizo" }, country: { ar: "جيبوتي", en: "Djibouti", ny: "Djibouti" }, x: 63, y: 48 },
  { id: 5, lat: 9.0, lng: 38.75, name: { ar: "مشروع صحي", en: "Health Project", ny: "Pulojekiti ya Thanzi" }, country: { ar: "إثيوبيا", en: "Ethiopia", ny: "Ethiopia" }, x: 60, y: 50 },
  { id: 6, lat: 2.0, lng: 45.3, name: { ar: "كفالة أيتام", en: "Orphan Sponsorship", ny: "Kuthandiza Ana Amasiye" }, country: { ar: "الصومال", en: "Somalia", ny: "Somalia" }, x: 64, y: 52 },
];

export const mediaItems = [
  { type: "mediaPhoto" as const, color: "from-emerald-600/80 to-emerald-800/90" },
  { type: "mediaVideo" as const, color: "from-sky-600/80 to-sky-800/90" },
  { type: "mediaOpening" as const, color: "from-amber-600/80 to-amber-800/90" },
  { type: "mediaVisit" as const, color: "from-rose-600/80 to-rose-800/90" },
  { type: "mediaPhoto" as const, color: "from-purple-600/80 to-purple-800/90" },
  { type: "mediaVideo" as const, color: "from-teal-600/80 to-teal-800/90" },
  { type: "mediaOpening" as const, color: "from-orange-600/80 to-orange-800/90" },
  { type: "mediaVisit" as const, color: "from-indigo-600/80 to-indigo-800/90" },
];

export const whyUsIcons = ["Shield", "Eye", "FileText", "Users", "CheckCircle", "Award"] as const;

export const howWeWorkSteps = ["study", "approve", "execute", "report"] as const;

export const licenseItems = ["registration", "licenses", "endorsements", "annualReports"] as const;

export type LocalizedText = { ar: string; en: string; ny: string };

export function getLocalized(text: LocalizedText, locale: "ar" | "en" | "ny") {
  return text[locale];
}
