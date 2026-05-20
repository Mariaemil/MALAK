# دليل النشر - Deployment Guide

هذا الدليل يشرح كيفية نشر التطبيق على الإنترنت.

## خيارات النشر

### الخيار 1: Netlify (الأسهل)

#### 1.1 إعداد المستودع
```bash
# إذا لم تكن قد فعلت بعد
git init
git add .
git commit -m "Initial commit"

# أنشئ مستودع GitHub جديد وادفع الكود
git remote add origin https://github.com/YOUR_USERNAME/church-management.git
git push -u origin main
```

#### 1.2 نشر على Netlify
1. اذهب إلى https://netlify.com
2. اضغط "New site from Git"
3. اختر GitHub وختر المستودع
4. إعدادات البناء:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

#### 1.3 إضافة متغيرات البيئة
1. اذهب إلى Site settings > Build & deploy > Environment
2. أضف:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. أعد النشر

### الخيار 2: Vercel

#### 2.1 تسجيل الدخول
1. اذهب إلى https://vercel.com
2. سجل دخولاً باستخدام GitHub

#### 2.2 استيراد المشروع
1. اضغط "Import Project"
2. اختر مستودع GitHub
3. اختر المشروع

#### 2.3 الإعدادات
1. **Framework Preset**: استرجاع الإعداد (Vite)
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`

#### 2.4 متغيرات البيئة
في "Environment Variables":
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### الخيار 3: Docker (متقدم)

#### 3.1 إنشاء Dockerfile
```dockerfile
# بناء المرحلة
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# مرحلة التشغيل
FROM node:20-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

#### 3.2 بناء الصورة
```bash
docker build -t church-management .
```

#### 3.3 التشغيل المحلي
```bash
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=... \
  -e VITE_SUPABASE_ANON_KEY=... \
  church-management
```

### الخيار 4: GitHub Pages (مجاني تماماً)

#### 4.1 إعداد المستودع
1. أنشئ مستودع GitHub جديد باسم `church-management`
2. ادفع الكود

#### 4.2 تعديل Vite config
```javascript
// vite.config.ts
export default defineConfig({
  base: '/church-management/', // استبدل باسم المستودع
  plugins: [react()],
})
```

#### 4.3 إضافة GitHub Actions
أنشأ ملف `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### 4.4 إضافة المتغيرات السرية
1. اذهب إلى Settings > Secrets and variables > Actions
2. أضف:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

#### 4.5 تفعيل GitHub Pages
1. اذهب إلى Settings > Pages
2. اختر "Deploy from a branch"
3. اختر `gh-pages` و `/(root)`

## الإعدادات الأمنية

### 1. متغيرات البيئة
- **لا تشارك** `VITE_SUPABASE_ANON_KEY` في المستودع
- استخدم `.env.local` محلياً و Secrets في المنصة

### 2. CORS في Supabase
1. اذهب إلى Supabase Settings > API
2. أضف نطاق التطبيق:
   ```
   https://yourapp.netlify.app
   https://yourapp.vercel.app
   ```

### 3. سياسات الأمان
- تأكد من تفعيل RLS على جميع الجداول
- استخدم Row Level Security بشكل صحيح

## التحسينات بعد النشر

### 1. تحسين الأداء
```bash
# قياس حجم الحزمة
npm run build

# قياس الأداء
npm install -g lighthouse
lighthouse https://yourapp.com
```

### 2. المراقبة والتسجيل
- استخدم Sentry لمراقبة الأخطاء
- استخدم LogRocket لمراقبة السلوك

### 3. النسخ الاحتياطية
- قم بعمل نسخ احتياطية من قاعدة البيانات بانتظام
- في Supabase: Settings > Database > Backups

## استكشاف الأخطاء

### المشكلة: الصفحة بيضاء بعد النشر
**الحل:**
1. تحقق من console للأخطاء (F12)
2. تأكد من متغيرات البيئة
3. تحقق من CORS

### المشكلة: "Cannot read properties of undefined"
**الحل:**
- تأكد من تحميل البيانات قبل العرض
- استخدم loading states

### المشكلة: البيانات لا تُحفظ
**الحل:**
- تحقق من سياسات RLS
- تحقق من اتصال Supabase

## قائمة التحقق قبل النشر

- [ ] تم اختبار التطبيق محلياً
- [ ] تم تعيين متغيرات البيئة
- [ ] تم تفعيل RLS على جميع الجداول
- [ ] تم إضافة نطاق التطبيق في CORS
- [ ] تم اختبار تسجيل الدخول
- [ ] تم اختبار جميع الميزات الأساسية
- [ ] تم التحقق من الأداء
- [ ] تم إعداد المراقبة والتسجيل

## الدعم

للمساعدة:
1. تحقق من سجلات النشر
2. تحقق من وثائق المنصة
3. اسأل في مجتمعات التطوير

---

**آخر تحديث**: مايو 2026
