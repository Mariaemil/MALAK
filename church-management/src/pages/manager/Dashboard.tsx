
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

  const StatCard = ({ icon, label, value, color, delay = 0 }: any) => (
    <div 
      className="card-modern p-8 bg-gradient-to-br text-white relative overflow-hidden group transform hover:scale-105 smooth animate-fadeInUp"
      style={{
        background: `linear-gradient(135deg, ${color.start} 0%, ${color.end} 100%)`,
        animationDelay: `${delay}s`
      }}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 smooth">
        <div className="absolute inset-0 bg-white rounded-full mix-blend-screen filter blur-3xl"></div>
      </div>
      
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-gray-100 text-sm mb-2 font-medium">{label}</p>
          <p className="text-5xl font-bold group-hover:scale-110 smooth">
            {isLoading ? <span className="animate-pulse">...</span> : value}
          </p>
        </div>
        <div className="text-6xl opacity-40 group-hover:scale-125 group-hover:opacity-60 smooth transform -rotate-12">{icon}</div>
      </div>
    </div>
  );

  const ActionCard = ({ icon, title, description, onClick, gradient, delay = 0 }: any) => (
    <button
      onClick={onClick}
      className="card-modern p-8 rounded-2xl text-white text-left group transform hover:scale-105 smooth cursor-pointer animate-fadeInUp overflow-hidden relative"
      style={{
        background: `linear-gradient(135deg, ${gradient.start}, ${gradient.end})`,
        animationDelay: `${delay}s`
      }}
    >
      {/* Light effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 smooth">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full mix-blend-screen filter blur-3xl"></div>
      </div>

      <div className="relative">
        <div className="text-5xl mb-4 group-hover:scale-125 smooth transform group-hover:-rotate-12 origin-center">{icon}</div>
        <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 smooth">{title}</h3>
        <p className="text-sm opacity-90 group-hover:opacity-100">{description}</p>
        <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 smooth transform group-hover:translate-x-2">
          <span className="text-sm font-semibold">اذهب →</span>
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6 md:p-8 font-cairo" dir="rtl">
      {/* Header */}
      <div className="mb-12 animate-fadeInUp">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent mb-2">
          مرحباً بعودتك، {profile?.full_name} 👋
        </h1>
        <p className="text-lg text-gray-600">لوحة التحكم الرئيسية للإدارة</p>
      </div>

      {/* Stats Grid - Staggered Animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 stagger">
        <StatCard
          icon="🎓"
          label="إجمالي الفصول"
          value={classes.length}
          color={{ start: '#3b82f6', end: '#1e40af' }}
          delay={0}
        />
        <StatCard
          icon="👥"
          label="عدد الطلاب"
          value={students.length}
          color={{ start: '#10b981', end: '#047857' }}
          delay={0.1}
        />
        <StatCard
          icon="👨‍🏫"
          label="عدد المدرسين"
          value={teachers.length}
          color={{ start: '#a855f7', end: '#7c3aed' }}
          delay={0.2}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-fadeInUp">الإجراءات السريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger">
          <ActionCard
            icon="🎓"
            title="إدارة الفصول"
            description="إضافة وتعديل والتحكم في الفصول الدراسية"
            onClick={() => navigate('/dashboard/classes')}
            gradient={{ start: '#3b82f6', end: '#1e40af' }}
            delay={0}
          />
          <ActionCard
            icon="👨‍🏫"
            title="إدارة المدرسين"
            description="إضافة وإدارة حسابات المدرسين والتعليمين"
            onClick={() => navigate('/dashboard/teachers')}
            gradient={{ start: '#a855f7', end: '#6d28d9' }}
            delay={0.1}
          />
          <ActionCard
            icon="👥"
            title="إدارة الطلاب"
            description="تسجيل الطلاب الجدد وتتبع المعلومات"
            onClick={() => navigate('/dashboard/students')}
            gradient={{ start: '#10b981', end: '#047857' }}
            delay={0.2}
          />
          <ActionCard
            icon="📊"
            title="التقارير والإحصائيات"
            description="عرض التقارير الشاملة والإحصائيات التفصيلية"
            onClick={() => navigate('/dashboard/reports')}
            gradient={{ start: '#f59e0b', end: '#d97706' }}
            delay={0.3}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger">
        <div className="card-modern bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl animate-fadeInUp" style={{animationDelay: '0s'}}>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent mb-6">📊 ملخص النظام</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 hover:translate-x-1 smooth">
              <span className="text-gray-700 font-medium">الفصول النشطة</span>
              <span className="text-2xl font-bold text-blue-600">{classes.length}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 hover:translate-x-1 smooth">
              <span className="text-gray-700 font-medium">إجمالي الطلاب</span>
              <span className="text-2xl font-bold text-green-600">{students.length}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 hover:translate-x-1 smooth">
              <span className="text-gray-700 font-medium">المدرسون</span>
              <span className="text-2xl font-bold text-purple-600">{teachers.length}</span>
            </div>
            <div className="flex justify-between items-center pt-2 group">
              <span className="text-gray-700 font-medium">حالة النظام</span>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold text-sm group-hover:shadow-lg group-hover:shadow-green-200 smooth">✓ نشط</span>
            </div>
          </div>
        </div>

        <div className="card-modern bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent mb-6">📝 مهام سريعة</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard/teachers')}
              className="w-full text-right px-4 py-3 hover:bg-purple-50 hover:translate-x-1 smooth rounded-lg transition font-bold text-gray-700 group"
            >
              <span className="group-hover:translate-x-2 smooth inline-block">+ إضافة مدرس جديد</span>
            </button>
            <button
              onClick={() => navigate('/dashboard/students')}
              className="w-full text-right px-4 py-3 hover:bg-green-50 hover:translate-x-1 smooth rounded-lg transition font-bold text-gray-700 group"
            >
              <span className="group-hover:translate-x-2 smooth inline-block">+ إضافة طالب جديد</span>
            </button>
            <button
              onClick={() => navigate('/dashboard/classes')}
              className="w-full text-right px-4 py-3 hover:bg-blue-50 hover:translate-x-1 smooth rounded-lg transition font-bold text-gray-700 group"
            >
              <span className="group-hover:translate-x-2 smooth inline-block">+ إضافة فصل جديد</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
