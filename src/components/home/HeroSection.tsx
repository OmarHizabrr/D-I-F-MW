"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { Button } from "@/components/ui/Button";
import { youTubeEmbedUrl } from "@/lib/firebase/storage";

export function HeroSection() {
  const { hero, text } = useSiteContent();
  const embedUrl = youTubeEmbedUrl(hero.youtubeUrl);

  return (
    <section id="home" className="relative flex min-h-[70dvh] items-center overflow-hidden sm:min-h-[80dvh] lg:min-h-[85vh]">
      {hero.backgroundImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(var(--hero-overlay), var(--hero-overlay)), url('${hero.backgroundImageUrl}')`,
          }}
        />
      ) : embedUrl ? (
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            src={`${embedUrl}?autoplay=1&mute=1&loop=1&controls=0&playlist=${embedUrl.split("/").pop()}`}
            className="pointer-events-none absolute inset-0 h-full w-[300%] max-w-none -translate-x-1/3 scale-150"
            allow="autoplay; encrypted-media"
            title="Hero video"
          />
          <div className="absolute inset-0 bg-[var(--hero-overlay)]" />
        </div>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(var(--hero-overlay), var(--hero-overlay)), url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221920%22 height=%221080%22%3E%3Cdefs%3E%3ClinearGradient id=%22g%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 stop-color=%22%235c7622%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%238b5e34%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%22url(%23g)%22 width=%221920%22 height=%221080%22/%3E%3C/svg%3E')",
          }}
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(155,184,72,0.15),transparent_60%)]" />

      <div className="container-dif relative z-10 py-12 text-center text-white sm:py-16 md:py-20">
        <h1 className="mx-auto max-w-4xl text-2xl font-bold leading-snug sm:text-3xl sm:leading-tight md:text-5xl lg:text-6xl">
          {text(hero.title)}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:mt-6 sm:text-base md:text-lg">
          {text(hero.subtitle)}
        </p>
        <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
          <Button size="lg" fullWidth className="sm:!w-auto sm:min-w-[200px]">
            {text(hero.ctaProjects)}
          </Button>
          <Button
            size="lg"
            variant="outline"
            fullWidth
            className="sm:!w-auto sm:min-w-[200px] !border-white !text-white hover:!bg-white/10"
          >
            {text(hero.ctaTrack)}
          </Button>
        </div>
      </div>
    </section>
  );
}
