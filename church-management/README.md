# إدارة فصول الكنيسة - Church Class Management System

نظام إدارة متكامل لفصول الكنيسة مع تتبع الحضور والنتائج.

## الميزات الرئيسية

- ✅ واجهة عربية RTL كاملة 100%
- ✅ إدارة الفصول والخدام والمخدومين
- ✅ تتبع الحضور والنتائج
- ✅ تقارير مفصلة مع تصدير CSV
- ✅ نظام تسجيل دخول آمن
- ✅ دعم الأدوار: مدير وخادم (مدرس)
- ✅ حساب النتائج التلقائي
- ✅ واجهة سريعة الاستجابة

## المتطلبات

- Node.js 16+ و npm
- حساب Supabase
- متصفح حديث

## التثبيت والإعداد

### 1. استنساخ أو فك الضغط عن المشروع

```bash
cd church-management
```

### 2. تثبيت المكتبات

```bash
npm install
```

### 3. إعداد متغيرات البيئة

قم بنسخ `.env.example` إلى `.env.local`:

```bash
cp .env.example .env.local
```

أضف بيانات Supabase الخاصة بك:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. إعداد قاعدة البيانات

#### الخطوة 1: إنشاء مشروع Supabase
1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ حساباً جديداً أو سجل الدخول
3. أنشئ مشروعاً جديداً
4. انسخ URL و API Key من الإعدادات

#### الخطوة 2: تشغيل السكريبت
1. اذهب إلى Supabase Dashboard
2. في SQL Editor، انقر على "New query"
3. انسخ جميع محتويات ملف `supabase-setup.sql`
4. الصق المحتوى وانقر "Run"

#### الخطوة 3: تفعيل مصادقة البريد الإلكتروني
1. اذهب إلى "Authentication" > "Providers"
2. تأكد من تفعيل "Email"
3. اختياري: أضف مزودي OAuth (Google, GitHub, إلخ)

### 5. تشغيل التطبيق

```bash
npm run dev
```

سيفتح التطبيق على `http://localhost:5173`

## دليل الاستخدام

### الدخول الأول

#### حساب مدير جديد
في Supabase SQL Editor، قم بإضافة مدير جديد:

```sql
insert into auth.users (email, encrypted_password, email_confirmed_at) 
values ('manager@example.com', crypt('password123', gen_salt('bf')), now());

insert into public.profiles (id, full_name, role)
values ((select id from auth.users where email = 'manager@example.com'), 'اسم المدير', 'manager');
```

#### إنشاء حسابات الخدام
استخدم صفحة "الحسابات" في لوحة تحكم المدير.

### دور المدير

#### الصفحات المتاحة:
1. **نظرة عامة** - إحصائيات سريعة
2. **الفصول** - إضافة/حذف الفصول وتحديد أيام الاجتماع
3. **الخدام** - قائمة الخدام المدسجلين
4. **المخدومين** - إدارة الطلاب وعرض النتائج
5. **التقارير** - تقارير مفصلة مع فلاتر التاريخ
6. **الحسابات** - إنشاء حسابات خادم جديدة

### دور الخادم (المدرس)

#### الصفحات المتاحة:
1. **فصلي** - إدخال بيانات الحضور

#### كيفية إدخال الحضور:
1. اختر التاريخ من الأعلى
2. ضع علامة على الحضور لكل طالب:
   - حضور شموسية (0.5 نقطة)
   - حضر قداس (0.5 نقطة)
   - افتقاد (بدون نقاط)
3. اضغط "حفظ"

## نظام النتائج

### حساب النقاط
- حضور شموسية واحد = 0.5 نقطة
- حضر قداس واحد = 0.5 نقطة
- افتقاد واحد = بدون نقاط

### النقاط الممكنة
- الشهر الواحد: 4 جلسات شموسية + 4 جلسات قداس = 8 نقاط كاملة (4 أيام)
- الرسالة المئوية = (النقاط المحققة / النقاط الممكنة) × 100

### ألوان النتائج
- أخضر (🟢): ≥ 75% - ممتاز
- أصفر (🟡): 50-75% - جيد
- أحمر (🔴): < 50% - ضعيف

## هيكل الفصول

```
6 فصول في الأسبوع:
├── الجمعة (Friday): 1 فصل
├── الخميس (Thursday): 4 فصول
└── الأحد (Sunday): 1 فصل
```

## تكنولوجيا المستخدمة

- **React 19** - مكتبة UI
- **Vite** - أداة البناء
- **TypeScript** - لغة البرمجة
- **Supabase** - قاعدة البيانات والمصادقة
- **Tailwind CSS** - التصميم
- **React Router** - التوجيه
- **React Query** - إدارة البيانات
- **date-fns** - معالجة التواريخ

---

**آخر تحديث**: مايو 2026
**النسخة**: 1.0.0

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
