"use client";

import { MessageCircle } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useLocale } from "@/context/LocaleContext";

export function WhatsAppFloat() {
  const { topbar, text } = useSiteContent();
  const { locale } = useLocale();

  if (!topbar.whatsAppEnabled || !topbar.whatsAppNumber) return null;

  const number = topbar.whatsAppNumber.replace(/\D/g, "");
  const message = encodeURIComponent(
    text(topbar.whatsAppMessage) ||
      (locale === "ar"
        ? "مرحباً، أود الاستفسار عن مشاريع المؤسسة"
        : "Hello, I would like to inquire about your projects")
  );
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 start-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] max-md:bottom-20"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
