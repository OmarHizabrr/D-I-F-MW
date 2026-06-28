"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/types/cms";

type FaqAccordionProps = {
  items: FaqItem[];
  className?: string;
};

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  const { text } = useSiteContent();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  if (!items.length) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-border-subtle bg-surface"
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-start sm:px-5"
              aria-expanded={open}
            >
              <span className="font-semibold text-foreground">{text(item.question)}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                  open && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="border-t border-border-subtle px-4 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground sm:px-5">
                  {text(item.answer)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
