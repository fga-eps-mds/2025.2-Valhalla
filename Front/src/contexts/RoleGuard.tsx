'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { TipoUsuario } from '../types';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: TipoUsuario[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('valhalla_token') : null;

  useEffect(() => {

    if (isLoading) return;

    if (!token) {
        router.push('/login');
    }

    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    try {

        const decoded: { exp: number } = jwtDecode(token as string);
        
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            console.warn("Token expirado detectado no Guard.");
            
            toast.warning('Sessão expirada.', {
                description: 'Por favor, faça login novamente.'
            });
            
            logout();
            return;
        }

      } catch (error) {
        console.error("Token inválido:", error);
        logout();
        return;
      }

    if (allowedRoles && user && !allowedRoles.includes(user?.tipo)) {

        toast.error('Acesso Negado!', {
        description: 'Você não tem permissão para acessar essa área.',
        duration: 4000,
    });

        router.push('/'); 
    }
  }, [isAuthenticated, isLoading, user, router, allowedRoles]);

  if (isLoading || !isAuthenticated) {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user?.tipo)) {
      return null;
  }

  return <>{children}</>;
}