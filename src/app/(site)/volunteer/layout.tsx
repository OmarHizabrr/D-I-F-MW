import { Suspense, type ReactNode } from "react";

export default function VolunteerLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="section-padding text-center text-muted-foreground">جاري التحميل...</div>
      }
    >
      {children}
    </Suspense>
  );
}
