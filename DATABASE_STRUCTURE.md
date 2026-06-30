# هيكل قاعدة بيانات Firestore — D.I.F

## النمط العام

### محتوى الموقع (CMS)
```
{collection}/global/{subCollection}/{documentId}
```

### نظام إدارة المشاريع (جذر Firestore)
```
users/global/users/{uid}          — مستخدمو النظام
groups/{groupId}                  — مجموعات المشاريع
members/{groupId}/members/{userId} — أعضاء المجموعات
MyGroups/{userId}/MyGroups/{groupId} — مرجع سريع لمشاريع المستخدم
projects/{projectId}              — مشاريع تشغيلية (ليس projects/global)
donors/{donorId}                — المتبرعون
notifications/{notificationId}    — الإشعارات
settings/global                 — إعدادات النظام
```

> **ملاحظة:** مشاريع CMS العامة تبقى في `projects/global/projects/{id}` بينما المشاريع التشغيلية في `projects/{projectId}`.

---

## المشاريع التشغيلية — SubCollections

```
projects/{projectId}/
  Photos/Before|During|After/{photoId}
  Videos/{videoId}
  Documents/{docId}
  Reports/{reportId}
  Timeline/{entryId}
  Updates/{updateId}
  Invoices/{invoiceId}
  Contracts/{contractId}
  FinalReport/{docId}
  Location/main
  Progress/{entryId}
  Beneficiaries/main
```

---

## آلية MyGroups

عند تسجيل الدخول:
```
users → MyGroups → projects
```

عند إضافة عضو:
1. `members/{groupId}/members/{userId}`
2. `MyGroups/{userId}/MyGroups/{groupId}`
3. تحديث `membersCount` في المجموعة
4. إرسال إشعار

---

## الأدوار

Owner · Admin · Manager · Engineer · Financial · Media · Supervisor · Donor · Volunteer · Viewer

---

## لوحة التحكم

### CMS (موجود)
- `/admin` — لوحة المؤشرات
- `/admin/projects` — مشاريع الموقع (تسويقية)

### إدارة المشاريع (جديد)
- `/admin/management` — لوحة المشاريع
- `/admin/management/projects` — المشاريع التشغيلية
- `/admin/management/projects/{id}` — تفاصيل المشروع
- `/admin/management/groups` — المجموعات
- `/admin/management/donors` — المتبرعون
- `/admin/management/notifications` — الإشعارات
- `/admin/management/settings` — إعدادات النظام

### بوابة المتبرع
- `/portal` — دخول برقم المشروع أو اسم مستخدم + رمز
- `/portal?token={secureLinkToken}` — رابط آمن
- `/portal?qr={qrCodeToken}` — مسح QR

### مجموعات إضافية
- `portal_access/{username}` — بيانات دخول البوابة
- `portal_tokens/{token}` — ربط الرموز بالمتبرعين
- `projects/{id}/Progress/financial` — الملخص المالي
- `projects/{id}/DonorRatings/{donorId}` — تقييم المتبرع

---

## الملفات الرئيسية

| الملف | الغرض |
|-------|--------|
| `src/types/project-management.ts` | أنواع البيانات |
| `src/services/projectManagementService.ts` | CRUD المشاريع |
| `src/services/groupService.ts` | المجموعات |
| `src/services/memberService.ts` | الأعضاء + MyGroups |
| `src/services/donorService.ts` | المتبرعون |
| `src/services/notificationService.ts` | الإشعارات |
| `src/services/projectOrchestrationService.ts` | إنشاء مشروع + مجموعة |
