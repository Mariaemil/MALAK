import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export function SetupManager() {
  const [formData, setFormData] = useState({
    churchName: '',
    managerName: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.churchName || !formData.managerName || !formData.username || !formData.password) {
      setError('جميع الحقول مطلوبة');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (formData.username.length < 3) {
      setError('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      await signUp(formData.username, formData.password, formData.managerName, 'manager', formData.churchName);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err: any) {
      setError(err.message || 'فشل إنشاء الحساب، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4 font-cairo" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">إعداد الكنيسة والمدير</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}
            
            <Input
              label="اسم الكنيسة 🏛️"
              type="text"
              name="churchName"
              value={formData.churchName}
              onChange={handleChange}
              placeholder="اسم كنيستك"
              required
            />

            <Input
              label="اسم المدير 👤"
              type="text"
              name="managerName"
              value={formData.managerName}
              onChange={handleChange}
              placeholder="اسمك الكامل"
              required
            />

            <Input
              label="اسم المستخدم 📝"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="اسم فريد (3 أحرف على الأقل)"
              required
            />

            <Input
              label="كلمة المرور 🔐"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="كلمة مرور قوية (6 أحرف على الأقل)"
              required
            />

            <Input
              label="تأكيد كلمة المرور"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="أعد إدخال كلمة المرور"
              required
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'جارٍ الإعداد...' : 'إنشاء حساب المدير'}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-4">
              هل لديك حساب بالفعل؟{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:underline font-semibold"
              >
                تسجيل الدخول
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
