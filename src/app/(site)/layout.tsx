import { TopBar } from "@/components/layout/TopBar";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { CampaignBanner } from "@/components/site/CampaignBanner";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { HashScrollHandler } from "@/components/site/HashScrollHandler";
import { SkipLink } from "@/components/ui/SkipLink";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <HashScrollHandler />
      <CampaignBanner />
      <TopBar />
      <Navigation />
      <main id="main-content" className="w-full min-w-0 flex-1 overflow-x-hidden">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
