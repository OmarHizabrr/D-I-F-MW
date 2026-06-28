"use client";

import { HeroSection } from "./HeroSection";
import { StatsSection } from "./StatsSection";
import { ProgramsSection } from "./ProgramsSection";
import { OngoingProjectsSection } from "./OngoingProjectsSection";
import { HowWeWorkSection } from "./HowWeWorkSection";
import { WhyUsSection } from "./WhyUsSection";
import { MediaGallerySection } from "./MediaGallerySection";
import { LatestNewsSection } from "./LatestNewsSection";
import { PartnersSection } from "./PartnersSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { LicensesSection } from "./LicensesSection";
import { ProjectMapSection } from "./ProjectMapSection";
import { NewsletterSection } from "./NewsletterSection";
import { DonateSection } from "./DonateSection";
import { ProjectsTableSection } from "./ProjectsTableSection";

export function HomePage() {
  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <HeroSection />
      <StatsSection />
      <ProgramsSection />
      <OngoingProjectsSection />
      <HowWeWorkSection />
      <WhyUsSection />
      <MediaGallerySection />
      <LatestNewsSection />
      <PartnersSection />
      <TestimonialsSection />
      <LicensesSection />
      <ProjectMapSection />
      <ProjectsTableSection />
      <DonateSection />
      <NewsletterSection />
    </div>
  );
}
