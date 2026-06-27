import {
  HardHat,
  Droplets,
  Landmark,
  School,
  Users,
  Globe,
  BookOpen,
  HeartPulse,
  HandHeart,
  LifeBuoy,
  Sprout,
  Newspaper,
  Map,
  User,
  Building2,
  Image as ImageIcon,
  Play,
  PartyPopper,
  MapPin,
  ClipboardList,
  CheckCircle,
  FileCheck,
  Shield,
  Eye,
  FileText,
  Award,
  Stamp,
  type LucideIcon,
} from "lucide-react";

export type StatIconKey =
  | "projects"
  | "wells"
  | "mosques"
  | "schools"
  | "beneficiaries"
  | "countries";

export type ProgramIconKey =
  | "mosques"
  | "wells"
  | "education"
  | "health"
  | "orphans"
  | "relief"
  | "community";

export const statIcons: Record<StatIconKey, LucideIcon> = {
  projects: HardHat,
  wells: Droplets,
  mosques: Landmark,
  schools: School,
  beneficiaries: Users,
  countries: Globe,
};

export const programIcons: Record<ProgramIconKey, LucideIcon> = {
  mosques: Landmark,
  wells: Droplets,
  education: BookOpen,
  health: HeartPulse,
  orphans: HandHeart,
  relief: LifeBuoy,
  community: Sprout,
};

export const sectionIcons = {
  news: Newspaper,
  project: Building2,
  map: Map,
  user: User,
  mediaPhoto: ImageIcon,
  mediaVideo: Play,
  mediaOpening: PartyPopper,
  mediaVisit: MapPin,
} as const;

export type MediaIconKey = keyof typeof sectionIcons;

export const howWeWorkIcons: Record<string, LucideIcon> = {
  study: ClipboardList,
  approve: CheckCircle,
  execute: HardHat,
  report: FileCheck,
};

export const whyUsIcons: Record<string, LucideIcon> = {
  transparency: Shield,
  followUp: Eye,
  reports: FileText,
  team: Users,
  documented: CheckCircle,
  quality: Award,
};

export const licenseIcons: Record<string, LucideIcon> = {
  registration: FileText,
  licenses: Stamp,
  endorsements: Award,
  annualReports: BookOpen,
};

const mediaGradients: Record<string, string> = {
  photo: "from-emerald-600/80 to-emerald-800/90",
  video: "from-sky-600/80 to-sky-800/90",
  opening: "from-amber-600/80 to-amber-800/90",
  visit: "from-rose-600/80 to-rose-800/90",
};

export function mediaGradient(type: string, index = 0): string {
  const keys = Object.keys(mediaGradients);
  return mediaGradients[type] || mediaGradients[keys[index % keys.length]];
}
