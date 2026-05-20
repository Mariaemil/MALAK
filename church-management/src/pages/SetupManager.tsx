import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export function SetupManager() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('12345');
  const [fullName, setFullName] = useState('مدير الكنيسة');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [managerExists, setManagerExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if manager already exists
    const checkManager = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'manager')
        .limit(1);
      
      if (data && data.length > 0) {
        setManagerExists(true);
      }
    };
    checkManager();
  }, []);

  const handleCreateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const email = `${username.toLowerCase()}@internal.church`;

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('rate limit')) {
          throw new Error('تم تجاوز حد معدل الطلبات، يرجى الانتظار 1-2 دقيقة ثم المحاولة مجددا');
        }
        throw authError;
      }

      if (authData.user) {
        // Create profile with username
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          full_name: fullName,
          username,
          role: 'manager',
        });

        if (profileError) throw profileError;

        setSuccess('✅ تم إنشاء حساب المدير بنجاح!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'فشل إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  if (managerExists) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4 font-cairo" dir="rtl">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">تم بالفعل إعداد النظام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-gray-700">حساب المدير موجود بالفعل</p>
              <Button
                onClick={() => navigate('/')}
                className="w-full"
              >
                الذهاب إلى الدخول
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center p-4 font-cairo" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">🔧 إعداد حساب المدير</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center mb-6 text-sm">
            أنت تقوم بإنشاء حساب المدير الأول للنظام
          </p>
          
          <form onSubmit={handleCreateManager} className="space-y-4">
            <Input
              label="الاسم الكامل"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="مدير الكنيسة"
              required
            />
            <Input
              label="اسم المستخدم"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
            <Input
              label="كلمة المرور"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة مرور قوية"
              required
            />
            
            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">{success}</p>
            )}
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? 'جارٍ الإنشاء...' : 'إنشاء حساب المدير'}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              ستتمكن من إنشاء حسابات إضافية بعد تسجيل الدخول
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
