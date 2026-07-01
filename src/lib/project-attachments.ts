import {
  REPORT_TYPE_LABELS,
  type ProjectContract,
  type ProjectInvoice,
  type ProjectReport,
  type ReportType,
} from "@/types/project-management";

export type ProjectAttachmentKind = "report" | "contract" | "invoice";

export type ProjectAttachmentItem = {
  id: string;
  kind: ProjectAttachmentKind;
  title: string;
  subtitle?: string;
  file: string;
  date?: string;
  reportType?: ReportType;
};

const KIND_LABELS: Record<ProjectAttachmentKind, string> = {
  report: "تقرير",
  contract: "عقد تنفيذ",
  invoice: "فاتورة",
};

export function getAttachmentKindLabel(kind: ProjectAttachmentKind): string {
  return KIND_LABELS[kind];
}

export function buildProjectAttachments(
  reports: ProjectReport[],
  contracts: ProjectContract[],
  invoices: ProjectInvoice[]
): ProjectAttachmentItem[] {
  const items: ProjectAttachmentItem[] = [
    ...reports
      .filter((r) => r.file)
      .map((r) => ({
        id: r.id,
        kind: "report" as const,
        title: r.title,
        subtitle: REPORT_TYPE_LABELS[r.reportType],
        file: r.file,
        date: r.uploadedAt,
        reportType: r.reportType,
      })),
    ...contracts
      .filter((c) => c.file)
      .map((c) => ({
        id: c.id,
        kind: "contract" as const,
        title: c.contractNumber || "عقد تنفيذ",
        subtitle: "عقد تنفيذ",
        file: c.file,
        date: c.signedAt,
      })),
    ...invoices
      .filter((i) => i.file)
      .map((i) => ({
        id: i.id,
        kind: "invoice" as const,
        title: i.invoiceNumber || "فاتورة",
        subtitle: i.supplier
          ? `${i.supplier}${i.amount ? ` · ${i.amount.toLocaleString()}` : ""}`
          : "فاتورة",
        file: i.file,
        date: i.date,
      })),
  ];

  return items.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}
