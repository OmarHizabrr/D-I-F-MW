"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSystemSettings, saveSystemSettings } from "@/services/settingsService";
import { invalidateSystemSettingsCache } from "@/hooks/useSystemSettings";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFlowGuide } from "@/components/admin/AdminFlowGuide";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";
import { FORM_PLACEHOLDERS } from "@/lib/admin/form-placeholders";
import type { SystemSettings } from "@/types/project-management";

export default function ManagementSettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSystemSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    if (!settings || !user) return;
    setSaving(true);
    try {
      await saveSystemSettings(settings, {
        uid: user.uid,
        displayName: user.email ?? undefined,
      });
      invalidateSystemSettingsCache();
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="إعدادات البوابة"
        description="تفعيل بوابة المتبرعين والإعدادات العامة للمشاريع"
      />

      <AdminFlowGuide
        title="إعدادات بوابة المتبرعين"
        steps={[
          "فعّل «بوابة المتبرعين» ليتمكن المتبرعون من الدخول إلى /portal",
          "أنشئ المتبرعين من قسم المتبرعون واربطهم بالمشاريع",
          "أرسل لكل متبرع بيانات الدخول (رابط، اسم مستخدم، رمز)",
        ]}
      />

      <Card padding="lg" className="max-w-xl space-y-4">
        <Input
          label="اسم المؤسسة"
          placeholder={FORM_PLACEHOLDERS.settings.organizationName}
          value={settings.organizationName}
          onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
        />
        <Input
          label="العملة الافتراضية"
          dir="ltr"
          placeholder={FORM_PLACEHOLDERS.settings.defaultCurrency}
          value={settings.defaultCurrency}
          onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.enableDonorPortal}
            onChange={(e) => setSettings({ ...settings, enableDonorPortal: e.target.checked })}
            className="h-4 w-4 rounded border-border text-brand-green"
          />
          تفعيل بوابة المتبرعين
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.enableNotifications}
            onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
            className="h-4 w-4 rounded border-border text-brand-green"
          />
          تفعيل الإشعارات
        </label>
        <Button loading={saving} onClick={handleSave}>
          حفظ الإعدادات
        </Button>
      </Card>
    </div>
  );
}
