import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export function Accounts() {
  const { signUp } = useAuth();
  
  // Teacher account state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Manager account state
  const [managerUsername, setManagerUsername] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [managerFullName, setManagerFullName] = useState('');
  const [managerLoading, setManagerLoading] = useState(false);
  const [managerError, setManagerError] = useState('');
  const [managerSuccess, setManagerSuccess] = useState('');

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await signUp(username, password, fullName, 'teacher');
      setSuccess('تم إنشاء حساب المدرس بنجاح');
      setUsername('');
      setPassword('');
      setFullName('');
    } catch (err: any) {
      const errorMsg = err.message || 'فشل إنشاء الحساب';
      if (errorMsg.includes('rate limit')) {
        setError('تم تجاوز حد معدل الطلبات، يرجى الانتظار 1-2 دقيقة ثم المحاولة مجددا');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setManagerLoading(true);
    setManagerError('');
    setManagerSuccess('');

    try {
      await signUp(managerUsername, managerPassword, managerFullName, 'manager');
      setManagerSuccess('تم إنشاء حساب مدير بنجاح');
      setManagerUsername('');
      setManagerPassword('');
      setManagerFullName('');
    } catch (err: any) {
      const errorMsg = err.message || 'فشل إنشاء حساب المدير';
      if (errorMsg.includes('rate limit')) {
        setManagerError('تم تجاوز حد معدل الطلبات، يرجى الانتظار 1-2 دقيقة ثم المحاولة مجددا');
      } else {
        setManagerError(errorMsg);
      }
    } finally {
      setManagerLoading(false);
    }
  };

  return (
    <div className="p-8 font-cairo" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">إدارة الحسابات</h1>

      {/* Create Manager Account */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg border shadow-sm border-green-400">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">إنشاء حساب مدير 👨‍💼</h2>
          <form onSubmit={handleCreateManager} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">الاسم الكامل</label>
              <input
                type="text"
                value={managerFullName}
                onChange={(e) => setManagerFullName(e.target.value)}
                placeholder="أدخل الاسم الكامل"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">اسم المستخدم</label>
              <input
                type="text"
                value={managerUsername}
                onChange={(e) => setManagerUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">كلمة المرور</label>
              <input
                type="password"
                value={managerPassword}
                onChange={(e) => setManagerPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>

            {managerError && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{managerError}</div>}
            {managerSuccess && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{managerSuccess}</div>}

            <button
              type="submit"
              disabled={managerLoading}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
            >
              {managerLoading ? 'جارٍ الإنشاء...' : 'إنشاء حساب مدير'}
            </button>
          </form>
        </div>

        {/* Manager Info Box */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-300">
          <h2 className="text-xl font-bold text-green-900 mb-4">حساب المدير</h2>
          <ul className="space-y-3 text-green-800">
            <li className="flex items-start">
              <span className="text-green-600 font-bold ml-2">✓</span>
              <span>صلاحيات كاملة لإدارة المدرسين والفصول والطلاب</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold ml-2">✓</span>
              <span>يمكن إنشاء وحذف حسابات المدرسين</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold ml-2">✓</span>
              <span>عرض التقارير والإحصائيات الشاملة</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold ml-2">✓</span>
              <span>استخدم اسم مستخدم وكلمة مرور قوية</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Create Teacher Account */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create New Account */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">إنشاء حساب مدرس 👨‍🏫</h2>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">الاسم الكامل</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أدخل الاسم الكامل"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">اسم المستخدم</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            {success && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
            >
              {loading ? 'جارٍ الإنشاء...' : 'إنشاء حساب مدرس'}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-bold text-blue-900 mb-4">حساب المدرس</h2>
          <ul className="space-y-3 text-blue-800">
            <li className="flex items-start">
              <span className="text-blue-600 font-bold ml-2">✓</span>
              <span>يمكن للمدرسين إدارة فصولهم والطلاب</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold ml-2">✓</span>
              <span>تسجيل الحضور والغياب</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold ml-2">✓</span>
              <span>عرض قوائم طلاب الفصل</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold ml-2">✓</span>
              <span>استخدم اسم مستخدم وكلمة مرور قوية</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
