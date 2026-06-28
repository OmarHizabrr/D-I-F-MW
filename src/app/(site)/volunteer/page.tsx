"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Clock, MapPin } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";
import { useLoading } from "@/context/LoadingContext";
import { submitVolunteerApplication } from "@/services/volunteerService";

export default function VolunteerPage() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("opportunity") ?? "";
  const { volunteerOpportunities, sectionTitles, text, loading } = useSiteContent();
  const { withLoading } = useLoading();

  const items = volunteerOpportunities.filter((v) => v.enabled).sort((a, b) => a.order - b.order);

  const [opportunityId, setOpportunityId] = useState(preselectedId);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (preselectedId) setOpportunityId(preselectedId);
  }, [preselectedId]);

  const selected = items.find((o) => o.id === opportunityId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim() || !opportunityId) return;
    const opp = items.find((o) => o.id === opportunityId);
    await withLoading(async () => {
      await submitVolunteerApplication({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        opportunityId,
        opportunityTitle: opp ? text(opp.title) : opportunityId,
        message: message.trim(),
      });
      setName("");
      setEmail("");
      setPhone("");
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
        title={text(sectionTitles.volunteerPageTitle)}
        subtitle={text(sectionTitles.volunteerPageSubtitle)}
        breadcrumbs={[{ label: text(sectionTitles.volunteerPageTitle) }]}
      />
      <div className="section-padding bg-background">
        <div className="container-dif grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-bold">{text(sectionTitles.volunteer)}</h2>
            {items.length === 0 ? (
              <p className="text-muted-foreground">لا توجد فرص تطوع متاحة حالياً</p>
            ) : (
              items.map((item) => (
                <Card
                  key={item.id}
                  className={
                    opportunityId === item.id ? "ring-2 ring-brand-green/40" : undefined
                  }
                >
                  <CardContent className="p-5">
                    <CardTitle className="text-base">{text(item.title)}</CardTitle>
                    <p className="mt-2 text-sm text-muted-foreground">{text(item.description)}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {text(item.location) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {text(item.location)}
                        </span>
                      )}
                      {text(item.commitment) && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {text(sectionTitles.volunteerCommitment)}: {text(item.commitment)}
                        </span>
                      )}
                    </div>
                    {text(item.requirements) && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        <span className="font-semibold">
                          {text(sectionTitles.volunteerRequirements)}:
                        </span>{" "}
                        {text(item.requirements)}
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => setOpportunityId(item.id)}
                    >
                      {text(sectionTitles.volunteerApply)}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <Card className="p-6 sm:p-8">
            {sent ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <p className="text-lg font-semibold text-brand-green-dark dark:text-brand-green">
                  {text(sectionTitles.volunteerFormSuccess)}
                </p>
                <Button className="mt-6" variant="outline" onClick={() => setSent(false)}>
                  {text(sectionTitles.volunteerApply)}
                </Button>
              </div>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex w-full flex-col gap-1.5">
                  <label htmlFor="vol-opportunity" className="text-sm font-medium">
                    {text(sectionTitles.volunteer)}
                  </label>
                  <select
                    id="vol-opportunity"
                    value={opportunityId}
                    onChange={(e) => setOpportunityId(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-border bg-input-bg px-4 py-3 text-sm"
                  >
                    <option value="">—</option>
                    {items.map((o) => (
                      <option key={o.id} value={o.id}>
                        {text(o.title)}
                      </option>
                    ))}
                  </select>
                </div>
                {selected && (
                  <p className="text-xs text-muted-foreground">{text(selected.description)}</p>
                )}
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
                <Input
                  label="الهاتف (اختياري)"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="flex w-full flex-col gap-1.5">
                  <label htmlFor="vol-message" className="text-sm font-medium">
                    {text(sectionTitles.contactFormMessage)}
                  </label>
                  <textarea
                    id="vol-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-border bg-input-bg px-4 py-3 text-sm focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                  />
                </div>
                <Button type="submit" disabled={!opportunityId}>
                  {text(sectionTitles.volunteerApply)}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
