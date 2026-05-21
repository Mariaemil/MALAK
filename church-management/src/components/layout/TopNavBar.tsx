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
    <nav className="bg-gradient-to-r from-gray-950 via-gray-900 to-purple-950 text-white shadow-depth sticky top-0 z-50 backdrop-filter backdrop-blur-sm bg-opacity-95 border-b border-purple-500 border-opacity-10">
      <div className="px-6 py-4 flex justify-between items-center animate-fadeIn">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 smooth">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-xl shadow-lg group-hover:shadow-purple-500/50 smooth">
            ⛪
          </div>
          <div className="hidden sm:flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">MALAK</h1>
            <p className="text-xs text-purple-300">Church Management</p>
          </div>
        </div>

        {/* Center - App Title */}
        <div className="hidden md:flex flex-col items-center animate-slideInRight" style={{animationDelay: '0.1s'}}>
          <p className="text-lg font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">نظام إدارة الكنيسة</p>
          <p className="text-xs text-gray-400">Church Management System</p>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4 animate-slideInRight" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center gap-3 px-4 py-2 bg-white bg-opacity-5 rounded-lg backdrop-filter backdrop-blur-sm border border-white border-opacity-10 hover:bg-opacity-10 smooth">
            <div className="text-right">
              <p className="text-sm font-semibold">{profile?.full_name}</p>
              <p className="text-xs text-purple-300">
                {profile?.role === 'manager' ? 'مدير' : 'خادم'}
              </p>
            </div>
          </div>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-11 h-11 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center hover:from-purple-500 hover:to-purple-600 smooth shadow-lg hover:shadow-purple-500/50 transform hover:scale-110"
            >
              ⋮
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-lg shadow-depth border border-purple-500 border-opacity-20 animate-scaleIn z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-right px-4 py-3 hover:bg-red-600 hover:bg-opacity-20 font-semibold text-red-400 rounded-lg transition smooth"
                >
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
