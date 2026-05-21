
import { useNavigate } from 'react-router-dom';
import { useClasses, useStudents, useTeachers } from '../../hooks/useData';
import { useAuth } from '../../context/AuthContext';

export function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: classes = [], isLoading: classesLoading } = useClasses();
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: teachers = [], isLoading: teachersLoading } = useTeachers();

  const isLoading = classesLoading || studentsLoading || teachersLoading;

  const StatCard = ({ icon, label, value, color }: any) => (
    <div className={`bg-gradient-to-br ${color} p-6 rounded-lg shadow-lg text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm mb-1">{label}</p>
          <p className="text-4xl font-bold">{isLoading ? '...' : value}</p>
        </div>
        <div className="text-5xl opacity-30">{icon}</div>
      </div>
    </div>
  );

  const ActionCard = ({ icon, title, description, onClick, color }: any) => (
    <button
      onClick={onClick}
      className={`${color} p-6 rounded-lg shadow-lg hover:shadow-xl transition text-white text-left group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-3xl mb-2">{icon}</p>
          <h3 className="text-xl font-bold group-hover:text-opacity-80">{title}</h3>
        </div>
      </div>
      <p className="text-sm opacity-90">{description}</p>
      <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
        <span className="text-sm font-semibold">اذهب →</span>
      </div>
    </button>
  );

  return (
    <div className="p-6 md:p-8 font-cairo bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">مرحباً بعودتك، {profile?.full_name} 👋</h1>
        <p className="text-gray-600">لوحة التحكم الرئيسية للإدارة</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon="🎓"
          label="إجمالي الفصول"
          value={classes.length}
          color="from-blue-600 to-blue-700"
        />
        <StatCard
          icon="👥"
          label="عدد الطلاب"
          value={students.length}
          color="from-green-600 to-green-700"
        />
        <StatCard
          icon="👨‍🏫"
          label="عدد المدرسين"
          value={teachers.length}
          color="from-purple-600 to-purple-700"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">الإجراءات السريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard
            icon="🎓"
            title="إدارة الفصول"
            description="إضافة وتعديل والتحكم في الفصول الدراسية"
            onClick={() => navigate('/dashboard/classes')}
            color="bg-gradient-to-br from-blue-600 to-blue-700"
          />
          <ActionCard
            icon="👨‍🏫"
            title="إدارة المدرسين"
            description="إضافة وإدارة حسابات المدرسين والتعليمين"
            onClick={() => navigate('/dashboard/teachers')}
            color="bg-gradient-to-br from-purple-600 to-purple-700"
          />
          <ActionCard
            icon="👥"
            title="إدارة الطلاب"
            description="تسجيل الطلاب الجدد وتتبع المعلومات"
            onClick={() => navigate('/dashboard/students')}
            color="bg-gradient-to-br from-green-600 to-green-700"
          />
          <ActionCard
            icon="📊"
            title="التقارير والإحصائيات"
            description="عرض التقارير الشاملة والإحصائيات التفصيلية"
            onClick={() => navigate('/dashboard/reports')}
            color="bg-gradient-to-br from-orange-600 to-orange-700"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📊 ملخص النظام</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-600">الفصول النشطة</span>
              <span className="font-bold text-gray-900">{classes.length}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-600">إجمالي الطلاب</span>
              <span className="font-bold text-gray-900">{students.length}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-600">المدرسون</span>
              <span className="font-bold text-gray-900">{teachers.length}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-600">حالة النظام</span>
              <span className="text-green-600 font-bold">✓ نشط</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📝 مهام سريعة</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard/teachers')}
              className="w-full text-right px-4 py-2 hover:bg-gray-100 rounded transition text-gray-700 font-semibold"
            >
              + إضافة مدرس جديد
            </button>
            <button
              onClick={() => navigate('/dashboard/students')}
              className="w-full text-right px-4 py-2 hover:bg-gray-100 rounded transition text-gray-700 font-semibold"
            >
              + إضافة طالب جديد
            </button>
            <button
              onClick={() => navigate('/dashboard/classes')}
              className="w-full text-right px-4 py-2 hover:bg-gray-100 rounded transition text-gray-700 font-semibold"
            >
              + إضافة فصل جديد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
