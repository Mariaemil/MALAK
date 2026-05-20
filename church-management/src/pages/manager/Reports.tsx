import { useState } from 'react';
import { useStudents, useClasses } from '../../hooks/useData';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export function Reports() {
  const { data: students = [] } = useStudents();
  const { data: classes = [] } = useClasses();

  const [fromDate, setFromDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  return (
    <div className="p-8 font-cairo" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">التقارير والإحصائيات</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-gray-600 text-sm mb-2">إجمالي الطلاب</h3>
          <p className="text-4xl font-bold text-blue-600">{students.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-gray-600 text-sm mb-2">إجمالي الفصول</h3>
          <p className="text-4xl font-bold text-green-600">{classes.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">الفلاتر</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">من تاريخ</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">إلى تاريخ</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <h2 className="text-xl font-bold text-gray-800 p-6 border-b">قائمة الطلاب</h2>
        {students.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">لا يوجد طلاب</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-4 text-right font-bold text-gray-700">اسم الطالب</th>
                  <th className="px-6 py-4 text-right font-bold text-gray-700">الفصل</th>
                  <th className="px-6 py-4 text-right font-bold text-gray-700">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student: any) => {
                  const classInfo = classes.find(c => c.id === student.class_id);
                  return (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-800">{student.full_name}</td>
                      <td className="px-6 py-4 text-gray-600">{classInfo?.name || 'غير محدد'}</td>
                      <td className="px-6 py-4 text-gray-600">{new Date().toLocaleDateString('ar-EG')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
