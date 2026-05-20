import React from 'react';
import { useTeachers, useClasses } from '../../hooks/useData';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export function Teachers() {
  const { data: teachers = [], refetch: refetchTeachers } = useTeachers();
  const { data: allClasses = [] } = useClasses();
  const { signUp } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  // Form state
  const [showForm, setShowForm] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [selectedClassId, setSelectedClassId] = React.useState('');

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;

    try {
      setLoading(true);
      // Delete class_teachers assignments first
      await supabase.from('class_teachers').delete().eq('teacher_id', id);
      // Delete teacher profile
      await supabase.from('profiles').delete().eq('id', id);
      refetchTeachers();
    } catch (err: any) {
      setError(err.message || 'فشل الحذف');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create teacher account with username
      await signUp(username, password, fullName, 'teacher');

      // Fetch the newly created teacher to get their ID
      const { data: newTeacher } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      // Assign to class if selected
      if (newTeacher && selectedClassId) {
        const { error: assignError } = await supabase
          .from('class_teachers')
          .insert({
            teacher_id: newTeacher.id,
            class_id: selectedClassId,
          });
        
        if (assignError) throw assignError;
      }

      setSuccess('تم إنشاء حساب المدرس بنجاح');
      setUsername('');
      setPassword('');
      setFullName('');
      setSelectedClassId('');
      setShowForm(false);
      refetchTeachers();
    } catch (err: any) {
      const errorMsg = err.message || 'فشل إنشاء حساب المدرس';
      if (errorMsg.includes('rate limit')) {
        setError('تم تجاوز حد معدل الطلبات، يرجى الانتظار 1-2 دقيقة ثم المحاولة مجددا');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 font-cairo" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">إدارة المدرسين</h1>

      {/* Create Teacher Form */}
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">إضافة مدرس جديد</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold"
          >
            {showForm ? '❌ إلغاء' : '➕ إضافة مدرس'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreateTeacher} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الفصل</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">اختر الفصل</option>
                  {allClasses.map((cls: any) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.day_of_week}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
            >
              {loading ? 'جارٍ الإنشاء...' : 'إنشاء حساب المدرس'}
            </button>
          </form>
        )}
      </div>

      {/* Teachers List */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">المدرسون المسجلون</h2>

      {teachers.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border text-center">
          <p className="text-gray-500">لا يوجد مدرسون حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teachers.map((teacher: any) => (
            <div key={teacher.id} className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{teacher.full_name}</h3>
                  <p className="text-gray-600 mt-1 text-sm">👨‍🏫 مدرس</p>
                </div>
                <button
                  onClick={() => handleDelete(teacher.id)}
                  disabled={loading}
                  className="text-red-600 hover:text-red-700 font-semibold disabled:opacity-50"
                >
                  🗑 حذف
                </button>
              </div>
              <p className="text-gray-500 text-sm border-t pt-4">
                المعرّف: {teacher.id.substring(0, 8)}...
              </p>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-lg border border-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
