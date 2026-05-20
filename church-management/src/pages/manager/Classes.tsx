import React, { useState } from 'react';
import { useClasses } from '../../hooks/useData';
import { supabase } from '../../lib/supabase';

const dayLabels: { [key: string]: string } = {
  friday: 'الجمعة',
  thursday: 'الخميس',
  sunday: 'الأحد',
};

export function Classes() {
  const { data: classes = [], refetch } = useClasses();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: err } = await supabase.from('classes').insert({
        name,
        day_of_week: dayOfWeek,
      });

      if (err) throw err;

      setName('');
      setDayOfWeek('');
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
      await supabase.from('classes').delete().eq('id', id);
      refetch();
    } catch (err: any) {
      setError(err.message || 'فشل الحذف');
    }
  };

  return (
    <div className="p-8 font-cairo" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">إدارة الفصول</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'إلغاء' : '+ إضافة فصل جديد'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border mb-8">
          <form onSubmit={handleAddClass} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">اسم الفصل</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسم الفصل"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">اليوم</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">اختر اليوم</option>
                <option value="friday">الجمعة</option>
                <option value="thursday">الخميس</option>
                <option value="sunday">الأحد</option>
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

      {/* Classes Grid */}
      {classes.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border text-center">
          <p className="text-gray-500">لا توجد فصول حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((cls: any) => (
            <div key={cls.id} className="bg-white p-6 rounded-lg border shadow-sm hover:shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{cls.name}</h3>
                  <p className="text-gray-600 mt-1">📅 {dayLabels[cls.day_of_week] || cls.day_of_week}</p>
                </div>
                <button
                  onClick={() => handleDelete(cls.id)}
                  className="text-red-600 hover:text-red-700 font-semibold"
                >
                  🗑 حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
