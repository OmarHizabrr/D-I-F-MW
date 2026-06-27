"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Share2 } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

export function Footer() {
  const { footer, topbar, navItems, sectionTitles, text } = useSiteContent();
  const links = navItems
    .filter((n) => n.enabled && footer.quickLinkIds.includes(n.id))
    .sort((a, b) => a.order - b.order);

  const socialLinks = topbar.socialLinks
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <footer
      id="contact"
      className="safe-bottom border-t border-border-subtle bg-brand-green-dark text-white"
    >
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
            <p className="text-sm leading-relaxed text-white/80">{text(footer.description)}</p>
          </div>

          <div>
            <h3 className="mb-4 font-bold">{text(sectionTitles.footerQuickLinks)}</h3>
            <ul className="space-y-2">
              {links.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="text-sm text-white/80 hover:text-white">
                    {text(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">{text(sectionTitles.footerContactInfo)}</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {text(footer.address)}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span dir="ltr">{topbar.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                {topbar.email}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">{text(sectionTitles.footerWorkingHours)}</h3>
            <p className="mb-4 flex items-start gap-2 text-sm text-white/80">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
              {text(footer.workingHours)}
            </p>
            <div className="flex gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-white/20"
                  aria-label={link.platform}
                >
                  <Share2 className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-white/70">
          {text(footer.rights)}
        </div>
      </div>
    </footer>
  );
}
