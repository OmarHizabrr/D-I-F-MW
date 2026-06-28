import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://difmw.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/about/team",
    "/projects",
    "/our-work",
    "/success-stories",
    "/news",
    "/events",
    "/media",
    "/stories",
    "/volunteer",
    "/faq",
    "/resources",
    "/contact",
    "/zakat-calculator",
    "/transparency",
    "/ways-to-give",
    "/privacy",
    "/share-testimonial",
  ];

  const now = new Date();
  return staticRoutes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.includes("zakat") || path.includes("ways-to-give") ? 0.9 : 0.7,
  }));
}
