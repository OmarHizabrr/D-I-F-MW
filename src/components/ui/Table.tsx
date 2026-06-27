"use client";

import { useRef } from "react";
import { Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { useLocale } from "@/context/LocaleContext";

export type TableColumn<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
};

export interface TableProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  title?: string;
  printable?: boolean;
  className?: string;
  emptyMessage?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  title,
  printable = true,
  className,
  emptyMessage,
}: TableProps<T>) {
  const { t } = useLocale();
  const printRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !printRef.current) return;

    const styles = `
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; direction: ${document.documentElement.dir}; }
        h1 { font-size: 20px; margin-bottom: 16px; color: #5c7622; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #d4dfc4; padding: 10px 12px; text-align: start; font-size: 13px; }
        th { background: #f8faf5; font-weight: 600; }
        tr:nth-child(even) { background: #fafcf7; }
      </style>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head><title>${title || "D.I.F Table"}</title>${styles}</head>
        <body>
          ${title ? `<h1>${title}</h1>` : ""}
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  function getCellValue(row: T, col: TableColumn<T>, index: number) {
    if (col.render) return col.render(row, index);
    return String(row[col.key as keyof T] ?? "");
  }

  return (
    <div className={cn("w-full", className)}>
      {printable && (
        <div className="no-print mb-4 flex justify-end">
          <Button variant="secondary" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            {t.common.print}
          </Button>
        </div>
      )}

      <div ref={printRef} className="dif-print-area overflow-x-auto rounded-xl border border-border-subtle">
        {title && (
          <h2 className="no-print mb-4 text-lg font-bold text-brand-green-dark dark:text-brand-green">
            {title}
          </h2>
        )}
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-border-subtle/50">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    "px-4 py-3 text-start font-semibold text-foreground",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {emptyMessage || t.common.noResults}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-border-subtle transition-colors hover:bg-border-subtle/30"
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className={cn("px-4 py-3", col.className)}>
                      {getCellValue(row, col, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
