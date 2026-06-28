"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useLocale } from "@/context/LocaleContext";
import { Dialog } from "@/components/ui/Dialog";
import { pickLocalized, type LocaleCode } from "@/types/cms";
import ar from "@/i18n/locales/ar";
import en from "@/i18n/locales/en";
import ny from "@/i18n/locales/ny";

type SearchResult = {
  id: string;
  title: string;
  href: string;
  type: string;
};

const labels = { ar, en, ny };

export function SiteSearchButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { projects, news, successStories, faq, programs } = useSiteContent();
  const { locale: loc } = useLocale();
  const L = labels[loc as LocaleCode] ?? ar;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [] as SearchResult[];

    const pick = (value: { ar: string; en: string; ny: string }) =>
      pickLocalized(value, loc as LocaleCode).toLowerCase();

    const items: SearchResult[] = [];

    for (const p of projects.filter((x) => x.enabled)) {
      if (pick(p.name).includes(q) || pick(p.country).includes(q)) {
        items.push({
          id: `p-${p.id}`,
          title: pickLocalized(p.name, loc as LocaleCode),
          href: `/projects/${p.id}`,
          type: L.nav.projects,
        });
      }
    }
    for (const n of news.filter((x) => x.enabled)) {
      if (pick(n.title).includes(q) || pick(n.excerpt).includes(q)) {
        items.push({
          id: `n-${n.id}`,
          title: pickLocalized(n.title, loc as LocaleCode),
          href: `/news/${n.id}`,
          type: L.nav.news,
        });
      }
    }
    for (const s of successStories.filter((x) => x.enabled)) {
      if (pick(s.title).includes(q)) {
        items.push({
          id: `s-${s.id}`,
          title: pickLocalized(s.title, loc as LocaleCode),
          href: `/success-stories/${s.id}`,
          type: L.nav.successStories,
        });
      }
    }
    for (const f of faq.filter((x) => x.enabled)) {
      if (pick(f.question).includes(q)) {
        items.push({
          id: `f-${f.id}`,
          title: pickLocalized(f.question, loc as LocaleCode),
          href: "/faq",
          type: L.nav.faq,
        });
      }
    }
    for (const pr of programs.filter((x) => x.enabled)) {
      if (pick(pr.title).includes(q)) {
        items.push({
          id: `pr-${pr.id}`,
          title: pickLocalized(pr.title, loc as LocaleCode),
          href: `/projects?program=${pr.id}`,
          type: L.nav.programs,
        });
      }
    }

    return items.slice(0, 12);
  }, [query, projects, news, successStories, faq, programs, loc, L]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        aria-label={L.search.title}
      >
        <Search className="h-5 w-5" />
      </button>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setQuery("");
        }}
        title={L.search.title}
        size="md"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={L.search.placeholder}
            className="w-full rounded-2xl border border-border bg-input-bg py-3 pe-10 ps-10 text-sm focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {query.length < 2 ? (
          <p className="mt-4 text-sm text-muted-foreground">{L.search.hint}</p>
        ) : results.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {L.search.noResults} «{query}»
          </p>
        ) : (
          <ul className="mt-4 max-h-64 space-y-1 overflow-y-auto">
            {results.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-brand-green/10"
                >
                  <span className="font-medium">{item.title}</span>
                  <span className="ms-2 text-xs text-muted-foreground">{item.type}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Dialog>
    </>
  );
}
