# دليل البدء السريع - Quick Start Guide

اتبع هذه الخطوات للبدء في دقائق!

## ✅ الخطوة 1: التثبيت (2 دقيقة)

```bash
cd church-management
npm install
```

## ✅ الخطوة 2: متغيرات البيئة (1 دقيقة)

```bash
cp .env.example .env.local
```

ثم فتح `.env.local` وأضف:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

## ✅ الخطوة 3: Supabase (5 دقائق)

### 1. إنشاء مشروع
- اذهب إلى https://supabase.com
- أنشئ مشروع جديد
- انسخ URL و API Key

### 2. قاعدة البيانات
1. في Supabase Dashboard → SQL Editor
2. انسخ محتوى `supabase-setup.sql`
3. الصق وشغل (Run)

## ✅ الخطوة 4: حساب المدير (2 دقيقة)

في SQL Editor، شغل:
```sql
-- أنشئ مستخدم
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at) 
values ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'manager@example.com', crypt('password123', gen_salt('bf')), now(), now(), now());

-- احصل على ID
select id from auth.users where email = 'manager@example.com';

-- أنشئ ملف profile (استبدل USER_ID)
insert into public.profiles (id, full_name, role)
values ('USER_ID_HERE', 'مدير النظام', 'manager');
```

## ✅ الخطوة 5: التشغيل (1 دقيقة)

```bash
npm run dev
```

ثم افتح: http://localhost:5173

## ✅ الخطوة 6: الدخول

- البريد: `manager@example.com`
- كلمة المرور: `password123`

## ✅ الخطوة 7: الإعداد الأولي (5 دقائق)

### 1. أنشئ فصول (الفصول)
```
- فصل الجمعة (الجمعة)
- فصل خميس 1-4 (الخميس)
- فصل الأحد (الأحد)
```

### 2. أنشئ خدام (الحسابات)
```
الاسم: اسم الخادم
البريد: teacher@example.com
كلمة المرور: قوية جداً
```

### 3. عيّن خدام لفصول (SQL)
```sql
insert into public.class_teachers (class_id, teacher_id)
values ('CLASS_ID', 'TEACHER_ID');
```

### 4. أضف طلاب (المخدومين)

## 🎉 تم!

التطبيق جاهز للاستخدام!

### ماذا يمكنك أن تفعل الآن؟

**كمدير:**
- إدارة الفصول والطلاب
- عرض التقارير
- تعيين الخدام

**كخادم:**
- إدخال بيانات الحضور
- عرض طلابك

## 📚 المزيد من المعلومات

- **تفاصيل أكثر**: اقرأ [SETUP.md](./SETUP.md)
- **مشاكل؟**: اقرأ [README.md](./README.md#استكشاف-الأخطاء)
- **نشر على الإنترنت**: اقرأ [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**نصيحة**: احفظ اسم المستخدم وكلمة المرور في مكان آمن!
