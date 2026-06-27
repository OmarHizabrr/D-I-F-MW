"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function NewsletterSection() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");

  return (
    <section className="section-padding">
      <div className="container-dif">
        <Card className="mx-auto max-w-2xl bg-gradient-to-br from-brand-green/10 to-brand-brown/10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green text-white">
            <Mail className="h-7 w-7" />
          </div>
          <SectionHeader
            title={t.newsletter.title}
            subtitle={t.newsletter.subtitle}
            className="!mb-6"
          />
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Input
              type="email"
              placeholder={t.newsletter.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
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
