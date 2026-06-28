"use client";

import dynamic from "next/dynamic";
import { HeroSection } from "./HeroSection";
import { StatsSection } from "./StatsSection";
import { TrustBadgesSection } from "./TrustBadgesSection";
import { ProgramsSection } from "./ProgramsSection";
import { OngoingProjectsSection } from "./OngoingProjectsSection";
import { SuccessStoriesSection } from "./SuccessStoriesSection";
import { OurWorkSection } from "./OurWorkSection";
import { HowWeWorkSection } from "./HowWeWorkSection";
import { WhyUsSection } from "./WhyUsSection";
import { EventsSection } from "./EventsSection";
import { LatestNewsSection } from "./LatestNewsSection";
import { VolunteerSection } from "./VolunteerSection";
import { PartnersSection } from "./PartnersSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FaqSection } from "./FaqSection";
import { LicensesSection } from "./LicensesSection";
import { DownloadsSection } from "./DownloadsSection";
import { NewsletterSection } from "./NewsletterSection";
import { DonateSection } from "./DonateSection";
import { ProjectsTableSection } from "./ProjectsTableSection";
import { LazySection } from "@/components/ui/LazySection";

const MediaGallerySection = dynamic(
  () => import("./MediaGallerySection").then((m) => ({ default: m.MediaGallerySection })),
  { loading: () => <div className="min-h-[16rem]" aria-hidden /> }
);

const ProjectMapSection = dynamic(
  () => import("./ProjectMapSection").then((m) => ({ default: m.ProjectMapSection })),
  { loading: () => <div className="min-h-[20rem]" aria-hidden /> }
);

export function HomePage() {
  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <HeroSection />
      <StatsSection />
      <TrustBadgesSection />
      <ProgramsSection />
      <OngoingProjectsSection />
      <LazySection minHeight="18rem">
        <SuccessStoriesSection />
      </LazySection>
      <LazySection minHeight="18rem">
        <OurWorkSection />
      </LazySection>
      <HowWeWorkSection />
      <WhyUsSection />
      <LazySection minHeight="16rem">
        <EventsSection />
      </LazySection>
      <LazySection minHeight="20rem">
        <MediaGallerySection />
      </LazySection>
      <LatestNewsSection />
      <LazySection minHeight="14rem">
        <VolunteerSection />
      </LazySection>
      <PartnersSection />
      <TestimonialsSection />
      <LazySection minHeight="14rem">
        <FaqSection />
      </LazySection>
      <LicensesSection />
      <LazySection minHeight="14rem">
        <DownloadsSection />
      </LazySection>
      <LazySection minHeight="22rem">
        <ProjectMapSection />
      </LazySection>
      <ProjectsTableSection />
      <DonateSection />
      <NewsletterSection />
    </div>
  );
}
