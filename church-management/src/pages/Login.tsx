import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, profile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(username, password);
      // Redirect based on role
      setTimeout(() => {
        if (profile?.role === 'manager') {
          navigate('/dashboard');
        } else {
          navigate('/my-class');
        }
      }, 500);
    } catch (err: any) {
      setError('فشل تسجيل الدخول، تحقق من البيانات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 font-cairo" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-8 border-b border-gray-700">
            <div className="text-center mb-2">
              <h1 className="text-4xl font-bold text-white">⛪</h1>
            </div>
            <h2 className="text-2xl font-bold text-white text-center">MALAK</h2>
            <p className="text-gray-400 text-center text-sm mt-2">نظام إدارة الكنيسة</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 font-semibold mb-2">اسم المستخدم</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-2">كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-900 border border-red-700 text-red-100 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ جارٍ التحميل...' : '🔓 دخول'}
              </button>
            </form>

            <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-lg text-center">
              <p className="text-gray-400 text-sm mb-2 font-semibold">حساب اختبار</p>
              <p className="text-gray-500 text-xs">
                <span className="text-gray-300">اسم المستخدم:</span> admin
              </p>
              <p className="text-gray-500 text-xs">
                <span className="text-gray-300">كلمة المرور:</span> admin
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2026 MALAK - Church Management System
        </p>
      </div>
    </div>
  );
}
