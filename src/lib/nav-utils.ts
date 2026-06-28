import type { LocaleCode, LocalizedString, NavChild, NavItem, ProgramItem } from "@/types/cms";
import { pickLocalized } from "@/types/cms";

type NavLabels = {
  team: LocalizedString;
  allProjects: LocalizedString;
  aboutOverview: LocalizedString;
};

export function resolveNavChildren(
  item: NavItem,
  programs: ProgramItem[],
  labels: NavLabels
): NavChild[] {
  if (item.children?.length) {
    return item.children;
  }

  if (item.id === "about") {
    return [
      { id: "about-overview", label: labels.aboutOverview, href: "/about" },
      { id: "about-team", label: labels.team, href: "/about/team" },
    ];
  }

  if (item.id === "projects") {
    const programLinks = programs
      .filter((p) => p.enabled)
      .sort((a, b) => a.order - b.order)
      .map((p) => ({
        id: `projects-${p.id}`,
        label: p.title,
        href: `/projects?program=${p.id}`,
      }));

    return [{ id: "projects-all", label: labels.allProjects, href: "/projects" }, ...programLinks];
  }

  return [];
}

export function navChildLabel(child: NavChild, locale: LocaleCode): string {
  return pickLocalized(child.label, locale);
}
