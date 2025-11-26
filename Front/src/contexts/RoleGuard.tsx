'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { TipoUsuario } from '../types';
import { toast } from 'sonner';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: TipoUsuario[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {

    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.tipo)) {

        toast.error('Acesso Negado!', {
        description: 'Você não tem permissão para acessar essa área.',
        duration: 4000, // Fica 4 segundos na tela
    });

        router.push('/paginaDenuncia'); 
    }
  }, [isAuthenticated, isLoading, user, router, allowedRoles]);

  if (isLoading || !isAuthenticated) {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.tipo)) {
      return null;
  }

  return <>{children}</>;
}