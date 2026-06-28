import type {
  DownloadItem,
  EventItem,
  FaqItem,
  LocalizedString,
  SuccessStoryItem,
  VolunteerOpportunity,
} from "@/types/cms";

function L(arText: string, enText: string, nyText: string): LocalizedString {
  return { ar: arText, en: enText, ny: nyText };
}

export function getDefaultSuccessStories(): SuccessStoryItem[] {
  return [
    {
      id: "story-1",
      title: L(
        "مياه نظيفة لـ 500 أسرة في ريف مالاوي",
        "Clean water for 500 families in rural Malawi",
        "Madzi oyera kwa mafamily 500 ku Malawi"
      ),
      excerpt: L(
        "بفضل دعمكم، أصبح الوصول للمياه الصالحة للشرب واقعاً يومياً لمجتمع بعيد.",
        "Thanks to your support, access to safe drinking water became a daily reality.",
        "Mothandizidwa ndi inu, madzi oyera anafika ku banja lililonse."
      ),
      body: L(
        "نفّذت المؤسسة بئراً عميقاً وشبكة توزيع محلية في قرية نائية، مع تدريب لجنة مجتمعية على الصيانة. النتيجة: انخفاض الأمراض المرتبطة بالمياه بنسبة 60% خلال عام واحد.",
        "We drilled a deep well and built a local distribution network, training a community committee on maintenance. Result: 60% reduction in water-related illness within one year.",
        "Tinakumba chitsime chozama ndi kupanga netiweki ya madzi, ndi kuphunzitsa komiti ya mdera. Matenda ochokera ku madzi anatsika ndi 60%."
      ),
      imageUrl: "",
      youtubeUrl: "",
      country: L("مالاوي", "Malawi", "Malawi"),
      programId: "water",
      projectId: "proj-1",
      beneficiaries: L("500 أسرة", "500 families", "500 mabanja"),
      impactHighlight: L("60% انخفاض في الأمراض", "60% fewer water-related illnesses", "60% kuchepa kwa matenda"),
      publishedAt: "2025-11-15",
      featured: true,
      enabled: true,
      order: 1,
    },
    {
      id: "story-2",
      title: L(
        "تعليم 120 طفلاً في مخيم لاجئين",
        "Education for 120 children in a refugee camp",
        "Kuphunzitsa ana 120 mu msipu wa alendo"
      ),
      excerpt: L(
        "فصول مؤقتة ومواد تعليمية وصلت إلى أطفال فقدوا فرصة الدراسة.",
        "Temporary classrooms and learning materials reached children who lost access to school.",
        "Makilasi achidziwitso ndi zida zophunzira zafika kwa ana osowa sukulu."
      ),
      body: L(
        "أنشأنا 4 فصول دراسية مؤقتة ووظّفنا 6 معلمين محليين. بلغ معدل الحضور 92% في الفصل الأول.",
        "We set up 4 temporary classrooms and hired 6 local teachers. Attendance reached 92% in the first term.",
        "Tinamanga makilasi 4 ndi kulemba aphunzitsi 6. Kuchuluka kwa ana kunafika 92%."
      ),
      imageUrl: "",
      youtubeUrl: "",
      country: L("كينيا", "Kenya", "Kenya"),
      programId: "education",
      projectId: "proj-2",
      beneficiaries: L("120 طفلاً", "120 children", "120 ana"),
      impactHighlight: L("92% حضور", "92% attendance", "92% kuchuluka"),
      publishedAt: "2025-10-01",
      featured: true,
      enabled: true,
      order: 2,
    },
  ];
}

export function getDefaultFaq(): FaqItem[] {
  return [
    {
      id: "faq-1",
      question: L(
        "كيف أتأكد أن تبرعي يصل للمستفيد؟",
        "How can I be sure my donation reaches beneficiaries?",
        "Ndingathe kuwona bwanji kuti chothandizo changa chikafika?"
      ),
      answer: L(
        "نُصدر تقارير دورية لكل مشروع، مع صور ومستندات ميدانية. يمكنك متابعة مشروعك برمز التتبع.",
        "We publish periodic reports for each project with field photos and documents. Track your project with its code.",
        "Timapanga malipoti a nthawi ndi nthawi ndi zithunzi za m'dera. Mutha kutsata pulojekiti ndi kodi yake."
      ),
      category: L("التبرعات", "Donations", "Zothandizo"),
      order: 1,
      enabled: true,
    },
    {
      id: "faq-2",
      question: L(
        "هل يمكن التبرع لبرنامج محدد؟",
        "Can I donate to a specific program?",
        "Ndingapereke chothandizo ku pulogalamu imodzi?"
      ),
      answer: L(
        "نعم، يمكنك اختيار البرنامج أو المشروع عند التبرع، أو التواصل معنا لتخصيص تبرعك.",
        "Yes — choose a program or project when donating, or contact us to allocate your gift.",
        "Inde — sankhani pulogalamu kapena pulojekiti, kapena tilankhulane kuti mugwiritse ntchito chothandizo chanu."
      ),
      category: L("التبرعات", "Donations", "Zothandizo"),
      order: 2,
      enabled: true,
    },
    {
      id: "faq-3",
      question: L(
        "كيف يمكنني التطوع معكم؟",
        "How can I volunteer with you?",
        "Ndingatengere bwanji gawo la kuthandiza?"
      ),
      answer: L(
        "راجع صفحة التطوع للاطلاع على الفرص المتاحة، أو أرسل طلباً وسنتواصل معك.",
        "See the volunteer page for open roles, or submit an application and we will contact you.",
        "Onani tsamba la kuthandiza kapena tumizani application ndipo tikukuyimbirani."
      ),
      category: L("التطوع", "Volunteering", "Kuthandiza"),
      order: 3,
      enabled: true,
    },
  ];
}

export function getDefaultDownloads(): DownloadItem[] {
  return [
    {
      id: "dl-1",
      title: L("التقرير السنوي 2024", "Annual Report 2024", "Lipoti la Chaka 2024"),
      description: L(
        "ملخص شامل للإنجازات والمالية والمشاريع المنفذة.",
        "Comprehensive summary of achievements, finances, and projects.",
        "Chidule cha zochitika, ndalama, ndi mapulojekiti."
      ),
      fileUrl: "",
      fileType: "report",
      year: "2024",
      iconKey: "registration",
      enabled: true,
      order: 1,
    },
    {
      id: "dl-2",
      title: L("كتيب البرامج", "Programs Brochure", "Bukhu la Mapulogalamu"),
      description: L(
        "نظرة عامة على برامج المؤسسة ومجالات عملها.",
        "Overview of foundation programs and focus areas.",
        "Mawonedwe a mapulogalamu a msonkhano."
      ),
      fileUrl: "",
      fileType: "brochure",
      year: "2025",
      iconKey: "registration",
      enabled: true,
      order: 2,
    },
  ];
}

export function getDefaultEvents(): EventItem[] {
  return [
    {
      id: "event-1",
      title: L(
        "يوم مفتوح للمتبرعين",
        "Donor Open Day",
        "Tsiku Lachitseko la Othandizira"
      ),
      excerpt: L(
        "لقاء مباشر مع فريق المؤسسة وعرض لأحدث المشاريع.",
        "Meet our team and see our latest projects in person.",
        "Kumana ndi gulu lathu ndi kuona mapulojekiti atsopano."
      ),
      body: L(
        "ندعوكم لحضور يوم مفتوح في مقر المؤسسة، مع جولة افتراضية للمشاريع الميدانية.",
        "Join us at our headquarters for an open day with a virtual tour of field projects.",
        "Tikukuyitanani ku ofesi kwathu ndi ulendo wa mapulojekiti pa intaneti."
      ),
      location: L("المقر الرئيسي — الرياض", "Head office — Riyadh", "Ofesi yayikulu — Riyadh"),
      startDate: "2026-03-15",
      endDate: "2026-03-15",
      imageUrl: "",
      registrationUrl: "",
      enabled: true,
      order: 1,
    },
  ];
}

export function getDefaultVolunteerOpportunities(): VolunteerOpportunity[] {
  return [
    {
      id: "vol-1",
      title: L(
        "متطوع/ة توثيق ميداني",
        "Field Documentation Volunteer",
        "Wothandiza Kulemba za M'dera"
      ),
      description: L(
        "تصوير وكتابة تقارير قصيرة عن تقدم المشاريع في الميدان.",
        "Photograph and write short reports on project progress in the field.",
        "Jambulani ndi kulemba malipoti achidule za mapulojekiti."
      ),
      location: L("عن بُعد / ميداني", "Remote / Field", "Kutali / M'dera"),
      commitment: L("4 ساعات أسبوعياً", "4 hours per week", "Maola 4 pa sabata"),
      requirements: L(
        "مهارات تصوير أساسية، إجادة العربية أو الإنجليزية.",
        "Basic photography skills; Arabic or English proficiency.",
        "Kujambula koyambira; Chiarabu kapena Chingerezi."
      ),
      enabled: true,
      order: 1,
    },
    {
      id: "vol-2",
      title: L(
        "متطوع/ة ترجمة",
        "Translation Volunteer",
        "Wothandiza Kumasulira"
      ),
      description: L(
        "ترجمة تقارير ومواد توعوية من العربية إلى الإنجليزية أو العكس.",
        "Translate reports and awareness materials between Arabic and English.",
        "Masulirani malipoti pakati pa Chiarabu ndi Chingerezi."
      ),
      location: L("عن بُعد", "Remote", "Kutali"),
      commitment: L("مرن", "Flexible", "Motosetsa"),
      requirements: L(
        "إتقان العربية والإنجليزية كتابةً.",
        "Fluent written Arabic and English.",
        "Kulemba bwino Chiarabu ndi Chingerezi."
      ),
      enabled: true,
      order: 2,
    },
  ];
}
