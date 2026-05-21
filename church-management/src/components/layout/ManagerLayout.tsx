import React from 'react';
import { TopNavBar } from './TopNavBar';
import { SideNavDesktop } from './SideNavDesktop';
import { BottomNav } from './BottomNav';

interface ManagerLayoutProps {
  children: React.ReactNode;
}

export function ManagerLayout({ children }: ManagerLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-50 font-cairo" dir="rtl">
      <TopNavBar />
      <div className="flex flex-1 overflow-hidden">
        <SideNavDesktop />
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
