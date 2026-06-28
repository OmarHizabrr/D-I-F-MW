"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";
import { useLoading } from "@/context/LoadingContext";
import { submitContactMessage } from "@/services/contactService";

export default function ContactPage() {
  const { topbar, footer, sectionTitles, text, loading } = useSiteContent();
  const { withLoading } = useLoading();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    await withLoading(async () => {
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setName("");
      setEmail("");
      setMessage("");
      setSent(true);
    }, "save");
  }

  if (loading) {
    return (
      <div className="section-padding">
        <SitePageSkeleton />
      </div>
    );
  }

  return (
    <>
      <SitePageHeader
        title={text(sectionTitles.contactTitle)}
        subtitle={text(sectionTitles.contactSubtitle)}
        breadcrumbs={[{ label: text(sectionTitles.contactTitle) }]}
      />

      <div className="section-padding bg-background">
        <div className="container-dif grid gap-8 lg:grid-cols-2">
          <Card className="p-6 sm:p-8">
            <h2 className="mb-6 text-lg font-bold">{text(sectionTitles.footerContactInfo)}</h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                <span>{text(footer.address)}</span>
              </li>
              {footer.mapsUrl && (
                <li>
                  <a
                    href={footer.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-green hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {text(sectionTitles.contactMapsLink)}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-brand-green" />
                <a href={`tel:${topbar.phone}`} dir="ltr" className="hover:text-brand-green">
                  {topbar.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-brand-green" />
                <a href={`mailto:${topbar.email}`} className="hover:text-brand-green">
                  {topbar.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                <span>{text(footer.workingHours)}</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 sm:p-8">
            {sent ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <p className="text-lg font-semibold text-brand-green-dark dark:text-brand-green">
                  {text(sectionTitles.contactFormSuccess)}
                </p>
                <Button className="mt-6" variant="outline" onClick={() => setSent(false)}>
                  {text(sectionTitles.contactFormSubmit)}
                </Button>
              </div>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <Input
                  label={text(sectionTitles.contactFormName)}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label={text(sectionTitles.contactFormEmail)}
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="flex w-full flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
                    {text(sectionTitles.contactFormMessage)}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-border bg-input-bg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  {text(sectionTitles.contactFormSubmit)}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
