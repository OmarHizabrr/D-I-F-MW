"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { useLoading } from "@/context/LoadingContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { IconBox } from "@/components/ui/IconBox";

export function NewsletterSection() {
  const { t } = useLocale();
  const { withLoading } = useLoading();
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    await withLoading(async () => {
      await new Promise((r) => setTimeout(r, 1500));
      setEmail("");
    }, "save");
  }

  return (
    <section className="section-padding">
      <div className="container-dif">
        <Card className="mx-auto max-w-2xl overflow-hidden bg-gradient-to-br from-brand-green/10 to-brand-brown/10 text-center">
          <IconBox icon={Mail} size="lg" className="mx-auto mb-4" />
          <SectionHeader
            title={t.newsletter.title}
            subtitle={t.newsletter.subtitle}
            className="!mb-6"
          />
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder={t.newsletter.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" className="shrink-0">
              {t.newsletter.subscribe}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
