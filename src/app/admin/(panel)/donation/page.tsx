"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { getDefaultDonation } from "@/data/default-content";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DonationIntentsPanel } from "@/components/admin/DonationIntentsPanel";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import type { DonationContent, DonationPaymentMode } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";
import { cn } from "@/lib/utils";

const api = FirestoreApi.Api;

function mergeDonation(doc: Record<string, unknown> | null): DonationContent {
  const defaults = getDefaultDonation();
  if (!doc) return defaults;
  const d = doc as DonationContent;
  const presetImpacts =
    Array.isArray(d.presetImpacts) && d.presetImpacts.length
      ? d.presetImpacts
      : defaults.presetImpacts;
  return {
    ...defaults,
    ...d,
    presetAmounts: Array.isArray(d.presetAmounts) ? d.presetAmounts : defaults.presetAmounts,
    presetImpacts,
  };
}

export default function AdminDonationPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Spinner size="lg" /></div>}>
      <AdminDonationContent />
    </Suspense>
  );
}

function AdminDonationContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"settings" | "intents">("settings");
  const [data, setData] = useState<DonationContent>(getDefaultDonation());
  const [amountsText, setAmountsText] = useState("10, 25, 50, 100");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "intents") setTab("intents");
  }, [searchParams]);

  useEffect(() => {
    async function load() {
      try {
        const doc = await api.getData(api.getDonationDoc());
        const merged = mergeDonation(doc as Record<string, unknown> | null);
        setData(merged);
        setAmountsText(merged.presetAmounts.join(", "));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const presetAmounts = amountsText
      .split(/[,،]/)
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n > 0);

    const defaultImpacts = getDefaultDonation().presetImpacts ?? [];
    const presetImpacts = (presetAmounts.length ? presetAmounts : getDefaultDonation().presetAmounts).map(
      (_, i) => data.presetImpacts?.[i] ?? defaultImpacts[i] ?? emptyLocalized()
    );

    const payload: DonationContent = {
      ...data,
      presetAmounts: presetAmounts.length ? presetAmounts : getDefaultDonation().presetAmounts,
      presetImpacts,
    };

    try {
      await api.setData({
        docRef: api.getDonationDoc(),
        data: payload,
        userData: { uid: user?.uid, displayName: user?.email ?? undefined },
      });
      setData(payload);
      setMessage("تم الحفظ بنجاح");
    } catch {
      setMessage("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="التبرعات"
        description="إعدادات التبرع وطلبات المتبرعين الواردة"
        actions={
          tab === "settings" ? (
            <Button loading={saving} onClick={handleSave}>
              حفظ التغييرات
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 flex gap-2">
        {(
          [
            { key: "settings", label: "الإعدادات" },
            { key: "intents", label: "طلبات التبرع" },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium",
              tab === t.key
                ? "bg-brand-green text-white"
                : "bg-border-subtle text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "intents" ? (
        <DonationIntentsPanel />
      ) : (
        <>
      {message && (
        <p className="mb-4 rounded-xl bg-brand-green/10 px-4 py-3 text-sm text-brand-green-dark">
          {message}
        </p>
      )}

      <Card padding="lg" className="mb-6">
        <CardContent className="flex flex-col gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.enabled}
              onChange={(e) => setData({ ...data, enabled: e.target.checked })}
              className="h-4 w-4 rounded border-border text-brand-green"
            />
            تفعيل التبرعات في الموقع
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="رمز العملة"
              dir="ltr"
              value={data.currencySymbol}
              onChange={(e) => setData({ ...data, currencySymbol: e.target.value })}
            />
            <Input
              label="كود العملة"
              dir="ltr"
              value={data.currencyCode}
              onChange={(e) => setData({ ...data, currencyCode: e.target.value })}
            />
            <Input
              label="الحد الأدنى"
              type="number"
              min={1}
              value={data.minAmount}
              onChange={(e) => setData({ ...data, minAmount: Number(e.target.value) })}
            />
          </div>

          <Input
            label="المبالغ الجاهزة (مفصولة بفاصلة)"
            dir="ltr"
            value={amountsText}
            onChange={(e) => setAmountsText(e.target.value)}
            hint="مثال: 10, 25, 50, 100"
          />

          {data.presetImpacts && data.presetImpacts.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">تأثير كل مبلغ (يظهر تحت الزر في نافذة التبرع)</p>
              {data.presetImpacts.map((impact, idx) => (
                <LocalizedInput
                  key={idx}
                  label={`تأثير المبلغ ${data.presetAmounts[idx] ?? idx + 1}`}
                  value={impact}
                  onChange={(value) => {
                    const presetImpacts = [...(data.presetImpacts ?? [])];
                    presetImpacts[idx] = value;
                    setData({ ...data, presetImpacts });
                  }}
                />
              ))}
            </div>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.allowRecurring !== false}
              onChange={(e) => setData({ ...data, allowRecurring: e.target.checked })}
              className="h-4 w-4 rounded border-border text-brand-green"
            />
            السماح بالتبرع الشهري / المتكرر
          </label>
          {data.allowRecurring !== false && (
            <>
              <LocalizedInput
                label="زر — لمرة واحدة"
                value={data.oneTimeLabel ?? emptyLocalized()}
                onChange={(oneTimeLabel) => setData({ ...data, oneTimeLabel })}
              />
              <LocalizedInput
                label="زر — شهري"
                value={data.recurringLabel ?? emptyLocalized()}
                onChange={(recurringLabel) => setData({ ...data, recurringLabel })}
              />
              <LocalizedInput
                label="تلميح التبرع الشهري"
                value={data.recurringHint ?? emptyLocalized()}
                onChange={(recurringHint) => setData({ ...data, recurringHint })}
                multiline
              />
            </>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.allowCustomAmount}
              onChange={(e) => setData({ ...data, allowCustomAmount: e.target.checked })}
              className="h-4 w-4 rounded border-border text-brand-green"
            />
            السماح بمبلغ مخصص
          </label>

          <div>
            <p className="mb-2 text-sm font-medium">طريقة الدفع</p>
            <div className="flex flex-wrap gap-3">
              {(
                [
                  { value: "record", label: "تسجيل فقط (بدون بوابة)" },
                  { value: "external", label: "توجيه لرابط خارجي" },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm"
                >
                  <input
                    type="radio"
                    name="paymentMode"
                    checked={data.paymentMode === opt.value}
                    onChange={() =>
                      setData({ ...data, paymentMode: opt.value as DonationPaymentMode })
                    }
                    className="h-4 w-4 text-brand-green"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <Input
            label="رابط الدفع الخارجي"
            dir="ltr"
            value={data.externalPaymentUrl}
            onChange={(e) => setData({ ...data, externalPaymentUrl: e.target.value })}
            hint="استخدم {amount} و {name} و {email} و {currency} كمتغيرات"
          />
        </CardContent>
      </Card>

      <Card padding="lg">
        <CardContent className="flex flex-col gap-6">
          <p className="text-sm font-bold text-muted-foreground">نافذة التبرع</p>
          <LocalizedInput
            label="تسمية المبلغ"
            value={data.amountLabel}
            onChange={(amountLabel) => setData({ ...data, amountLabel })}
          />
          <LocalizedInput
            label="تسمية المبلغ المخصص"
            value={data.customAmountLabel}
            onChange={(customAmountLabel) => setData({ ...data, customAmountLabel })}
          />
          <LocalizedInput
            label="تسمية الاسم"
            value={data.nameLabel}
            onChange={(nameLabel) => setData({ ...data, nameLabel })}
          />
          <LocalizedInput
            label="تسمية البريد"
            value={data.emailLabel}
            onChange={(emailLabel) => setData({ ...data, emailLabel })}
          />
          <LocalizedInput
            label="العنوان"
            value={data.modalTitle}
            onChange={(modalTitle) => setData({ ...data, modalTitle })}
          />
          <LocalizedInput
            label="الوصف"
            value={data.modalSubtitle}
            onChange={(modalSubtitle) => setData({ ...data, modalSubtitle })}
            multiline
          />
          <LocalizedInput
            label="زر الإرسال"
            value={data.submitLabel}
            onChange={(submitLabel) => setData({ ...data, submitLabel })}
          />
          <LocalizedInput
            label="رسالة النجاح"
            value={data.successMessage}
            onChange={(successMessage) => setData({ ...data, successMessage })}
            multiline
          />
          <LocalizedInput
            label="زر الإلغاء"
            value={data.cancelLabel}
            onChange={(cancelLabel) => setData({ ...data, cancelLabel })}
          />
          <LocalizedInput
            label="زر التأكيد"
            value={data.okLabel}
            onChange={(okLabel) => setData({ ...data, okLabel })}
          />
          <LocalizedInput
            label="تلميح — تسجيل فقط"
            value={data.paymentHintRecord}
            onChange={(paymentHintRecord) => setData({ ...data, paymentHintRecord })}
            multiline
          />
          <LocalizedInput
            label="تلميح — دفع خارجي"
            value={data.paymentHintExternal}
            onChange={(paymentHintExternal) => setData({ ...data, paymentHintExternal })}
            multiline
          />

          <p className="pt-2 text-sm font-bold text-muted-foreground">قسم «اصنع فرقاً»</p>
          <LocalizedInput
            label="عنوان القسم"
            value={data.ctaTitle}
            onChange={(ctaTitle) => setData({ ...data, ctaTitle })}
          />
          <LocalizedInput
            label="وصف القسم"
            value={data.ctaSubtitle}
            onChange={(ctaSubtitle) => setData({ ...data, ctaSubtitle })}
            multiline
          />
          <LocalizedInput
            label="زر القسم"
            value={data.ctaButtonLabel}
            onChange={(ctaButtonLabel) => setData({ ...data, ctaButtonLabel })}
          />

          <p className="pt-2 text-sm font-bold text-muted-foreground">الأزرار</p>
          <LocalizedInput
            label="زر القائمة / التبرع"
            value={data.navButtonLabel}
            onChange={(navButtonLabel) => setData({ ...data, navButtonLabel })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.showHeroButton}
              onChange={(e) => setData({ ...data, showHeroButton: e.target.checked })}
              className="h-4 w-4 rounded border-border text-brand-green"
            />
            إظهار زر التبرع في الواجهة الرئيسية
          </label>
          <LocalizedInput
            label="زر الواجهة الرئيسية"
            value={data.heroButtonLabel}
            onChange={(heroButtonLabel) => setData({ ...data, heroButtonLabel })}
          />
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );
}
