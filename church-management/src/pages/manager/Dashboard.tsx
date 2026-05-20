
import { useNavigate } from 'react-router-dom';
import { useClasses, useStudents, useTeachers } from '../../hooks/useData';

export function Dashboard() {
  const navigate = useNavigate();
  const { data: classes = [], isLoading: classesLoading } = useClasses();
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: teachers = [], isLoading: teachersLoading } = useTeachers();

  const isLoading = classesLoading || studentsLoading || teachersLoading;

  return (
    <div className="p-8 font-cairo" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">لوحة التحكم</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-gray-600 text-sm mb-2">إجمالي الفصول</h3>
          <p className="text-4xl font-bold text-blue-600">
            {isLoading ? <span className="text-lg">جارٍ التحميل...</span> : classes.length}
          </p>
          <p className="text-gray-500 text-xs mt-2">فصل نشط</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-gray-600 text-sm mb-2">عدد الطلاب</h3>
          <p className="text-4xl font-bold text-green-600">
            {isLoading ? <span className="text-lg">جارٍ التحميل...</span> : students.length}
          </p>
          <p className="text-gray-500 text-xs mt-2">طالب مسجل</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-gray-600 text-sm mb-2">المدرسون</h3>
          <p className="text-4xl font-bold text-purple-600">
            {isLoading ? <span className="text-lg">جارٍ التحميل...</span> : teachers.length}
          </p>
          <p className="text-gray-500 text-xs mt-2">مدرس نشط</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-bold text-blue-900 mb-4">إدارة الفصول</h2>
          <p className="text-blue-700 mb-4">إضافة وتعديل الفصول الدراسية</p>
          <button onClick={() => navigate('/dashboard/classes')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">إدارة الفصول</button>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h2 className="text-xl font-bold text-green-900 mb-4">إدارة الطلاب</h2>
          <p className="text-green-700 mb-4">تسجيل وتتبع الحضور</p>
          <button onClick={() => navigate('/dashboard/students')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">إدارة الطلاب</button>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h2 className="text-xl font-bold text-purple-900 mb-4">إدارة المدرسين</h2>
          <p className="text-purple-700 mb-4">إضافة المدرسين وتعيينهم</p>
          <button onClick={() => navigate('/dashboard/teachers')} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">إدارة المدرسين</button>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <h2 className="text-xl font-bold text-orange-900 mb-4">التقارير</h2>
          <p className="text-orange-700 mb-4">عرض التقارير والإحصائيات</p>
          <button onClick={() => navigate('/dashboard/reports')} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">عرض التقارير</button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-bold text-gray-800 mb-4">النشاطات الأخيرة</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-right py-3 text-gray-600 font-semibold">النوع</th>
              <th className="text-right py-3 text-gray-600 font-semibold">الوصف</th>
              <th className="text-right py-3 text-gray-600 font-semibold">الوقت</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-3">✓ إضافة</td>
              <td className="py-3 text-gray-700">تم إضافة فصل جديد</td>
              <td className="py-3 text-gray-500 text-sm">اليوم</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-3">✓ تعديل</td>
              <td className="py-3 text-gray-700">تم تعديل معلومات الطالب</td>
              <td className="py-3 text-gray-500 text-sm">أمس</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-3">✓ حضور</td>
              <td className="py-3 text-gray-700">تم تسجيل الحضور</td>
              <td className="py-3 text-gray-500 text-sm">2 يوم</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
