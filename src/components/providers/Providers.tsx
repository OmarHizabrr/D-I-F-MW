"use client";

import { LocaleProvider } from "@/context/LocaleContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { ThemeProvider } from "@/context/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <LoadingProvider>{children}</LoadingProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
