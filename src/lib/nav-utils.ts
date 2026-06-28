import type { LocaleCode, LocalizedString, NavChild, NavItem, ProgramItem } from "@/types/cms";
import { pickLocalized } from "@/types/cms";

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
  if (item.children?.length) {
    if (item.id === "impact" || item.id === "projects") {
      return injectProgramLinks(item.children, programs);
    }
    return item.children;
  }

  if (item.id === "about") {
    return [
      { id: "about-overview", label: labels.aboutOverview, href: "/about" },
      { id: "about-team", label: labels.team, href: "/about/team" },
      { id: "about-faq", label: labels.faq, href: "/faq" },
    ];
  }

  if (item.id === "impact") {
    return injectProgramLinks(
      [
        { id: "impact-our-work", label: labels.ourWork, href: "/our-work" },
        { id: "impact-all-projects", label: labels.allProjects, href: "/projects" },
        { id: "impact-success", label: labels.successStories, href: "/success-stories" },
        { id: "impact-stories", label: labels.stories, href: "/stories" },
      ],
      programs
    );
  }

  if (item.id === "projects") {
    return injectProgramLinks(
      [{ id: "projects-all", label: labels.allProjects, href: "/projects" }],
      programs
    );
  }

  if (item.id === "newsEvents") {
    return [
      { id: "news-events-news", label: labels.news, href: "/news" },
      { id: "news-events-events", label: labels.events, href: "/events" },
      { id: "news-events-media", label: labels.media, href: "/media" },
    ];
  }

  if (item.id === "joinUs") {
    return [
      { id: "join-volunteer", label: labels.volunteer, href: "/volunteer" },
      { id: "join-contact", label: labels.contact, href: "/contact" },
      { id: "join-share-story", label: labels.shareStory, href: "/share-testimonial" },
    ];
  }

  if (item.id === "resources") {
    return [];
  }

  return [];
}

export function navChildLabel(child: NavChild, locale: LocaleCode): string {
  return pickLocalized(child.label, locale);
}

export function navHasDropdown(item: NavItem, programs: ProgramItem[], labels: NavLabels): boolean {
  return resolveNavChildren(item, programs, labels).length > 0;
}
