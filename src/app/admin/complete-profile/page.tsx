"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, getUserMeta } from "@/context/AuthContext";
import { completeAdminProfile } from "@/services/userService";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

export default function CompleteProfilePage() {
  const { user, userProfile, loading, profileLoading, refreshProfile, isAdmin } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    } else if (!loading && user && !isAdmin) {
      router.replace("/");
    } else if (!profileLoading && userProfile?.profileComplete) {
      router.replace("/admin");
    }
  }, [loading, user, isAdmin, profileLoading, userProfile, router]);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || user?.displayName || "");
      setPhone(userProfile.phone || "");
      setPhotoURL(userProfile.photoURL || user?.photoURL || "");
    }
  }, [userProfile, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!displayName.trim() || !phone.trim()) {
      setError("الاسم ورقم الهاتف مطلوبان");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await completeAdminProfile(
        user.uid,
        { displayName: displayName.trim(), phone: phone.trim(), photoURL },
        getUserMeta(user)
      );
      await refreshProfile();
      router.replace("/admin");
    } catch {
      setError("فشل حفظ الملف الشخصي");
    } finally {
      setSaving(false);
    }
  }

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || userProfile?.profileComplete) {
    return null;
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center px-4 py-12">
      <AdminPageHeader
        title="إكمال الملف الشخصي"
        description="أكمل بياناتك قبل الدخول إلى لوحة التحكم"
      />

      <Card padding="lg">
        <CardContent>
          <div className="mb-6 flex flex-col items-center gap-3">
            <UserAvatar name={displayName || user.email || ""} photoURL={photoURL} size="xl" />
            <p className="text-sm text-muted-foreground">
              {photoURL ? "صورتك الشخصية" : "يُعرض أول حرف من اسمك إذا لم ترفع صورة"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="الاسم الكامل"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="مثال: أحمد محمد"
            />
            <Input
              label="رقم الهاتف"
              required
              dir="ltr"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+265 ..."
            />
            <FileUploadField
              label="الصورة الشخصية (اختياري)"
              folder="users/avatars"
              value={photoURL}
              onChange={setPhotoURL}
              hint="PNG أو JPG — إن تُركت فارغة يُستخدم الحرف الأول"
            />

            {error && (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" loading={saving} loadingText="جاري الحفظ..." fullWidth>
              حفظ والمتابعة
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
