import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

interface ManagerLayoutProps {
  children: React.ReactNode;
}

export function ManagerLayout({ children }: ManagerLayoutProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const sidebarItems = [
    { label: 'نظرة عامة', path: '/dashboard' },
    { label: 'الفصول', path: '/dashboard/classes' },
    { label: 'الخدام', path: '/dashboard/teachers' },
    { label: 'المخدومين', path: '/dashboard/students' },
    { label: 'التقارير', path: '/dashboard/reports' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-cairo" dir="rtl">
      <Sidebar items={sidebarItems} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
