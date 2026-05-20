# دليل إعداد Supabase - Supabase Setup Guide

هذا الدليل سيساعدك على إعداد قاعدة البيانات والمصادقة في Supabase.

## الخطوة 1: إنشاء مشروع Supabase

### 1.1 التسجيل
1. اذهب إلى https://supabase.com
2. انقر على "Start your project"
3. اختر "Sign up with GitHub" أو "Sign up with Email"
4. أكمل عملية التسجيل

### 1.2 إنشاء مشروع جديد
1. في لوحة التحكم، انقر على "New Project"
2. أدخل اسم المشروع: `church-management`
3. اختر كلمة مرور قوية (سيتم استخدامها لقاعدة البيانات)
4. اختر المنطقة الأقرب إليك
5. انقر على "Create new project"

### 1.3 الانتظار والحصول على المفاتيح
الانتظار 2-5 دقائق حتى ينتهي إنشاء المشروع.

بعد اكتمال الإنشاء:
1. اذهب إلى Settings > API
2. انسخ القيم التالية:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon (public)** → `VITE_SUPABASE_ANON_KEY`

3. الصق هذه القيم في ملف `.env.local`:
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## الخطوة 2: إعداد المصادقة

### 2.1 تفعيل المصادقة عبر البريد الإلكتروني
1. اذهب إلى **Authentication** > **Providers**
2. تحقق من أن "Email" مفعل (يجب أن يكون مفعل افتراضياً)
3. لا تغيير الإعدادات الأخرى في الوقت الحالي

## الخطوة 3: إنشاء الجداول

### 3.1 الوصول إلى SQL Editor
1. في لوحة التحكم Supabase، اذهب إلى **SQL Editor**
2. انقر على **New Query**

### 3.2 تشغيل السكريبت
1. افتح ملف `supabase-setup.sql` من المشروع
2. انسخ جميع المحتوى
3. الصقه في نافذة SQL Editor
4. انقر على **Run** (أو اضغط Ctrl+Enter)

### 3.3 التحقق من النجاح
1. اذهب إلى **Table Editor**
2. تأكد من ظهور هذه الجداول:
   - `profiles`
   - `classes`
   - `class_teachers`
   - `students`
   - `attendance_records`

## الخطوة 4: إنشاء حساب مدير أول

### 4.1 عبر Supabase SQL Editor

افتح SQL Editor جديد وشغل الأوامر التالية:

**أولاً: إنشاء مستخدم جديد**
```sql
-- استبدل manager@example.com و password123 بالبيانات المرغوبة
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'manager@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);
```

**ثانياً: الحصول على ID المستخدم الذي تم إنشاؤه**
```sql
select id from auth.users where email = 'manager@example.com';
```

**ثالثاً: إنشاء ملف profile للمدير**
استبدل `USER_ID_HERE` بالـ ID من الخطوة السابقة:

```sql
insert into public.profiles (id, full_name, role)
values ('USER_ID_HERE', 'اسم المدير', 'manager');
```

### 4.2 تسجيل الدخول
1. افتح التطبيق على `http://localhost:5173`
2. اذهب إلى صفحة تسجيل الدخول
3. استخدم:
   - البريد: `manager@example.com`
   - كلمة المرور: `password123`

## الخطوة 5: الإعداد الأولي في التطبيق

### 5.1 إنشاء الفصول الأساسية
1. سجل الدخول كمدير
2. اذهب إلى **الفصول**
3. أنشئ 6 فصول:
   - **فصل الجمعة** - الجمعة
   - **فصل خميس 1** - الخميس
   - **فصل خميس 2** - الخميس
   - **فصل خميس 3** - الخميس
   - **فصل خميس 4** - الخميس
   - **فصل الأحد** - الأحد

### 5.2 إنشاء حسابات الخدام
1. اذهب إلى **الحسابات**
2. أنشئ حساب لكل خادم:
   - الاسم الكامل
   - البريد الإلكتروني
   - كلمة مرور قوية

### 5.3 تعيين الخدام للفصول
عبر SQL Editor، عيّن الخدام للفصول:

```sql
-- احصل على ID الخادم والفصل أولاً
select id, full_name, role from public.profiles where role = 'teacher';
select id, name from public.classes;

-- ثم عيّن الخادم للفصل
insert into public.class_teachers (class_id, teacher_id)
values ('CLASS_ID_HERE', 'TEACHER_ID_HERE');
```

### 5.4 إضافة الطلاب (المخدومين)
1. اذهب إلى **المخدومين**
2. أنشئ طلاب جدد وعينهم للفصول

## المشاكل الشائعة والحلول

### المشكلة 1: "Invalid login credentials"
**الأسباب المحتملة:**
- البريد الإلكتروني غير موجود
- كلمة المرور خاطئة
- البريد لم يتم تأكيده (في بعض الحالات)

**الحل:**
```sql
-- تحقق من وجود البريد
select id, email from auth.users where email = 'manager@example.com';

-- تأكد من تأكيد البريد
update auth.users 
set email_confirmed_at = now() 
where email = 'manager@example.com';
```

### المشكلة 2: "Teachers can't see their class"
**السبب:** الخادم غير مرتبط بالفصل

**الحل:**
```sql
-- تحقق من التعيينات
select * from public.class_teachers where teacher_id = 'TEACHER_ID_HERE';

-- إذا كان فارغاً، أضف التعيين
insert into public.class_teachers (class_id, teacher_id)
values ('CLASS_ID_HERE', 'TEACHER_ID_HERE');
```

### المشكلة 3: "RLS policy violation"
**السبب:** سياسة الأمان على الصفوف لا تسمح بالوصول

**الحل:**
- تحقق من أن RLS مفعل بشكل صحيح
- راجع سياسات الأمان في `supabase-setup.sql`

### المشكلة 4: بيانات الحضور لا تُحفظ
**الأسباب المحتملة:**
- الخادم ليس مالك الفصل
- جدول `attendance_records` لم يُنشأ بشكل صحيح

**الحل:**
```sql
-- تحقق من وجود الجدول
select * from information_schema.tables where table_name = 'attendance_records';

-- تحقق من البيانات
select * from public.attendance_records limit 10;
```

## الخطوات التالية

1. **إنشاء فصول**: أنشئ جميع الفصول المطلوبة
2. **إضافة خدام**: أنشئ حسابات للخدام
3. **تعيين الطلاب**: أضف الطلاب وعينهم للفصول
4. **اختبار النظام**: حاول إدخال بيانات حضور كخادم

## الدعم الإضافي

- وثائق Supabase: https://supabase.com/docs
- منتدى المجتمع: https://github.com/supabase/supabase/discussions
- مشاكل معروفة: https://github.com/supabase/supabase/issues

---

**نصيحة:** احفظ هذا الدليل للرجوع إليه لاحقاً!
