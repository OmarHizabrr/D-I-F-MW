"use client";

import { useAuth, getUserMeta } from "@/context/AuthContext";
import { getSiteSeedStatus, seedSiteContent } from "@/services/seedService";
import { HOME_SECTIONS } from "@/lib/firebase/database-structure";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Database, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const SEED_ITEMS = [
  "الشريط العلوي والقائمة والواجهة الرئيسية",
  "الإحصائيات والبرامج والمشاريع",
  "كيف نعمل / لماذا نحن / الوسائط / الأخبار",
  "الشركاء / آراء المستفيدين / التراخيص",
  "خريطة المشاريع / النشرة / التذييل / عناوين الأقسام",
];

export function AdminSeedPanel() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const status = await getSiteSeedStatus();
      setSeeded(status.seeded);
      setTotalItems(status.totalItems);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleSeed() {
    if (!user) return;

    const confirmMsg = seeded
      ? "سيتم تحديث/دمج البيانات الافتراضية مع المحتوى الحالي. هل تريد المتابعة؟"
      : "سيتم إضافة جميع البيانات الافتراضية للموقع. هل تريد المتابعة؟";

    if (!window.confirm(confirmMsg)) return;

    setSeeding(true);
    setMessage(null);
    setError(null);
    try {
      await seedSiteContent(getUserMeta(user));
      setMessage("تمت تهيئة البيانات بنجاح — يمكنك التعديل من الأقسام أدناه");
      await refresh();
    } catch (err) {
      console.error("[Seed]", err);
      setError("فشلت التهيئة — تحقق من Firestore Rules واتصال Firebase");
    } finally {
      setSeeding(false);
    }
  }

  if (loading) {
    return (
      <Card padding="lg" className="mb-6">
        <div className="flex justify-center py-8">
          <Spinner size="md" />
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="mb-6 border-brand-green/20 bg-brand-green/[0.03]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-2">
            <Database className="h-5 w-5 text-brand-green-dark dark:text-brand-green" />
            <CardTitle className="text-lg">البيانات الافتراضية للموقع</CardTitle>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            {seeded ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green/10 px-3 py-1 text-xs font-medium text-brand-green-dark dark:text-brand-green">
                <CheckCircle2 className="h-3.5 w-3.5" />
                مهيّأ ({totalItems} عنصر)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-800 dark:text-amber-200">
                <AlertCircle className="h-3.5 w-3.5" />
                لم تُضف البيانات بعد
              </span>
            )}
          </div>

          <p className="mb-3 text-sm text-muted-foreground">
            {seeded
              ? "البيانات موجودة في Firestore. يمكنك تعديلها أو إضافة عناصر جديدة أو حذفها من كل قسم."
              : "اضغط الزر لإضافة كل محتوى الصفحة الرئيسية (نصوص، مشاريع، أخبار...) ثم عدّل ما تشاء."}
          </p>

          <ul className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
            {SEED_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-1.5">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-green" />
                {item}
              </li>
            ))}
          </ul>

          {message && (
            <p className="mt-4 rounded-xl bg-brand-green/10 px-3 py-2 text-sm text-brand-green-dark dark:text-brand-green">
              {message}
            </p>
          )}
          {error && (
            <p className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
          <Button
            loading={seeding}
            loadingText="جاري التهيئة..."
            onClick={handleSeed}
            className="w-full sm:w-auto lg:min-w-[180px]"
          >
            {seeded ? "إعادة تهيئة البيانات" : "تهيئة البيانات الافتراضية"}
          </Button>
        </div>
      </div>

      {seeded && (
        <CardContent className="mt-6 !p-0">
          <p className="mb-3 text-xs font-semibold text-muted-foreground">انتقل للتعديل:</p>
          <div className="flex flex-wrap gap-2">
            {HOME_SECTIONS.slice(0, 8).map((s) => (
              <Link
                key={s.id}
                href={s.href}
                className="rounded-lg border border-border-subtle bg-surface px-2.5 py-1.5 text-xs font-medium hover:border-brand-green/40 hover:bg-brand-green/5"
              >
                {s.label}
              </Link>
            ))}
            <Link
              href="/admin/stats"
              className="rounded-lg border border-dashed border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-brand-green"
            >
              + المزيد
            </Link>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
