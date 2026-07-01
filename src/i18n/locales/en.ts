const en = {
  locale: "en" as const,
  dir: "ltr" as const,
  langName: "English",

  topBar: {
    phone: "+967 777 000 000",
    email: "info@dif.org",
    donorPortal: "Donor Portal",
    login: "Login",
    whatsAppMessage: "Hello, I would like to inquire about your projects",
  },

  nav: {
    home: "Home",
    about: "About Us",
    projects: "Projects",
    programs: "Programs",
    achievements: "Achievements",
    news: "News",
    reports: "Reports",
    media: "Media Library",
    contact: "Contact Us",
    stories: "Our Stories",
    team: "Our Team",
    allProjects: "All Projects",
    aboutOverview: "About the Foundation",
    ourWork: "Our Work",
    successStories: "Success Stories",
    events: "Events",
    faq: "FAQ",
    volunteer: "Volunteer",
    resources: "Resources",
    impact: "Our Impact",
    newsEvents: "News & Events",
    joinUs: "Get Involved",
    zakatCalculator: "Zakat Calculator",
    transparency: "Transparency",
    waysToGive: "Ways to Give",
    privacy: "Privacy",
  },

  zakat: {
    title: "Zakat Calculator",
    subtitle: "Calculate your Zakat based on gold and silver nisab",
    intro: "Enter your zakatable assets and debts. Rates are updated from the admin panel.",
    resultLabel: "Zakat due",
    belowNisab: "Wealth is below nisab — no Zakat due currently",
    donateZakat: "Give your Zakat through us",
    fieldCash: "Cash & deposits",
    fieldGold: "Gold (grams)",
    fieldSilver: "Silver (grams)",
    fieldInvestments: "Investments",
    fieldDebts: "Debts (deducted)",
    calculate: "Calculate Zakat",
    nisabNote: "Lower nisab of gold (85g) or silver (595g) applies at current prices",
  },

  transparency: {
    title: "Transparency & Accountability",
    subtitle: "Trust is built with clarity and numbers",
    intro: "We publish reports, licenses, and impact stats so donors know where funds go.",
    reportsTitle: "Reports & documents",
    statsTitle: "Impact numbers",
    licensesTitle: "Licenses & certifications",
    whyTitle: "Why trust us",
    downloadReport: "Download report",
    viewLicenses: "View licenses",
    orgFinancialTitle: "Published projects finances",
    publishedProjects: "Published projects",
    totalDonations: "Total donations",
    totalExpenses: "Total expenses",
    remaining: "Remaining",
  },

  waysToGive: {
    title: "Ways to Give",
    subtitle: "Choose the best way to support our mission",
    zakatTitle: "Zakat",
    zakatDesc: "Fulfill Zakat through our Shariah-compliant channels",
    sadaqahTitle: "Sadaqah & donations",
    sadaqahDesc: "General or project-specific gifts",
    monthlyTitle: "Monthly giving",
    monthlyDesc: "Sustainable impact through recurring support",
    projectTitle: "Fund a project",
    projectDesc: "Support an active or completed project directly",
    calculatorLink: "Zakat calculator",
    transparencyLink: "Transparency & reports",
  },

  privacy: {
    title: "Privacy Policy",
    subtitle: "How we protect and use your data",
    body: "We respect your privacy. Data from donation, contact, and newsletter forms is used only for communication, processing gifts, and improving our services. We do not sell your data. Contact us to request deletion.",
  },

  trust: {
    title: "Why donors trust us",
    badge1: "Financial transparency",
    badge1Desc: "Published reports & documents",
    badge2: "Field documentation",
    badge2Desc: "Photos & reports per project",
    badge3: "Zakat compliant",
    badge3Desc: "Calculator & proper channels",
    badge4: "Continuous follow-up",
    badge4Desc: "Track project progress",
  },

  search: {
    title: "Search site",
    placeholder: "Search projects, news, stories...",
    noResults: "No results for",
    hint: "Search across projects, news, and success stories",
  },

  hero: {
    title: "Building Development... Creating Sustainable Impact",
    subtitle:
      "The Development and Investment Foundation implements developmental and humanitarian projects across multiple countries with full transparency and continuous monitoring.",
    ctaProjects: "Explore Our Projects",
    ctaTrack: "Track Your Project",
  },

  stats: {
    title: "Live Statistics",
    projects: "Completed Projects",
    wells: "Wells",
    mosques: "Mosques",
    schools: "Schools",
    beneficiaries: "Beneficiaries",
    countries: "Countries",
  },

  programs: {
    title: "Main Programs",
    subtitle: "Integrated programs meeting community needs",
    viewProjects: "View Projects",
    items: {
      mosques: "Mosque Construction",
      wells: "Well Drilling",
      education: "Education",
      health: "Healthcare",
      orphans: "Orphan Sponsorship",
      relief: "Relief",
      community: "Community Development",
    },
  },

  ongoingProjects: {
    title: "Ongoing Projects",
    subtitle: "Latest projects under implementation",
    country: "Country",
    progress: "Progress",
    lastUpdate: "Last Update",
    viewDetails: "View Details",
  },

  howWeWork: {
    title: "How We Work",
    subtitle: "A clear methodology ensuring quality execution",
    steps: {
      study: { title: "Needs Assessment", desc: "Analyzing community needs and setting priorities" },
      approve: { title: "Project Approval", desc: "Technical and financial review before launch" },
      execute: { title: "Execution & Monitoring", desc: "Field supervision with regular updates" },
      report: { title: "Final Report", desc: "Complete documentation with photos and reports" },
    },
  },

  whyUs: {
    title: "Why Choose Us",
    subtitle: "Our key strengths",
    items: {
      transparency: "Transparency",
      followUp: "Continuous Follow-up",
      reports: "Periodic Reports",
      team: "Specialized Team",
      documented: "Documented Projects",
      quality: "Quality Commitment",
    },
  },

  mediaGallery: {
    title: "Media Gallery",
    subtitle: "Latest photos, videos, and inaugurations",
    photos: "Photos",
    videos: "Videos",
    openings: "Inaugurations",
    visits: "Field Visits",
  },

  latestNews: {
    title: "Latest News",
    subtitle: "Recent activities and events",
    readMore: "Read More",
  },

  partners: {
    title: "Partners & Supporters",
    subtitle: "Organizations that collaborated with us",
  },

  testimonials: {
    title: "Beneficiary Testimonials",
    subtitle: "Real stories from the field",
  },

  licenses: {
    title: "Licenses & Accreditations",
    subtitle: "Official documents building trust",
    registration: "Registration Certificate",
    licenses: "Licenses",
    endorsements: "Endorsements",
    annualReports: "Annual Reports",
  },

  projectMap: {
    title: "Project Map",
    subtitle: "Our project locations worldwide",
    clickHint: "Click any point to view project details",
  },

  newsletter: {
    title: "Newsletter Subscription",
    subtitle: "Get the latest news and reports",
    placeholder: "Enter your email",
    subscribe: "Subscribe Now",
    successMessage: "Successfully subscribed!",
    duplicateMessage: "This email is already subscribed.",
  },

  donation: {
    modalTitle: "Support Our Mission",
    modalSubtitle: "Your contribution makes a lasting difference in rural communities",
    amountLabel: "Donation Amount",
    customAmountLabel: "Other amount",
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    submitLabel: "Donate Securely",
    successMessage: "Thank you! Your donation has been received.",
    ctaTitle: "Make a Difference",
    ctaSubtitle:
      "Your generous donation helps us continue our vital work and bring lasting change to those who need it most",
    ctaButton: "Give Now",
    navButton: "Donate",
    heroButton: "Donate Now",
    paymentHintRecord: "Your donation will be recorded and we will contact you soon",
    paymentHintExternal: "You will be redirected to complete payment securely",
    recurringLabel: "Monthly",
    oneTimeLabel: "One-time",
    recurringHint: "Monthly giving multiplies your impact throughout the year",
    submitError: "Could not submit your donation. Check your connection and try again.",
  },

  footer: {
    description: "Development and Investment Foundation — working for sustainable development and positive community impact.",
    quickLinks: "Explore the Site",
    contactInfo: "Contact Information",
    address: "Sana'a, Republic of Yemen",
    workingHours: "Working Hours",
    hours: "Sat - Thu: 8:00 AM - 4:00 PM",
    rights: "All rights reserved © Development and Investment Foundation",
    followUs: "Follow Us",
    orgNameAr: "مؤسسة التطوير والتنمية",
    orgNameEn: "D.I.F",
    orgTagline: "Development & Investment Foundation",
  },

  theme: {
    light: "Light",
    dark: "Dark",
    system: "Auto",
  },

  common: {
    search: "Search...",
    select: "Select...",
    noResults: "No results found",
    print: "Print",
    loading: "Loading...",
    viewAll: "View All",
    backHome: "Back to Home",
    home: "Home",
    cancel: "Cancel",
    ok: "OK",
    close: "Close",
    lastUpdated: "Last updated:",
    filterAll: "All",
    contentPending: "Content is being updated from the admin panel.",
    noReports: "No reports published yet",
    noResources: "No downloadable resources at the moment",
    zakatDisabled: "Zakat calculator is currently unavailable",
    backToAllProjects: "Back to all projects",
    projectLocation: "Project location",
    supportedBy: "Supported by",
    allProjects: "All projects",
    noProjects: "No projects match the current filters",
  },

  projectDetail: {
    timelineTitle: "Project timeline",
    startDate: "Start date",
    expectedDuration: "Expected duration",
    currentPhase: "Current phase",
    expectedDelivery: "Expected delivery",
    country: "Country",
    photoGallery: "Photo gallery",
    videosTitle: "Videos",
    photoBefore: "Before",
    photoDuring: "During",
    photoAfter: "After",
  },

  pages: {
    aboutIntro:
      "The Development and Investment Foundation is a non-profit organization implementing development and humanitarian projects across multiple countries with full transparency and continuous monitoring.",
    teamTitle: "Our Team",
    teamSubtitle: "The people leading our field work",
    contactTitle: "Contact Us",
    contactSubtitle: "We welcome your questions and suggestions",
    storiesTitle: "Our Stories",
    storiesSubtitle: "Real testimonials from beneficiaries and communities",
    contactFormName: "Full Name",
    contactFormEmail: "Email Address",
    contactFormMessage: "Your Message",
    contactFormSubmit: "Send Message",
    contactFormSuccess: "Thank you for reaching out! We will respond as soon as possible.",
    contactMapsLink: "View on Map",
    shareStory: "Share Your Story",
    successStoriesTitle: "Success Stories",
    successStoriesSubtitle: "Real impact from our field projects",
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Answers to common questions",
    eventsTitle: "Events",
    eventsSubtitle: "Join our upcoming activities",
    volunteerTitle: "Volunteer With Us",
    volunteerSubtitle: "Share your time and skills to create impact",
    ourWorkTitle: "Our Work",
    ourWorkSubtitle: "Featured completed projects we are proud of",
    resourcesTitle: "Resources & Reports",
    resourcesSubtitle: "Download reports, brochures, and forms",
  },

  successStories: {
    title: "Success Stories",
    subtitle: "Where donations become better lives",
    readMore: "Read story",
    impact: "Impact",
  },

  ourWork: {
    title: "Our Work",
    subtitle: "Documented field achievements",
  },

  events: {
    title: "Events",
    subtitle: "Meetings, workshops, and community activities",
    register: "Register now",
    location: "Location",
    readMore: "Details",
  },

  faq: {
    title: "FAQ",
    subtitle: "Everything you need to know about us",
  },

  volunteer: {
    title: "Volunteer Opportunities",
    subtitle: "Join our impact makers team",
    apply: "Apply now",
    commitment: "Commitment",
    requirements: "Requirements",
    formSuccess: "Thank you! We received your application and will contact you soon.",
  },

  downloads: {
    title: "Reports & Resources",
    subtitle: "Documents and transparency you can download",
    download: "Download",
  },

  loading: {
    load: "Loading data...",
    save: "Saving...",
    delete: "Deleting...",
    update: "Updating...",
    pleaseWait: "Please wait a moment",
  },
} as const;

export default en;
