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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-900 flex items-center justify-center p-4 font-cairo overflow-hidden relative" dir="rtl">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDuration: '8s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDuration: '10s', animationDelay: '-2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDuration: '12s', animationDelay: '-4s'}}></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md animate-scaleIn">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 smooth"></div>
        
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500 border-opacity-30 rounded-2xl shadow-depth overflow-hidden backdrop-filter backdrop-blur-xl">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-12">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
            </div>
            
            <div className="relative text-center">
              <div className="inline-block mb-4 p-4 bg-white bg-opacity-10 rounded-full backdrop-filter backdrop-blur-sm border border-white border-opacity-20 animate-bounce" style={{animationDuration: '3s'}}>
                <h1 className="text-5xl">⛪</h1>
              </div>
              <h2 className="text-3xl font-bold text-white mb-1">MALAK</h2>
              <p className="text-purple-100 text-sm">نظام إدارة الكنيسة</p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              {/* Username */}
              <div className="group">
                <label className="block text-gray-300 font-semibold mb-2 text-sm">اسم المستخدم</label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    required
                    className="w-full px-5 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-30 transition smooth placeholder-gray-500 backdrop-filter backdrop-blur-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">👤</div>
                </div>
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-gray-300 font-semibold mb-2 text-sm">كلمة المرور</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    required
                    className="w-full px-5 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-30 transition smooth placeholder-gray-500 backdrop-filter backdrop-blur-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">🔒</div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-900 bg-opacity-30 border border-red-500 border-opacity-50 text-red-200 rounded-lg text-sm text-center animate-slideInRight backdrop-filter backdrop-blur-sm">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl transition smooth disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/50"
              >
                {loading ? '⏳ جارٍ التحميل...' : '🔓 دخول'}
              </button>
            </form>

            {/* Test Credentials Card */}
            <div className="mt-6 p-4 bg-white bg-opacity-5 border border-purple-500 border-opacity-20 rounded-xl backdrop-filter backdrop-blur-sm animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              <p className="text-gray-300 text-xs mb-2 font-semibold">🧪 حساب اختبار</p>
              <div className="space-y-1 text-gray-400 text-xs">
                <p><span className="text-gray-300">اسم المستخدم:</span> admin</p>
                <p><span className="text-gray-300">كلمة المرور:</span> admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6 animate-fadeIn" style={{animationDelay: '0.6s'}}>
          © 2026 MALAK - Church Management System
        </p>
      </div>
    </div>
  );
}
