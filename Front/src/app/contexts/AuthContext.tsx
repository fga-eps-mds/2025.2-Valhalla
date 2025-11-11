'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getOneUsuario } from '../utils/api';

interface AuthContextType {
  loggedInUser: any;
  setLoggedInUser: (user: any) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded: { sub?: string } = jwtDecode(token);
          if (decoded.sub) {
            const userData = await getOneUsuario(Number(decoded.sub));
            setLoggedInUser(userData);
          }
        } catch (error) {
          console.error("Falha ao carregar dados do usuário logado:", error);
          setLoggedInUser(null);
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const value = { loggedInUser, setLoggedInUser, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};