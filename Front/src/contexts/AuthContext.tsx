'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Usuario } from '../types';

const STORAGE_KEY_TOKEN = 'valhalla_token';
const STORAGE_KEY_USER = 'valhalla_user';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: Usuario) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const carregarSessao = () => {
      const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Erro ao restaurar sessão:", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    carregarSessao();
  }, []);

  const login = (token: string, userData: Usuario) => {

    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
    
    setUser(userData);
    
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
    setUser(null);
    
    router.push('/');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user,
        isLoading, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};