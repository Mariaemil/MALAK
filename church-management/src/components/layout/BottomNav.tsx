import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  if (profile?.role === 'teacher') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white border-t border-gray-700 md:hidden">
        <div className="flex justify-around items-center">
          <button
            onClick={() => navigate('/my-class')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-semibold transition ${
              isActive('/my-class') ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
          >
            <span className="text-lg">📚</span>
            <span>فصلي</span>
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white border-t border-gray-700 md:hidden">
      <div className="flex justify-around items-center">
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-semibold transition ${
            isActive('/dashboard') ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <span className="text-lg">📊</span>
          <span>نظرة عامة</span>
        </button>
        <button
          onClick={() => navigate('/dashboard/classes')}
          className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-semibold transition ${
            isActive('/dashboard/classes') ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <span className="text-lg">🎓</span>
          <span>الفصول</span>
        </button>
        <button
          onClick={() => navigate('/dashboard/teachers')}
          className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-semibold transition ${
            isActive('/dashboard/teachers') ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <span className="text-lg">👨‍🏫</span>
          <span>الخدام</span>
        </button>
        <button
          onClick={() => navigate('/dashboard/students')}
          className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-semibold transition ${
            isActive('/dashboard/students') ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <span className="text-lg">👥</span>
          <span>الطلاب</span>
        </button>
        <button
          onClick={() => navigate('/dashboard/reports')}
          className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-semibold transition ${
            isActive('/dashboard/reports') ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <span className="text-lg">📈</span>
          <span>التقارير</span>
        </button>
      </div>
    </nav>
  );
}
