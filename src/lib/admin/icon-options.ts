import type { LucideIcon } from "lucide-react";
import {
  statIcons,
  programIcons,
  howWeWorkIcons,
  whyUsIcons,
  licenseIcons,
  type StatIconKey,
  type ProgramIconKey,
} from "@/lib/icons";

export type IconOption = {
  key: string;
  label: string;
  icon: LucideIcon;
};

const statLabels: Record<StatIconKey, string> = {
  projects: "مشاريع / إنشاءات",
  wells: "آبار مياه",
  mosques: "مساجد",
  schools: "مدارس / تعليم",
  beneficiaries: "مستفيدون",
  countries: "دول",
};

const programLabels: Record<ProgramIconKey, string> = {
  mosques: "مساجد",
  wells: "آبار",
  education: "تعليم",
  health: "صحة",
  orphans: "أيتام",
  relief: "إغاثة",
  community: "مجتمع",
};

const howWeWorkLabels: Record<string, string> = {
  study: "دراسة وتخطيط",
  approve: "اعتماد",
  execute: "تنفيذ",
  report: "تقارير",
};

const whyUsLabels: Record<string, string> = {
  transparency: "شفافية",
  followUp: "متابعة",
  reports: "تقارير",
  team: "فريق",
  documented: "موثّق",
  quality: "جودة",
};

const licenseLabels: Record<string, string> = {
  registration: "سجل / تسجيل",
  licenses: "تراخيص",
  endorsements: "اعتمادات",
  annualReports: "تقارير سنوية",
};

function toOptions(
  icons: Record<string, LucideIcon>,
  labels: Record<string, string>
): IconOption[] {
  return Object.entries(icons).map(([key, icon]) => ({
    key,
    label: labels[key] || key,
    icon,
  }));
}

export const statIconOptions = toOptions(statIcons, statLabels);
export const programIconOptions = toOptions(programIcons, programLabels);
export const howWeWorkIconOptions = toOptions(howWeWorkIcons, howWeWorkLabels);
export const whyUsIconOptions = toOptions(whyUsIcons, whyUsLabels);
export const licenseIconOptions = toOptions(licenseIcons, licenseLabels);

export function getIconOptionLabel(options: IconOption[], key: string) {
  return options.find((o) => o.key === key)?.label || key;
}
