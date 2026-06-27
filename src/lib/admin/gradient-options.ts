export type GradientOption = {
  id: string;
  label: string;
  classes: string;
  previewFrom: string;
  previewTo: string;
};

/** خيارات تدرج جاهزة — تُحفظ كـ Tailwind classes في Firestore */
export const programGradientOptions: GradientOption[] = [
  {
    id: "brand-green",
    label: "أخضر المؤسسة",
    classes: "from-brand-green/30 to-brand-green/10",
    previewFrom: "#7a9a2e",
    previewTo: "#e8efe0",
  },
  {
    id: "brand-brown",
    label: "بني المؤسسة",
    classes: "from-brand-brown/40 to-brand-brown/10",
    previewFrom: "#8b5e34",
    previewTo: "#f5ebe0",
  },
  {
    id: "emerald",
    label: "زمردي",
    classes: "from-emerald-600/70 to-emerald-900/80",
    previewFrom: "#059669",
    previewTo: "#064e3b",
  },
  {
    id: "sky",
    label: "سماوي",
    classes: "from-sky-600/70 to-sky-900/80",
    previewFrom: "#0284c7",
    previewTo: "#0c4a6e",
  },
  {
    id: "amber",
    label: "ذهبي",
    classes: "from-amber-600/70 to-amber-900/80",
    previewFrom: "#d97706",
    previewTo: "#78350f",
  },
  {
    id: "rose",
    label: "وردي",
    classes: "from-rose-600/70 to-rose-900/80",
    previewFrom: "#e11d48",
    previewTo: "#881337",
  },
  {
    id: "purple",
    label: "بنفسجي",
    classes: "from-purple-600/70 to-purple-900/80",
    previewFrom: "#9333ea",
    previewTo: "#581c87",
  },
  {
    id: "orange",
    label: "برتقالي",
    classes: "from-orange-600/70 to-orange-900/80",
    previewFrom: "#ea580c",
    previewTo: "#7c2d12",
  },
  {
    id: "lime",
    label: "ليموني",
    classes: "from-lime-600/70 to-lime-900/80",
    previewFrom: "#65a30d",
    previewTo: "#365314",
  },
  {
    id: "teal",
    label: "تركواز",
    classes: "from-teal-600/70 to-teal-900/80",
    previewFrom: "#0d9488",
    previewTo: "#134e4a",
  },
  {
    id: "indigo",
    label: "نيلي",
    classes: "from-indigo-600/70 to-indigo-900/80",
    previewFrom: "#4f46e5",
    previewTo: "#312e81",
  },
];

export function getGradientLabel(classes: string) {
  return programGradientOptions.find((g) => g.classes === classes)?.label || "تدرج مخصص";
}
