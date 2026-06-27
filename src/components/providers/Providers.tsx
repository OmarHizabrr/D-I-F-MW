"use client";

import { LocaleProvider } from "@/context/LocaleContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { SiteContentProvider } from "@/context/SiteContentContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocaleProvider>
          <LoadingProvider>
            <SiteContentProvider>{children}</SiteContentProvider>
          </LoadingProvider>
        </LocaleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
