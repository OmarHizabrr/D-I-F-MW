"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Share2, MessageCircle, Play, Camera } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

const socialLinks = [
  { icon: Share2, href: "#" },
  { icon: MessageCircle, href: "#" },
  { icon: Play, href: "#" },
  { icon: Camera, href: "#" },
];

export function Footer() {
  const { t } = useLocale();
  const navKeys = ["home", "about", "projects", "programs", "news", "contact"] as const;

  return (
    <footer id="contact" className="safe-bottom border-t border-border-subtle bg-brand-green-dark text-white">
      <div className="container-dif section-padding !pb-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Image
                src="/Image/login.png"
                alt="D.I.F"
                width={56}
                height={56}
                className="rounded-full bg-white p-1"
              />
              <div>
                <p className="font-bold">D.I.F</p>
                <p className="text-xs text-white/70">EST: 10/15</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/80">{t.footer.description}</p>
          </div>

          <div>
            <h3 className="mb-4 font-bold">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              {navKeys.map((key) => (
                <li key={key}>
                  <Link href={`#${key}`} className="text-sm text-white/80 hover:text-white">
                    {t.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">{t.footer.contactInfo}</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {t.footer.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span dir="ltr">{t.topBar.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                {t.topBar.email}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">{t.footer.workingHours}</h3>
            <p className="mb-4 flex items-start gap-2 text-sm text-white/80">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
              {t.footer.hours}
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-white/20"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-white/70">
          {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
