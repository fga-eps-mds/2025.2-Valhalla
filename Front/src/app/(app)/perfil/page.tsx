'use client';

import React, { useEffect, useState } from 'react';
import { 
    UserIcon, 
    AcademicCapIcon, 
    KeyIcon, 
    ArrowRightStartOnRectangleIcon, 
    TrashIcon
} from '@heroicons/react/24/outline';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ModalEditarSenha from '@/components/modalEditarSenha'; 
import ModalExcluirConta from '@/components/ModalExcluirContaSoft';
import ModalEditarPerfil from '@/components/ModalEditarPerfil';

import Link from "next/link";

export default function Perfil() {
    const { user, logout, isLoading } = useAuth(); 
    const router = useRouter();
    const [isModalSenhaOpen, setIsModalSenhaOpen] = useState(false);
    const [isModalExcluirOpen, setIsModalExcluirOpen] = useState(false);
    const [isModalPerfilOpen, setIsModalPerfilOpen] = useState(false);
    
    

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login'); 
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azul-principal"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-[calc(100vh-80px)] w-full bg-white flex flex-col items-center py-12 px-4">
            
            <div className="flex flex-col items-center mb-12">
                <div className="w-32 h-32 rounded-full border border-gray-400 flex items-center justify-center mb-6 overflow-hidden relative bg-white">
                    {user.mediaSrc ? (
                        <Image 
                            src={user.mediaSrc} 
                            alt={`Foto de ${user.nome}`}
                            fill 
                            className="object-cover"
                        />
                    ) : (
                        <UserIcon className="w-20 h-20 text-gray-800 stroke-1" />
                    )}
                </div>

                <h1 className="text-[32px] text-texto-primario font-(--fonte-primaria) mb-1 text-center capitalize">
                    {user.nome}
                </h1>
                <p className="text-lg text-texto-primario font-(--fonte-primaria)">
                    {user.email}
                </p>
            </div>

            <div className="w-full max-w-[500px] flex flex-col gap-5 items-center">

                <button onClick={() => setIsModalPerfilOpen(true)}
                className="w-full flex items-center justify-start px-6 py-4 rounded-2xl border border-gray-400 text-gray-600 hover:bg-gray-50 transition group">
                    <AcademicCapIcon className="w-6 h-6 text-azul-dark mr-4" />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                        Clique aqui para editar seu perfil
                    </span>
                </button>

                
                    <button onClick={() => setIsModalSenhaOpen(true)}
                    className="w-full flex items-center justify-start px-6 py-4 rounded-2xl border border-gray-400 text-gray-600 hover:bg-gray-50 transition group">
                        <KeyIcon className="w-6 h-6 text-azul-dark mr-4" />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                            Clique aqui para alterar sua senha
                        </span>
                    </button>
                

                <button 
                    onClick={logout} 
                    className="w-[200px] flex items-center justify-center px-6 py-3 mt-2 mb-2 rounded-xl bg-azul-principal text-white hover:bg-[#254c9b] transition shadow-md font-bold text-sm gap-2 border border-azul-dark"
                >
                    LOGOUT
                    <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                </button>

                {user.tipo !== 'ADMINMASTER' && (
                    <button onClick={() => setIsModalExcluirOpen(true)}
                    className="w-[200px] flex items-center justify-center px-6 py-3 mt-2 mb-2 rounded-xl bg-[#DB3C1A] text-white hover:bg-[#b02f14] transition shadow-md font-bold text-sm gap-2 border border-azul-dark">
                        EXCLUIR CONTA
                        <TrashIcon className="w-5 h-5" />
                    </button>
                )}

            </div>
            <ModalEditarSenha 
        isOpen={isModalSenhaOpen} 
        onClose={() => setIsModalSenhaOpen(false)} 
    />
    <ModalExcluirConta 
                isOpen={isModalExcluirOpen} 
                onClose={() => setIsModalExcluirOpen(false)} 
            />
    <ModalEditarPerfil 
                isOpen={isModalPerfilOpen} 
                onClose={() => setIsModalPerfilOpen(false)} 
            />
        </div>
    );
}