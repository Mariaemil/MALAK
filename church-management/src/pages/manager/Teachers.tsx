import React from 'react';
import { useTeachers, useClasses } from '../../hooks/useData';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export function Teachers() {
  const { data: teachers = [], refetch: refetchTeachers } = useTeachers();
  const { data: allClasses = [] } = useClasses();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  // Form state
  const [showForm, setShowForm] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [selectedClassId, setSelectedClassId] = React.useState('');
  
  // Edit state
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editFullName, setEditFullName] = React.useState('');
  const [editPassword, setEditPassword] = React.useState('');
  const [editClassId, setEditClassId] = React.useState('');

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;

    try {
      setLoading(true);
      // Delete teacher from auth_users
      await supabase.from('auth_users').delete().eq('id', id);
      refetchTeachers();
      setSuccess('تم حذف المدرس بنجاح');
    } catch (err: any) {
      setError(err.message || 'فشل الحذف');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (teacher: any) => {
    setEditingId(teacher.id);
    setEditFullName(teacher.full_name);
    setEditPassword(teacher.password_hash);
    setEditClassId(teacher.class_id || '');
    setError('');
    setSuccess('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFullName('');
    setEditPassword('');
    setEditClassId('');
  };

  const handleEditTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!editFullName) {
        setError('الاسم مطلوب');
        setLoading(false);
        return;
      }

      if (!editPassword) {
        setError('كلمة المرور مطلوبة');
        setLoading(false);
        return;
      }

      // Prepare update data
      const updateData: any = {
        full_name: editFullName,
        password_hash: editPassword,
        class_id: editClassId || null,
      };

      // Update teacher
      const { error: updateError } = await supabase
        .from('auth_users')
        .update(updateData)
        .eq('id', editingId);

      if (updateError) throw updateError;

      setSuccess('تم تحديث بيانات المدرس بنجاح');
      cancelEdit();
      refetchTeachers();
    } catch (err: any) {
      setError(err.message || 'فشل التحديث');
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
      // Validate inputs
      if (!username || !password || !fullName) {
        setError('جميع الحقول مطلوبة');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        setLoading(false);
        return;
      }

      // Create teacher account in auth_users table
      const { data: newTeacher, error: insertError } = await supabase
        .from('auth_users')
        .insert({
          username: username.toLowerCase(),
          password_hash: password,
          full_name: fullName,
          role: 'teacher',
          class_id: selectedClassId || null,
        })
        .select()
        .single();

      if (insertError) {
        if (insertError.message.includes('duplicate')) {
          setError('اسم المستخدم موجود بالفعل، اختر اسم آخر');
        } else {
          setError(insertError.message || 'فشل إنشاء حساب المدرس');
        }
        setLoading(false);
        return;
      }

      setSuccess('تم إنشاء حساب المدرس بنجاح');
      setUsername('');
      setPassword('');
      setFullName('');
      setSelectedClassId('');
      setShowForm(false);
      refetchTeachers();
    } catch (err: any) {
      setError(err.message || 'فشل إنشاء حساب المدرس');
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
                <label className="block text-gray-700 font-semibold mb-2">الاسم الكامل / اسم المستخدم</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setUsername(e.target.value);
                  }}
                  placeholder="الاسم الكامل / اسم المستخدم"
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
                  placeholder="كلمة المرور"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الفصل الذي يشرف عليه</label>
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
              {editingId === teacher.id ? (
                // Edit Form
                <form onSubmit={handleEditTeacher} className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">إضافة مدرس جديد</h3>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">الاسم / اسم المستخدم</label>
                    <input
                      type="text"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      placeholder="الاسم"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">كلمة المرور</label>
                    <input
                      type="text"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="كلمة المرور الحالية"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">الفصل الذي يشرف عليه</label>
                    <select
                      value={editClassId}
                      onChange={(e) => setEditClassId(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="">بدون فصل</option>
                      {allClasses.map((cls: any) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} - {cls.day_of_week}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <div className="p-2 bg-red-100 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-2 bg-green-100 text-green-700 rounded-lg text-sm">
                      {success}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
                    >
                      {loading ? 'جارٍ الحفظ...' : 'حفظ'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 font-semibold"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              ) : (
                // Display View
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{teacher.full_name}</h3>
                      <p className="text-gray-600 mt-1 text-sm">👨‍🏫 مدرس</p>
                      {teacher.class_id ? (
                        <p className="text-blue-600 mt-1 text-sm font-semibold">
                          📚 {allClasses.find((c: any) => c.id === teacher.class_id)?.name}
                        </p>
                      ) : (
                        <p className="text-gray-400 mt-1 text-sm">بدون فصل</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(teacher)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50"
                      >
                        ✏️ تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-700 font-semibold disabled:opacity-50"
                      >
                        🗑 حذف
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm border-t pt-4">
                    المعرّف: {teacher.id.substring(0, 8)}...
                  </p>
                </>
              )}
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
