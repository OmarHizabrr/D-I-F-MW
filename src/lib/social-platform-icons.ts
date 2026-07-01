import { Camera, MessageCircle, Play, Share2, type LucideIcon } from "lucide-react";

const SOCIAL_PLATFORM_ICONS: Record<string, LucideIcon> = {
  facebook: Share2,
  twitter: MessageCircle,
  x: MessageCircle,
  youtube: Play,
  instagram: Camera,
  linkedin: Share2,
  whatsapp: MessageCircle,
};

export function getSocialPlatformIcon(platform: string): LucideIcon {
  return SOCIAL_PLATFORM_ICONS[platform.toLowerCase()] ?? Share2;
}
