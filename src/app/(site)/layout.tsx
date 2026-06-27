import { TopBar } from "@/components/layout/TopBar";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <Navigation />
      <main className="w-full min-w-0 flex-1 overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
}
