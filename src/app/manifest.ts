import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "مؤسسة التطوير والتنمية | D.I.F",
    short_name: "D.I.F",
    description:
      "Development and Investment Foundation — منصة متكاملة للمشاريع التنموية والإنسانية.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8faf5",
    theme_color: "#5c7622",
    orientation: "portrait-primary",
    lang: "ar",
    dir: "rtl",
    categories: ["business", "education", "social"],
    icons: [
      {
        src: "/Image/login.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/Image/login.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/Image/login.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
