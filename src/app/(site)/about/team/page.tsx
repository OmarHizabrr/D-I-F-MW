"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { Card } from "@/components/ui/Card";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";

export default function TeamPage() {
  const { team, sectionTitles, text, loading } = useSiteContent();
  const members = team.filter((m) => m.enabled).sort((a, b) => a.order - b.order);

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
        title={text(sectionTitles.teamTitle)}
        subtitle={text(sectionTitles.teamSubtitle)}
        backHref="/about"
        backLabel={text(sectionTitles.aboutTitle)}
        breadcrumbs={[
          { label: text(sectionTitles.aboutTitle), href: "/about" },
          { label: text(sectionTitles.teamTitle) },
        ]}
      />

      <div className="section-padding bg-background">
        <div className="container-dif">
          {members.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">لا يوجد أعضاء فريق حالياً</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <Card key={member.id} className="flex flex-col items-center p-6 text-center">
                  <UserAvatar name={text(member.name)} photoURL={member.imageUrl} size="xl" />
                  <h2 className="mt-4 text-lg font-bold">{text(member.name)}</h2>
                  <p className="mt-1 text-sm font-medium text-brand-green">{text(member.role)}</p>
                  {text(member.bio) && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {text(member.bio)}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
