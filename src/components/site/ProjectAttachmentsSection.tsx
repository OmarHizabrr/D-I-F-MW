"use client";

import { ExternalLink, FileText } from "lucide-react";
import {
  getAttachmentKindLabel,
  type ProjectAttachmentItem,
} from "@/lib/project-attachments";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type ProjectAttachmentsSectionProps = {
  attachments: ProjectAttachmentItem[];
  title?: string;
  downloadLabel?: string;
  isNew?: (date?: string) => boolean;
};

function formatFileDate(iso?: string) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function ProjectAttachmentsSection({
  attachments,
  title = "الملفات المرفقة",
  downloadLabel = "تحميل الملف",
  isNew,
}: ProjectAttachmentsSectionProps) {
  if (attachments.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <FileText className="h-5 w-5 text-brand-green" />
        {title}
        <span className="text-sm font-normal text-muted-foreground">({attachments.length})</span>
      </h2>
      <div className="space-y-3">
        {attachments.map((item) => {
          const showNew = isNew?.(item.date);
          return (
            <Card key={`${item.kind}-${item.id}`} padding="md">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{getAttachmentKindLabel(item.kind)}</Badge>
                    {showNew && <Badge variant="default">جديد</Badge>}
                  </div>
                  <p className="mt-2 font-semibold">{item.title}</p>
                  {item.subtitle && (
                    <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>
                  )}
                  {item.date && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatFileDate(item.date)}
                    </p>
                  )}
                </div>
                <a
                  href={item.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-green hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  {downloadLabel}
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
