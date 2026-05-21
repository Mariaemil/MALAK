import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStudents, useClasses } from '../../hooks/useData';

export function MyClass() {
  const { user, profile } = useAuth();
  // Filter students by teacher's assigned class only
  const { data: students = [] } = useStudents(profile?.class_id);
  const { data: classes = [] } = useClasses();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Show only the teacher's assigned class
  const teacherClasses = profile?.class_id 
    ? classes.filter((cls: any) => cls.id === profile.class_id)
    : [];
  
  return (
    <div className="p-8 font-cairo" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">فصلي</h1>

      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-lg mb-8 shadow">
        <h2 className="text-2xl font-bold mb-2">مرحباً بك يا {profile?.full_name}</h2>
        <p className="text-blue-100">أنت تدرس في {teacherClasses.length} فصل</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-gray-600 text-sm mb-2">عدد الطلاب</h3>
          <p className="text-4xl font-bold text-blue-600">{students.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-gray-600 text-sm mb-2">عدد الفصول</h3>
          <p className="text-4xl font-bold text-green-600">{teacherClasses.length}</p>
        </div>
      </div>

      {/* Attendance Section */}
      <div className="bg-white p-6 rounded-lg border mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">تسجيل الحضور</h2>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">اختر التاريخ</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {students.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">لا يوجد طلاب في الفصل حالياً</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-4 text-right font-bold text-gray-700">اسم الطالب</th>
                  <th className="px-6 py-4 text-right font-bold text-gray-700">الحضور</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student: any) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800">{student.full_name}</td>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded"
                        defaultChecked={false}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {students.length > 0 && (
          <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">
            حفظ الحضور
          </button>
        )}
      </div>

      {/* Classes Section */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-bold text-gray-800 mb-4">فصولي</h2>
        {teacherClasses.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">لم يتم تعيين أي فصول لك</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teacherClasses.map((cls: any) => (
              <div key={cls.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <h3 className="font-bold text-gray-800">{cls.name}</h3>
                <p className="text-gray-600 text-sm mt-1">📅 يوم {cls.day_of_week}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
