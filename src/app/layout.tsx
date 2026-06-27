import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "مؤسسة التطوير والتنمية | D.I.F",
  description:
    "مؤسسة التطوير والتنمية — Development and Investment Foundation. منصة متكاملة للمشاريع التنموية والإنسانية.",
  applicationName: "D.I.F",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "D.I.F",
  },
  formatDetection: {
    telephone: true,
    email: true,
  },
  icons: {
    icon: "/Image/login.png",
    apple: "/Image/login.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#5c7622" },
    { media: "(prefers-color-scheme: dark)", color: "#3a4a1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${cairo.variable} h-full overflow-x-hidden`}>
      <body className="min-h-full flex w-full max-w-[100vw] flex-col overflow-x-hidden antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
