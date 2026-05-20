
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
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col shadow-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-cairo text-right">إدارة الفصول</h1>
        <p className="text-gray-400 text-sm mt-2 text-right font-cairo">{profile?.role === 'manager' ? 'مدير' : 'خادم'}</p>
      </div>

      <nav className="flex-1 space-y-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 rounded-lg transition-colors text-right font-cairo ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Button
        variant="danger"
        size="md"
        onClick={onLogout}
        className="w-full"
      >
        تسجيل الخروج
      </Button>
    </div>
  );
}
