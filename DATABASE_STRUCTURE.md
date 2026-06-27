# هيكل قاعدة بيانات Firestore — D.I.F

## النمط العام
```
{collection}/{parentId}/{subCollection}/{documentId}
```

- `parentId` = `global` للموقع الرئيسي
- جميع عمليات الكتابة عبر `setData` / `updateData` في `src/services/firestoreApi.ts`

## المسارات

| المحتوى | المسار |
|---------|--------|
| إعدادات الموقع | `site_config/global/site_config/global` |
| الشريط العلوي | `topbar/global/topbar/content` |
| القائمة | `nav_items/global/nav_items/{itemId}` |
| الواجهة | `hero/global/hero/content` |
| الإحصائيات | `stats/global/stats/{statId}` |
| البرامج | `programs/global/programs/{programId}` |
| المشاريع | `projects/global/projects/{projectId}` |
| الأخبار | `news/global/news/{newsId}` |
| الشركاء | `partners/global/partners/{partnerId}` |
| آراء المستفيدين | `testimonials/global/testimonials/{id}` |
| الوسائط | `media/global/media/{id}` |
| التراخيص | `licenses/global/licenses/{id}` |
| نقاط الخريطة | `map_points/global/map_points/{id}` |
| كيف نعمل | `how_we_work/global/how_we_work/{id}` |
| لماذا نحن | `why_us/global/why_us/{id}` |
| التذييل | `footer/global/footer/content` |
| النشرة | `newsletter/global/newsletter/content` |
| المستخدمون | `users/global/users/{uid}` |
| المسؤولون | `admins/global/admins/{uid}` |

## لوحة التحكم
- `/admin/login` — تسجيل الدخول
- `/admin` — لوحة المؤشرات
- `/admin/topbar`, `/admin/hero`, `/admin/stats`, `/admin/projects` ...

## التهيئة
1. أنشئ مستخدم Email/Password في Firebase Authentication
2. سجّل الدخول من `/admin/login`
3. اضغط «تهيئة البيانات الافتراضية» في لوحة التحكم
