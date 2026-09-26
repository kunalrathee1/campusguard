import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { users } from '../data/mockData';
import { api } from '../services/api';

interface AuthContextValue {
  currentUser: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (email: string, password: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_CREDENTIALS: Record<string, { password: string; userId: string }> = {
  'admin@campusguard.edu': { password: 'Admin@123', userId: 'u-admin-1' },
  'faculty@campusguard.edu': { password: 'Faculty@123', userId: 'u-fac-1' },
  'student@campusguard.edu': { password: 'Student@123', userId: 'u-stu-1' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('campusguard_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        setCurrentUser(parsed);
      } catch {
        localStorage.removeItem('campusguard_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // 1. Try real backend API first
      const res = await api.auth.login({ email, password });
      if (res && res.success && res.user) {
        localStorage.setItem('campusguard_token', res.token);
        localStorage.setItem('campusguard_user', JSON.stringify(res.user));
        setCurrentUser(res.user);
        setIsLoading(false);
        return { success: true };
      }
    } catch (apiError: any) {
      console.warn('Backend API login error, falling back to local auth if offline:', apiError.message);
    }

    // 2. Custom Users fallback
    const customUsersRaw = localStorage.getItem('custom_users');
    if (customUsersRaw) {
      try {
        const customUsers = JSON.parse(customUsersRaw);
        const customUser = customUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (customUser) {
          setCurrentUser(customUser.user);
          localStorage.setItem('campusguard_user', JSON.stringify(customUser.user));
          setIsLoading(false);
          return { success: true };
        }
      } catch (e) {}
    }

    // 3. Demo fallback
    const cred = DEMO_CREDENTIALS[email.toLowerCase()];
    if (!cred || cred.password !== password) {
      setIsLoading(false);
      return { success: false, error: 'Invalid email or password. Please try again.' };
    }

    const user = users.find((u) => u.id === cred.userId);
    if (!user) {
      setIsLoading(false);
      return { success: false, error: 'User account not found.' };
    }

    setCurrentUser(user);
    localStorage.setItem('campusguard_user', JSON.stringify(user));
    setIsLoading(false);
    return { success: true };
  };

  const registerUser = (email: string, password: string, user: User) => {
    const customUsersRaw = localStorage.getItem('custom_users');
    const customUsers = customUsersRaw ? JSON.parse(customUsersRaw) : [];
    customUsers.push({ email, password, user });
    localStorage.setItem('custom_users', JSON.stringify(customUsers));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('campusguard_user');
    localStorage.removeItem('campusguard_token');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role ?? null,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
