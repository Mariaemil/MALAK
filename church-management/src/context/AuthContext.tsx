import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: any;
  profile: any;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (username: string, password: string, fullName: string, role: string, churchName?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const checkAuth = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const { data, error } = await supabase
            .from('auth_users')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (!error && data) {
            setUser({ id: data.id });
            setProfile(data);
          } else {
            localStorage.removeItem('userId');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      // Query user from custom auth table
      const { data, error } = await supabase
        .from('auth_users')
        .select('*')
        .eq('username', username.toLowerCase())
        .single();

      if (error || !data) {
        throw new Error('اسم المستخدم غير صحيح');
      }

      // Simple password check (in production, use bcrypt comparison on server)
      if (data.password_hash !== password) {
        throw new Error('كلمة المرور غير صحيحة');
      }

      // Store user in state and localStorage
      setUser({ id: data.id });
      setProfile(data);
      localStorage.setItem('userId', data.id);
    } catch (err: any) {
      throw new Error(err.message || 'فشل تسجيل الدخول');
    }
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('userId');
  };

  const signUp = async (username: string, password: string, fullName: string, role: string, churchName?: string) => {
    try {
      // Insert new user into custom auth table
      const { data, error } = await supabase
        .from('auth_users')
        .insert({
          username: username.toLowerCase(),
          password_hash: password,
          full_name: fullName,
          role,
          church_name: churchName || null,
        })
        .select()
        .single();

      if (error) {
        if (error.message.includes('duplicate')) {
          throw new Error('اسم المستخدم موجود بالفعل');
        }
        throw error;
      }

      // Auto-login after signup
      setUser({ id: data.id });
      setProfile(data);
      localStorage.setItem('userId', data.id);
    } catch (err: any) {
      throw new Error(err.message || 'فشل إنشاء الحساب');
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
