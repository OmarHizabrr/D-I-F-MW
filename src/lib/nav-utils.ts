import type { LocaleCode, LocalizedString, NavChild, NavItem, ProgramItem } from "@/types/cms";
import { pickLocalized } from "@/types/cms";
import { normalizeSiteHref } from "@/lib/site-href";

export function normalizeNavHref(href: string): string {
  return normalizeSiteHref(href);
}

function normalizeNavChildren(children: NavChild[]): NavChild[] {
  return children.map((child) => ({ ...child, href: normalizeSiteHref(child.href) }));
}

export type NavLabels = {
  aboutOverview: LocalizedString;
  team: LocalizedString;
  faq: LocalizedString;
  ourWork: LocalizedString;
  allProjects: LocalizedString;
  successStories: LocalizedString;
  stories: LocalizedString;
  news: LocalizedString;
  events: LocalizedString;
  media: LocalizedString;
  volunteer: LocalizedString;
  contact: LocalizedString;
  shareStory: LocalizedString;
  resources: LocalizedString;
  transparency: LocalizedString;
  zakatCalculator: LocalizedString;
  waysToGive: LocalizedString;
  privacy: LocalizedString;
};

function programLinks(programs: ProgramItem[]): NavChild[] {
  return programs
    .filter((p) => p.enabled)
    .sort((a, b) => a.order - b.order)
    .map((p) => ({
      id: `projects-${p.id}`,
      label: p.title,
      href: `/projects?program=${p.id}`,
    }));
}

function injectProgramLinks(children: NavChild[], programs: ProgramItem[]): NavChild[] {
  const idx = children.findIndex(
    (c) => c.href === "/projects" || c.id === "projects-all" || c.id === "impact-all-projects"
  );
  if (idx < 0) return children;

  const links = programLinks(programs);
  if (!links.length) return children;

  return [...children.slice(0, idx + 1), ...links, ...children.slice(idx + 1)];
}

export function resolveNavChildren(
  item: NavItem,
  programs: ProgramItem[],
  labels: NavLabels
): NavChild[] {
  let children: NavChild[];

  if (item.children?.length) {
    children =
      item.id === "impact" || item.id === "projects"
        ? injectProgramLinks(item.children, programs)
        : item.children;
  } else if (item.id === "about") {
    children = [
      { id: "about-overview", label: labels.aboutOverview, href: "/about" },
      { id: "about-team", label: labels.team, href: "/about/team" },
      { id: "about-faq", label: labels.faq, href: "/faq" },
      { id: "about-transparency", label: labels.transparency, href: "/transparency" },
      { id: "about-privacy", label: labels.privacy, href: "/privacy" },
    ];
  } else if (item.id === "impact") {
    children = injectProgramLinks(
      [
        { id: "impact-our-work", label: labels.ourWork, href: "/our-work" },
        { id: "impact-all-projects", label: labels.allProjects, href: "/projects" },
        { id: "impact-success", label: labels.successStories, href: "/success-stories" },
        { id: "impact-stories", label: labels.stories, href: "/stories" },
      ],
      programs
    );
  } else if (item.id === "projects") {
    children = injectProgramLinks(
      [{ id: "projects-all", label: labels.allProjects, href: "/projects" }],
      programs
    );
  } else if (item.id === "newsEvents") {
    children = [
      { id: "news-events-news", label: labels.news, href: "/news" },
      { id: "news-events-events", label: labels.events, href: "/events" },
      { id: "news-events-media", label: labels.media, href: "/media" },
    ];
  } else if (item.id === "joinUs") {
    children = [
      { id: "join-volunteer", label: labels.volunteer, href: "/volunteer" },
      { id: "join-ways", label: labels.waysToGive, href: "/ways-to-give" },
      { id: "join-zakat", label: labels.zakatCalculator, href: "/zakat-calculator" },
      { id: "join-contact", label: labels.contact, href: "/contact" },
      { id: "join-share-story", label: labels.shareStory, href: "/share-testimonial" },
    ];
  } else if (item.id === "resources") {
    children = [
      { id: "resources-page", label: labels.resources, href: "/resources" },
      { id: "resources-transparency", label: labels.transparency, href: "/transparency" },
    ];
  } else {
    children = [];
  }

  return normalizeNavChildren(children);
}

export function navChildLabel(child: NavChild, locale: LocaleCode): string {
  return pickLocalized(child.label, locale);
}

export function navHasDropdown(item: NavItem, programs: ProgramItem[], labels: NavLabels): boolean {
  return resolveNavChildren(item, programs, labels).length > 0;
}

export type FooterLinkGroup = {
  id: string;
  title: LocalizedString;
  links: NavChild[];
};

export function buildFooterLinkGroups(
  navItems: NavItem[],
  programs: ProgramItem[],
  labels: NavLabels,
  selectedIds: string[]
): FooterLinkGroup[] {
  const enabled = navItems.filter((n) => n.enabled);
  const groups: FooterLinkGroup[] = [];

  for (const id of selectedIds) {
    if (id === "home") continue;
    const item = enabled.find((n) => n.id === id);
    if (!item) continue;

    const children = resolveNavChildren(item, programs, labels);
    groups.push({
      id: item.id,
      title: item.label,
      links:
        children.length > 0
          ? children
          : [{ id: `${item.id}-link`, label: item.label, href: normalizeSiteHref(item.href) }],
    });
  }

  return groups;
}

const LEGACY_FLAT_NAV_IDS = new Set([
  "home",
  "ourWork",
  "projects",
  "successStories",
  "news",
  "events",
  "stories",
  "volunteer",
  "faq",
  "media",
  "contact",
]);

export function footerUsesGroupedLinks(quickLinkIds: string[]): boolean {
  return quickLinkIds.some((id) => !LEGACY_FLAT_NAV_IDS.has(id));
}

const FOOTER_MAX_LINKS_PER_GROUP = 5;

/** يحدّ الروابط الطويلة (مثل برامج أثرنا) مع رابط «عرض الكل» */
export function capFooterGroupLinks(
  links: NavChild[],
  parentHref: string,
  viewAllLabel: LocalizedString
): NavChild[] {
  if (links.length <= FOOTER_MAX_LINKS_PER_GROUP) return links;
  return [
    ...links.slice(0, FOOTER_MAX_LINKS_PER_GROUP - 1),
    { id: `${parentHref}-view-all`, label: viewAllLabel, href: parentHref },
  ];
}
