import React, { useState } from 'react';
import { useStudents, useClasses } from '../../hooks/useData';
import { supabase } from '../../lib/supabase';

export function Students() {
  const { data: students = [], refetch } = useStudents();
  const { data: classes = [] } = useClasses();
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: err } = await supabase.from('students').insert({
        full_name: fullName,
        class_id: classId,
      });

      if (err) throw err;

      setFullName('');
      setClassId('');
      setShowForm(false);
      refetch();
    } catch (err: any) {
      setError(err.message || 'فشل الحفظ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;

    try {
      await supabase.from('students').delete().eq('id', id);
      refetch();
    } catch (err: any) {
      setError(err.message || 'فشل الحذف');
    }
  };

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || 'غير محدد';
  };

  return (
    <div className="p-8 font-cairo" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">إدارة الطلاب</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'إلغاء' : '+ إضافة طالب'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border mb-8">
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">اسم الطالب الكامل</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أدخل اسم الطالب"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">الفصل</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">اختر الفصل</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex gap-3 justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'جارٍ الحفظ...' : 'حفظ'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {students.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">لا يوجد طلاب حالياً</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-4 text-right font-bold text-gray-700">اسم الطالب</th>
                  <th className="px-6 py-4 text-right font-bold text-gray-700">الفصل</th>
                  <th className="px-6 py-4 text-right font-bold text-gray-700">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student: any) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800">{student.full_name}</td>
                    <td className="px-6 py-4 text-gray-600">{getClassName(student.class_id)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-700 font-semibold"
                      >
                        🗑 حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-lg border border-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
