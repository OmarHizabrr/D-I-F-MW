"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { normalizeSiteHref } from "@/lib/site-href";

type SiteLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export function SiteLink({ href, ...props }: SiteLinkProps) {
  return <Link href={normalizeSiteHref(href)} {...props} />;
}
