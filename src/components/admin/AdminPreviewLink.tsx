import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

type AdminPreviewLinkProps = {
  href: string;
  label?: string;
  size?: "sm" | "md";
};

export function AdminPreviewLink({
  href,
  label = "عرض في الموقع",
  size = "md",
}: AdminPreviewLinkProps) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <Button variant="outline" size={size === "sm" ? "sm" : "md"}>
        <ExternalLink className="h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
}
