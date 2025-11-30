import { createContext, useState, useEffect, ReactNode } from 'react';
import { UserResponse } from '../types/api';

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  setUser: (user: UserResponse | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      window.dispatchEvent(new Event('auth:force-home'));
    };

    window.addEventListener('auth:logout', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:logout', handleUnauthorized);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
