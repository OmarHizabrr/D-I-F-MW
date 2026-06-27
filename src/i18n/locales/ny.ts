const ny = {
  locale: "ny" as const,
  dir: "ltr" as const,
  langName: "Chichewa",

  topBar: {
    phone: "+967 777 000 000",
    email: "info@dif.org",
    donorPortal: "Chipata cha Othandizira",
    login: "Lowani",
  },

  nav: {
    home: "Kwanu",
    about: "Za Ifundo",
    projects: "Mapulojekiti",
    programs: "Mapulogalamu",
    achievements: "Zopeza",
    news: "Nkhani",
    reports: "Malipoti",
    media: "Laibulale ya Media",
    contact: "Lumikizanani",
  },

  hero: {
    title: "Tikumanga Chitukuko... Tikupanga Zotsatira Zokhalitsa",
    subtitle:
      "Development and Investment Foundation imachita mapulojekiti a chitukuko ndi anthu m'maiko ambiri, ndi kuwonekera kwathunthu ndi kutsatira kosalekeza.",
    ctaProjects: "Onani Mapulojekiti Athu",
    ctaTrack: "Tsatirani Pulojekiti Yanu",
  },

  stats: {
    title: "Ziwerengero Zenizeni",
    projects: "Mapulojekiti Omaliza",
    wells: "Mitsinje",
    mosques: "Misikiti",
    schools: "Masukulu",
    beneficiaries: "Olandira Thandizo",
    countries: "Maiko",
  },

  programs: {
    title: "Mapulogalamu Akuluakulu",
    subtitle: "Mapulogalamu omwe amakwaniritsa zofunika za anthu",
    viewProjects: "Onani Mapulojekiti",
    items: {
      mosques: "Kumanga Misikiti",
      wells: "Kukumba Mitsinje",
      education: "Maphunziro",
      health: "Thanzi",
      orphans: "Kuthandiza Ana Amasiye",
      relief: "Thandizo Lachidzulo",
      community: "Chitukuko cha Anthu",
    },
  },

  ongoingProjects: {
    title: "Mapulojekiti Akuchitika",
    subtitle: "Mapulojekiti aposachedwa akuchitika",
    country: "Dziko",
    progress: "Kupita Patsogolo",
    lastUpdate: "Kusintha Kotsalira",
    viewDetails: "Onani Tsatanetsatane",
  },

  howWeWork: {
    title: "Timagwira Ntchito Bwanji?",
    subtitle: "Njira yomveka yotsimikiza ubwino",
    steps: {
      study: { title: "Kuyesa Zofunika", desc: "Kusanthula zofunika za anthu ndi kukhazikitsa zofunika" },
      approve: { title: "Kuvomereza Pulojekiti", desc: "Kuyesa kwaukadaulo ndi kwachuma musanayambe" },
      execute: { title: "Kuchita ndi Kutsatira", desc: "Kuyang'anira m'malo ndi kusintha nthawi ndi nthawi" },
      report: { title: "Lipoti Lomaliza", desc: "Zolemba zonse ndi zithunzi ndi malipoti" },
    },
  },

  whyUs: {
    title: "Chifukwa Chiyani Ife?",
    subtitle: "Mphamvu zathu zazikulu",
    items: {
      transparency: "Kuwonekera",
      followUp: "Kutsatira Kosalekeza",
      reports: "Malipoti Nthawi ndi Nthawi",
      team: "Gulu Lophunzira",
      documented: "Mapulojekiti Olembedwa",
      quality: "Kuchita Bwino",
    },
  },

  mediaGallery: {
    title: "Nyumba ya Media",
    subtitle: "Zithunzi, makanema, ndi zotsegulira zaposachedwa",
    photos: "Zithunzi",
    videos: "Makanema",
    openings: "Kutsegula",
    visits: "Kuyenda m'Malo",
  },

  latestNews: {
    title: "Nkhani Zaposachedwa",
    subtitle: "Zochitika ndi zomwe zachitika posachedwa",
    readMore: "werengani Zambiri",
  },

  partners: {
    title: "Anzathu ndi Othandizira",
    subtitle: "Mabungwe omwe anachita nafe",
  },

  testimonials: {
    title: "Mawu a Olandira Thandizo",
    subtitle: "Nkhani zenizeni kuchokera m'malo",
  },

  licenses: {
    title: "Zilolezo ndi Zivomerezo",
    subtitle: "Zikalata zovomerezeka zomwe zimathandiza kukhulupirika",
    registration: "Satifiketi ya Kulembetsa",
    licenses: "Zilolezo",
    endorsements: "Kuvomereza",
    annualReports: "Malipoti a Chaka",
  },

  projectMap: {
    title: "Mapu a Mapulojekiti",
    subtitle: "Malo omwe mapulojekiti athu akuchitika",
    clickHint: "Dinani pa malo aliwonse kuona tsatanetsatane wa pulojekiti",
  },

  newsletter: {
    title: "Kulembetsa m'Nkhani",
    subtitle: "Landirani nkhani ndi malipoti aposachedwa",
    placeholder: "Lowetsani imelo yanu",
    subscribe: "Lembetsani Tsopano",
  },

  footer: {
    description: "Development and Investment Foundation — tikugwira ntchito chifukwa cha chitukuko chokhalitsa.",
    quickLinks: "Maulalo Ofulumira",
    contactInfo: "Zambiri Zamakontakiti",
    address: "Sana'a, Republic of Yemen",
    workingHours: "Nthawi Yogwira Ntchito",
    hours: "Lamulungu - Lachinayi: 8:00 AM - 4:00 PM",
    rights: "Ufulu wonse ndi wotetezedwa © Development and Investment Foundation",
  },

  theme: {
    light: "Kuwala",
    dark: "Mdima",
    system: "Yokha",
  },

  common: {
    search: "Sakani...",
    select: "Sankhani...",
    noResults: "Palibe zotsatira",
    print: "Sindikizani",
    loading: "Tikukweza...",
    viewAll: "Onani Zonse",
  },
} as const;

export default ny;
