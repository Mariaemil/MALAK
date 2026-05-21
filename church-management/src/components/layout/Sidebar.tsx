
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface SidebarItem {
  label: string;
  path: string;
  icon?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  onLogout: () => void;
}

export function Sidebar({ items, onLogout }: SidebarProps) {
  const location = useLocation();
  const { profile } = useAuth();

  return (
    <div className="w-64 bg-white text-gray-900 min-h-screen p-6 flex flex-col shadow-2xl border-r-4 border-blue-600">
      {/* Logo/Header Section */}
      <div className="mb-10">
        <div className="text-center pb-6 border-b-2 border-gray-200">
          <div className="text-4xl mb-2">⛪</div>
          <h1 className="text-2xl font-bold font-cairo text-gray-900">إدارة الفصول</h1>
        </div>
      </div>

      {/* Profile Card */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
        <p className="text-xs font-semibold text-blue-600 font-cairo mb-2">حسابك</p>
        <p className="text-sm font-bold font-cairo text-gray-900">
          {profile?.role === 'manager' ? '👨‍💼 مدير النظام' : '👨‍🏫 خادم'}
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1">
        <p className="text-xs font-bold text-gray-500 font-cairo mb-4 uppercase tracking-wider">القائمة</p>
        <div className="space-y-2">
          {items.map((item, index) => {
            const isActive = location.pathname === item.path;
            const icons: { [key: number]: string } = {
              0: '📊',
              1: '📚',
              2: '👨‍🏫',
              3: '👥',
              4: '📈',
            };
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-cairo text-right transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md font-bold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{icons[index]}</span>
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout Section */}
      <div className="pt-6 border-t-2 border-gray-200 space-y-3">
        <Button
          variant="danger"
          size="md"
          onClick={onLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
        >
          🚪 تسجيل الخروج
        </Button>
      </div>
    </div>
  );
}
