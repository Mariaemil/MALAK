import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function SideNavDesktop() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  if (profile?.role === 'teacher') {
    return (
      <aside className="hidden md:flex md:w-64 bg-gray-900 text-white flex-col h-screen sticky top-0 border-r border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">📚 My Class</h2>
        </div>
        <nav className="flex-1 p-4">
          <button
            onClick={() => navigate('/my-class')}
            className={`w-full text-right px-4 py-3 rounded-lg mb-2 font-semibold transition ${
              isActive('/my-class')
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            📚 فصلي
          </button>
        </nav>
      </aside>
    );
  }

  return (
    <aside className="hidden md:flex md:w-64 bg-gray-900 text-white flex-col h-screen sticky top-0 border-r border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-lg font-bold text-white">📊 Dashboard</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => navigate('/dashboard')}
          className={`w-full text-right px-4 py-3 rounded-lg font-semibold transition ${
            isActive('/dashboard')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          📊 نظرة عامة
        </button>
        <button
          onClick={() => navigate('/dashboard/classes')}
          className={`w-full text-right px-4 py-3 rounded-lg font-semibold transition ${
            isActive('/dashboard/classes')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          🎓 الفصول
        </button>
        <button
          onClick={() => navigate('/dashboard/teachers')}
          className={`w-full text-right px-4 py-3 rounded-lg font-semibold transition ${
            isActive('/dashboard/teachers')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          👨‍🏫 الخدام
        </button>
        <button
          onClick={() => navigate('/dashboard/students')}
          className={`w-full text-right px-4 py-3 rounded-lg font-semibold transition ${
            isActive('/dashboard/students')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          👥 الطلاب
        </button>
        <button
          onClick={() => navigate('/dashboard/reports')}
          className={`w-full text-right px-4 py-3 rounded-lg font-semibold transition ${
            isActive('/dashboard/reports')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          📈 التقارير
        </button>
      </nav>
    </aside>
  );
}
