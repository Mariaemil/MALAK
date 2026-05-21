import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function TopNavBar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="px-4 py-4 flex justify-between items-center">
        {/* Logo/Title */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">⛪ MALAK</h1>
        </div>

        {/* Center - App Title */}
        <div className="hidden md:flex flex-col items-center">
          <p className="text-lg font-semibold">نظام إدارة الكنيسة</p>
          <p className="text-xs text-gray-400">Church Management System</p>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-semibold">{profile?.full_name}</p>
              <p className="text-xs text-gray-400">
                {profile?.role === 'manager' ? 'مدير' : 'خادم'}
              </p>
            </div>
          </div>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600"
            >
              ⋮
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-xl z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-right px-4 py-3 hover:bg-gray-100 font-semibold text-red-600"
                >
                  تسجيل الخروج / Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
