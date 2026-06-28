"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useLoading } from "@/context/LoadingContext";
import { subscribeNewsletter } from "@/services/newsletterService";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { IconBox } from "@/components/ui/IconBox";

export function NewsletterSection() {
  const { newsletter, text } = useSiteContent();
  const { withLoading } = useLoading();
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setFeedback(null);
    await withLoading(async () => {
      const result = await subscribeNewsletter(email.trim());
      if (result === "ok") {
        setEmail("");
        setFeedback(text(newsletter.successMessage));
      } else if (result === "duplicate") {
        setFeedback(text(newsletter.duplicateMessage));
      } else {
        setFeedback(text(newsletter.successMessage));
        setEmail("");
      }
    }, "save");
  }

  return (
    <section className="section-padding">
      <div className="container-dif">
        <Card className="mx-auto max-w-2xl overflow-hidden bg-gradient-to-br from-brand-green/10 to-brand-brown/10 text-center">
          <IconBox icon={Mail} size="lg" className="mx-auto mb-4" />
          <SectionHeader
            title={text(newsletter.title)}
            subtitle={text(newsletter.subtitle)}
            className="!mb-6"
          />
          {feedback && (
            <p className="mb-4 text-sm font-medium text-brand-green-dark dark:text-brand-green">
              {feedback}
            </p>
          )}
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder={text(newsletter.placeholder)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" className="shrink-0">
              {text(newsletter.buttonLabel)}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
