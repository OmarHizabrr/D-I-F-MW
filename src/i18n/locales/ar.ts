const ar = {
  locale: "ar" as const,
  dir: "rtl" as const,
  langName: "العربية",

  topBar: {
    phone: "+967 777 000 000",
    email: "info@dif.org",
    donorPortal: "بوابة المانحين",
    login: "تسجيل الدخول",
  },

  nav: {
    home: "الرئيسية",
    about: "عن المؤسسة",
    projects: "المشاريع",
    programs: "البرامج",
    achievements: "الإنجازات",
    news: "الأخبار",
    reports: "التقارير",
    media: "مكتبة الوسائط",
    contact: "تواصل معنا",
  },

  hero: {
    title: "نبني التنمية... ونصنع الأثر المستدام",
    subtitle:
      "مؤسسة التطوير والتنمية تعمل على تنفيذ مشاريع تنموية وإنسانية في عدة دول، بشفافية كاملة ومتابعة مستمرة لكل مشروع.",
    ctaProjects: "تعرف على مشاريعنا",
    ctaTrack: "تابع مشروعك",
  },

  stats: {
    title: "إحصائيات مباشرة",
    projects: "مشروعًا منفذًا",
    wells: "بئرًا",
    mosques: "مسجدًا",
    schools: "مدرسة",
    beneficiaries: "مستفيد",
    countries: "دول",
  },

  programs: {
    title: "البرامج الرئيسية",
    subtitle: "برامج متكاملة تلبي احتياجات المجتمعات",
    viewProjects: "عرض المشاريع",
    items: {
      mosques: "بناء المساجد",
      wells: "حفر الآبار",
      education: "التعليم",
      health: "الصحة",
      orphans: "كفالة الأيتام",
      relief: "الإغاثة",
      community: "التنمية المجتمعية",
    },
  },

  ongoingProjects: {
    title: "المشاريع الجارية",
    subtitle: "أحدث المشاريع قيد التنفيذ",
    country: "الدولة",
    progress: "نسبة الإنجاز",
    lastUpdate: "آخر تحديث",
    viewDetails: "عرض التفاصيل",
  },

  howWeWork: {
    title: "كيف نعمل؟",
    subtitle: "منهجية واضحة لضمان جودة التنفيذ",
    steps: {
      study: { title: "دراسة الاحتياج", desc: "تحليل واقع المجتمع وتحديد الأولويات" },
      approve: { title: "اعتماد المشروع", desc: "مراجعة فنية ومالية قبل البدء" },
      execute: { title: "التنفيذ والمتابعة", desc: "إشراف ميداني وتحديثات دورية" },
      report: { title: "التقرير النهائي", desc: "توثيق كامل مع صور وتقارير" },
    },
  },

  whyUs: {
    title: "لماذا نحن؟",
    subtitle: "نقاط القوة التي تميزنا",
    items: {
      transparency: "الشفافية",
      followUp: "المتابعة المستمرة",
      reports: "تقارير دورية",
      team: "فريق متخصص",
      documented: "مشاريع موثقة",
      quality: "التزام بالجودة",
    },
  },

  mediaGallery: {
    title: "معرض الوسائط",
    subtitle: "أحدث الصور والفيديوهات والافتتاحات",
    photos: "صور",
    videos: "فيديوهات",
    openings: "افتتاحات",
    visits: "زيارات ميدانية",
  },

  latestNews: {
    title: "أحدث الأخبار",
    subtitle: "آخر الأنشطة والفعاليات",
    readMore: "اقرأ المزيد",
  },

  partners: {
    title: "الشركاء والداعمون",
    subtitle: "جهات تعاونت معنا في مسيرة العطاء",
  },

  testimonials: {
    title: "آراء المستفيدين",
    subtitle: "قصص حقيقية من الميدان",
  },

  licenses: {
    title: "التراخيص والاعتمادات",
    subtitle: "وثائق رسمية تعزز الثقة",
    registration: "شهادة التسجيل",
    licenses: "التراخيص",
    endorsements: "التزكيات",
    annualReports: "التقارير السنوية",
  },

  projectMap: {
    title: "خريطة المشاريع",
    subtitle: "مواقع تنفيذ مشاريعنا حول العالم",
    clickHint: "اضغط على أي نقطة لعرض تفاصيل المشروع",
  },

  newsletter: {
    title: "الاشتراك في النشرة البريدية",
    subtitle: "احصل على آخر الأخبار والتقارير",
    placeholder: "أدخل بريدك الإلكتروني",
    subscribe: "اشترك الآن",
  },

  footer: {
    description: "مؤسسة التطوير والتنمية — نعمل من أجل تنمية مستدامة وأثر إيجابي في المجتمعات.",
    quickLinks: "روابط سريعة",
    contactInfo: "معلومات التواصل",
    address: "صنعاء، الجمهورية اليمنية",
    workingHours: "أوقات العمل",
    hours: "السبت - الخميس: 8:00 ص - 4:00 م",
    rights: "جميع الحقوق محفوظة © مؤسسة التطوير والتنمية",
  },

  theme: {
    light: "فاتح",
    dark: "داكن",
    system: "تلقائي",
  },

  common: {
    search: "بحث...",
    select: "اختر...",
    noResults: "لا توجد نتائج",
    print: "طباعة",
    loading: "جاري التحميل...",
    viewAll: "عرض الكل",
  },
} as const;

export default ar;
