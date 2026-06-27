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
