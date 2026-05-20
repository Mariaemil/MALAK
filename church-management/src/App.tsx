import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { SetupManager } from './pages/SetupManager';
import { Dashboard } from './pages/manager/Dashboard';
import { Classes } from './pages/manager/Classes';
import { Teachers } from './pages/manager/Teachers';
import { Students } from './pages/manager/Students';
import { Reports } from './pages/manager/Reports';
import { Accounts } from './pages/manager/Accounts';
import { MyClass } from './pages/teacher/MyClass';
import { ManagerLayout } from './components/layout/ManagerLayout';
import { TeacherLayout } from './components/layout/TeacherLayout';

const queryClient = new QueryClient();

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { user, profile, loading } = useAuth();

  // قبول المستخدم بعد ثانية حتى لو الملف الشخصي لم يحمل
  if (loading && user === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // إذا كان المستخدم موجود، دعه يدخل حتى لو profile لم يحمل بعد
  if (requiredRole && profile && profile.role !== requiredRole) {
    return <Navigate to={profile.role === 'manager' ? '/dashboard' : '/my-class'} />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { user, profile } = useAuth();

  // Allow setup page without login
  // Also allow login page without login
  if (!user) {
    return (
      <Routes>
        <Route path="/setup" element={<SetupManager />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // دع المستخدم يدخل حتى لو profile لم يحمل بعد
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" />} />
      <Route path="/setup" element={<SetupManager />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="manager">
            <ManagerLayout>
              <Dashboard />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/classes"
        element={
          <ProtectedRoute requiredRole="manager">
            <ManagerLayout>
              <Classes />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/teachers"
        element={
          <ProtectedRoute requiredRole="manager">
            <ManagerLayout>
              <Teachers />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/students"
        element={
          <ProtectedRoute requiredRole="manager">
            <ManagerLayout>
              <Students />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/reports"
        element={
          <ProtectedRoute requiredRole="manager">
            <ManagerLayout>
              <Reports />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/accounts"
        element={
          <ProtectedRoute requiredRole="manager">
            <ManagerLayout>
              <Accounts />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-class"
        element={
          <ProtectedRoute requiredRole="teacher">
            <TeacherLayout>
              <MyClass />
            </TeacherLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          profile ? (
            <Navigate to={profile.role === 'manager' ? '/dashboard' : '/my-class'} />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
