/** أمثلة توضيحية لحقول النماذج في لوحة التحكم */

export const FORM_PLACEHOLDERS = {
  project: {
    number: "مثال: MW-2024-015",
    name: "مثال: بئر ماء — قرية نيوني",
    type: "مثال: بئر ماء / مسجد / مدرسة",
    description: "مثال: حفر بئر بعمق 80م يخدم 1200 مستفيد",
    country: "مثال: مالاوي",
    city: "مثال: ليلونغوي",
    address: "مثال: حي المستشفى المركزي",
    order: "0",
    photoTitle: "مثال: صورة قبل الحفر",
    videoTitle: "مثال: توثيق مرحلة التجهيز",
    videoUrl: "https://youtube.com/watch?v=...",
    timelinePhase: "مثال: مرحلة الحفر",
    locationAddress: "مثال: قرية نيوني — زومبا",
    beneficiaryCount: "1200",
    beneficiaryCategories: "مثال: أسر، طلاب",
    beneficiaryStories: "مثال: قصة عائلة استفادت...",
    financialProjectValue: "50000",
    financialDonation: "25000",
    financialExpenses: "12000",
    reportTitle: "مثال: التقرير المالي الربعي",
    contractNumber: "مثال: CNT-2024-88",
    invoiceNumber: "مثال: INV-5521",
    invoiceSupplier: "مثال: شركة الحفر المتحدة",
    invoiceAmount: "3500",
    updateTitle: "مثال: اكتمال مرحلة الحفر",
    updateDescription: "مثال: تم الوصول للعمق المستهدف",
  },
  donor: {
    fullName: "مثال: جمعية الخير اليمنية",
    email: "donor@example.org",
    phone: "+967 777 000 000",
    organization: "مثال: فرع عدن",
    country: "مثال: اليمن",
    portalUsername: "donor_yemen_charity",
    portalPin: "123456",
  },
  settings: {
    organizationName: "مثال: مؤسسة التطوير والتنمية D.I.F",
    defaultCurrency: "USD",
  },
  portal: {
    projectNumber: "MW-2024-015",
    username: "donor_yemen_charity",
    pin: "123456",
  },
  member: {
    title: "مثال: مهندس ميداني",
  },
  cms: {
    title: "مثال: عنوان المحتوى",
    description: "مثال: وصف مختصر",
    url: "https://example.com",
    order: "1",
    value: "1000",
    code: "PRJ-001",
  },
} as const;

export const FORM_HINTS = {
  project: {
    donorPrimary:
      "المتبرع الرئيسي: يدخل /portal برقم المشروع أو باسم المستخدم والرمز",
    additionalDonors:
      "متبرعون إضافيون: يتابعون نفس المشروع في البوابة عبر اسم المستخدم (ليس برقم المشروع)",
    membersTab: "فريق العمل والمشرفون: تبويب «الأعضاء» داخل المشروع",
  },
  donor: {
    flow: "المسار: متبرع → ربط بمشروع → تفعيل البوابة → دخول من /portal",
    portalUsername: "للدخول في البوابة — يعرض كل مشاريعه الرئيسية والإضافية",
    portalPin: "يُشارك مع المتبرع مع اسم المستخدم أو عبر رابط/QR",
    portalLink: "انسخ الرابط أو QR من قائمة المتبرعين وأرسله للمتبرع",
  },
} as const;

export function projectBelongsToDonor(
  project: { donorId?: string; additionalDonorIds?: string[] },
  donorId: string
): boolean {
  if (!donorId) return false;
  if (project.donorId === donorId) return true;
  return (project.additionalDonorIds ?? []).includes(donorId);
}
