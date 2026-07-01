"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import {
  saveProjectSubItem,
  deleteProjectSubItem,
} from "@/services/projectManagementService";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  PROJECT_SUBCOLLECTIONS,
  REPORT_TYPE_LABELS,
  type ProjectReport,
  type ProjectContract,
  type ProjectInvoice,
  type ReportType,
} from "@/types/project-management";
import type { UserMeta } from "@/services/firestoreApi";

type AdminProjectAttachmentsTabProps = {
  projectId: string;
  reports: ProjectReport[];
  contracts: ProjectContract[];
  invoices: ProjectInvoice[];
  userMeta: UserMeta | null;
  onReload: () => Promise<void>;
};

export function AdminProjectAttachmentsTab({
  projectId,
  reports,
  contracts,
  invoices,
  userMeta,
  onReload,
}: AdminProjectAttachmentsTabProps) {
  const [saving, setSaving] = useState(false);
  const [newReportTitle, setNewReportTitle] = useState("");
  const [newReportType, setNewReportType] = useState<ReportType>("interim");
  const [newContractNumber, setNewContractNumber] = useState("");
  const [newInvoiceNumber, setNewInvoiceNumber] = useState("");
  const [newInvoiceSupplier, setNewInvoiceSupplier] = useState("");
  const [newInvoiceAmount, setNewInvoiceAmount] = useState(0);

  const [reportDrafts, setReportDrafts] = useState<Record<string, ProjectReport>>({});
  const [contractDrafts, setContractDrafts] = useState<Record<string, ProjectContract>>({});
  const [invoiceDrafts, setInvoiceDrafts] = useState<Record<string, ProjectInvoice>>({});

  function reportDraft(report: ProjectReport) {
    return reportDrafts[report.id] ?? report;
  }

  function contractDraft(contract: ProjectContract) {
    return contractDrafts[contract.id] ?? contract;
  }

  function invoiceDraft(invoice: ProjectInvoice) {
    return invoiceDrafts[invoice.id] ?? invoice;
  }

  async function saveReport(report: ProjectReport) {
    if (!userMeta) return;
    setSaving(true);
    try {
      await saveProjectSubItem(
        projectId,
        PROJECT_SUBCOLLECTIONS.reports,
        report,
        userMeta,
        "report"
      );
      setReportDrafts((prev) => {
        const next = { ...prev };
        delete next[report.id];
        return next;
      });
      await onReload();
    } finally {
      setSaving(false);
    }
  }

  async function saveContract(contract: ProjectContract) {
    if (!userMeta) return;
    setSaving(true);
    try {
      await saveProjectSubItem(
        projectId,
        PROJECT_SUBCOLLECTIONS.contracts,
        contract,
        userMeta,
        "contract"
      );
      setContractDrafts((prev) => {
        const next = { ...prev };
        delete next[contract.id];
        return next;
      });
      await onReload();
    } finally {
      setSaving(false);
    }
  }

  async function saveInvoice(invoice: ProjectInvoice) {
    if (!userMeta) return;
    setSaving(true);
    try {
      await saveProjectSubItem(
        projectId,
        PROJECT_SUBCOLLECTIONS.invoices,
        invoice,
        userMeta,
        "invoice"
      );
      setInvoiceDrafts((prev) => {
        const next = { ...prev };
        delete next[invoice.id];
        return next;
      });
      await onReload();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    collection:
      | typeof PROJECT_SUBCOLLECTIONS.reports
      | typeof PROJECT_SUBCOLLECTIONS.contracts
      | typeof PROJECT_SUBCOLLECTIONS.invoices,
    id: string,
    label: string
  ) {
    if (!userMeta || !confirm(`حذف ${label}؟`)) return;
    setSaving(true);
    try {
      await deleteProjectSubItem(projectId, collection, id);
      await onReload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-10">
      <p className="text-sm text-muted-foreground">
        ارفع التقارير والعقود والفواتير والمستندات في أي وقت — بدون حدود. تظهر في بوابة
        المتبرع ويمكن نشر التقارير على الموقع العام.
      </p>

      <section>
        <h3 className="mb-3 font-semibold">التقارير</h3>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <Input
            label="عنوان التقرير"
            value={newReportTitle}
            onChange={(e) => setNewReportTitle(e.target.value)}
            placeholder="التقرير المرحلي — يناير"
          />
          <Select
            label="نوع التقرير"
            value={newReportType}
            onChange={(v) => setNewReportType(v as ReportType)}
            options={Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />
        </div>
        <FileUploadField
          label="رفع تقرير PDF"
          value=""
          folder={`projects/${projectId}/reports`}
          accept=".pdf,application/pdf"
          onChange={async (url) => {
            if (!url || !userMeta) return;
            await saveProjectSubItem(
              projectId,
              PROJECT_SUBCOLLECTIONS.reports,
              {
                title: newReportTitle.trim() || "تقرير",
                reportType: newReportType,
                file: url,
                uploadedBy: userMeta.uid,
              },
              userMeta,
              "report"
            );
            setNewReportTitle("");
            await onReload();
          }}
        />
        <div className="mt-4 space-y-3">
          {reports.map((report) => {
            const draft = reportDraft(report);
            return (
              <Card key={report.id} padding="md" className="space-y-3">
                <Input
                  label="العنوان"
                  value={draft.title}
                  onChange={(e) =>
                    setReportDrafts((prev) => ({
                      ...prev,
                      [report.id]: { ...draft, title: e.target.value },
                    }))
                  }
                />
                <Select
                  label="النوع"
                  value={draft.reportType}
                  onChange={(v) =>
                    setReportDrafts((prev) => ({
                      ...prev,
                      [report.id]: { ...draft, reportType: v as ReportType },
                    }))
                  }
                  options={Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" loading={saving} onClick={() => void saveReport(draft)}>
                    حفظ
                  </Button>
                  {draft.file && (
                    <a
                      href={draft.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-brand-green hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      معاينة
                    </a>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    loading={saving}
                    onClick={() =>
                      void handleDelete(PROJECT_SUBCOLLECTIONS.reports, report.id, "التقرير")
                    }
                  >
                    حذف
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-semibold">عقود التنفيذ</h3>
        <Input
          label="رقم العقد (للملف الجديد)"
          value={newContractNumber}
          onChange={(e) => setNewContractNumber(e.target.value)}
          className="mb-3"
          placeholder="C-2026-001"
        />
        <FileUploadField
          label="رفع عقد PDF"
          value=""
          folder={`projects/${projectId}/contracts`}
          accept=".pdf,application/pdf"
          onChange={async (url) => {
            if (!url || !userMeta) return;
            await saveProjectSubItem(
              projectId,
              PROJECT_SUBCOLLECTIONS.contracts,
              {
                contractNumber: newContractNumber.trim() || `C-${Date.now()}`,
                file: url,
                signedAt: new Date().toISOString().slice(0, 10),
                uploadedBy: userMeta.uid,
              },
              userMeta,
              "contract"
            );
            setNewContractNumber("");
            await onReload();
          }}
        />
        <div className="mt-4 space-y-3">
          {contracts.map((contract) => {
            const draft = contractDraft(contract);
            return (
              <Card key={contract.id} padding="md" className="space-y-3">
                <Input
                  label="رقم العقد"
                  value={draft.contractNumber}
                  onChange={(e) =>
                    setContractDrafts((prev) => ({
                      ...prev,
                      [contract.id]: { ...draft, contractNumber: e.target.value },
                    }))
                  }
                />
                <Input
                  label="تاريخ التوقيع"
                  type="date"
                  dir="ltr"
                  value={draft.signedAt}
                  onChange={(e) =>
                    setContractDrafts((prev) => ({
                      ...prev,
                      [contract.id]: { ...draft, signedAt: e.target.value },
                    }))
                  }
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" loading={saving} onClick={() => void saveContract(draft)}>
                    حفظ
                  </Button>
                  {draft.file && (
                    <a
                      href={draft.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-brand-green hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      معاينة
                    </a>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    loading={saving}
                    onClick={() =>
                      void handleDelete(PROJECT_SUBCOLLECTIONS.contracts, contract.id, "العقد")
                    }
                  >
                    حذف
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-semibold">الفواتير</h3>
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <Input
            label="رقم الفاتورة"
            value={newInvoiceNumber}
            onChange={(e) => setNewInvoiceNumber(e.target.value)}
            placeholder="INV-001"
          />
          <Input
            label="المورد"
            value={newInvoiceSupplier}
            onChange={(e) => setNewInvoiceSupplier(e.target.value)}
          />
          <Input
            label="المبلغ"
            type="number"
            dir="ltr"
            value={newInvoiceAmount}
            onChange={(e) => setNewInvoiceAmount(Number(e.target.value))}
          />
        </div>
        <FileUploadField
          label="رفع فاتورة PDF"
          value=""
          folder={`projects/${projectId}/invoices`}
          accept=".pdf,application/pdf"
          onChange={async (url) => {
            if (!url || !userMeta) return;
            await saveProjectSubItem(
              projectId,
              PROJECT_SUBCOLLECTIONS.invoices,
              {
                invoiceNumber: newInvoiceNumber.trim() || `INV-${Date.now()}`,
                amount: newInvoiceAmount,
                supplier: newInvoiceSupplier.trim(),
                file: url,
                date: new Date().toISOString().slice(0, 10),
              },
              userMeta,
              "invoice"
            );
            setNewInvoiceNumber("");
            setNewInvoiceSupplier("");
            setNewInvoiceAmount(0);
            await onReload();
          }}
        />
        <div className="mt-4 space-y-3">
          {invoices.map((invoice) => {
            const draft = invoiceDraft(invoice);
            return (
              <Card key={invoice.id} padding="md" className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="رقم الفاتورة"
                    value={draft.invoiceNumber}
                    onChange={(e) =>
                      setInvoiceDrafts((prev) => ({
                        ...prev,
                        [invoice.id]: { ...draft, invoiceNumber: e.target.value },
                      }))
                    }
                  />
                  <Input
                    label="المورد"
                    value={draft.supplier}
                    onChange={(e) =>
                      setInvoiceDrafts((prev) => ({
                        ...prev,
                        [invoice.id]: { ...draft, supplier: e.target.value },
                      }))
                    }
                  />
                  <Input
                    label="المبلغ"
                    type="number"
                    dir="ltr"
                    value={draft.amount}
                    onChange={(e) =>
                      setInvoiceDrafts((prev) => ({
                        ...prev,
                        [invoice.id]: { ...draft, amount: Number(e.target.value) },
                      }))
                    }
                  />
                  <Input
                    label="التاريخ"
                    type="date"
                    dir="ltr"
                    value={draft.date}
                    onChange={(e) =>
                      setInvoiceDrafts((prev) => ({
                        ...prev,
                        [invoice.id]: { ...draft, date: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" loading={saving} onClick={() => void saveInvoice(draft)}>
                    حفظ
                  </Button>
                  {draft.file && (
                    <a
                      href={draft.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-brand-green hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      معاينة
                    </a>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    loading={saving}
                    onClick={() =>
                      void handleDelete(PROJECT_SUBCOLLECTIONS.invoices, invoice.id, "الفاتورة")
                    }
                  >
                    حذف
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
