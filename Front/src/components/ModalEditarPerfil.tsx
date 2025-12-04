"use client";

import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  CameraIcon 
} from '@heroicons/react/24/outline';
import Image from "next/image";
import { useAuth } from '@/contexts/AuthContext';
import { editarUsuario } from '@/utils/api'; 
import { toast } from 'sonner';

interface ModalEditarPerfilProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalEditarPerfil({ isOpen, onClose }: ModalEditarPerfilProps) {
  const { user, login } = useAuth();
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNome(user.nome || '');
    }
  }, [user, isOpen]);

  const handleSave = async () => {
    if (!user?.id) return;
    if (!nome.trim()) {
      toast.error("O nome não pode ficar vazio.");
      return;
    }

    setLoading(true);
    try {
      await editarUsuario({ nome });
      
      const tokenAtual = localStorage.getItem('valhalla_token') || '';
      const novosDados = { ...user, nome }; // Atualiza apenas o nome localmente
      
      login(tokenAtual, novosDados);

      toast.success("Perfil atualizado com sucesso!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className='fixed inset-0 z-999999 bg-black/40 flex items-center justify-center backdrop-blur-sm px-4'>
      
      <div className='bg-white w-full max-w-[600px] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col'>
        
        {/* --- CABEÇALHO --- */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
                    <XMarkIcon className="w-6 h-6 text-gray-900" />
                </button>
                <h2 className="text-xl font-bold text-gray-900">Editar perfil</h2>
            </div>
            <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-texto-primario text-white px-5 py-1.5 rounded-full font-bold text-sm hover:bg-gray-800 transition disabled:opacity-50"
            >
                {loading ? 'Salvando...' : 'Salvar'}
            </button>
        </div>

        {/* --- BANNER (Sem edição) --- */}
        <div className="h-32 bg-gray-300 w-full"></div>

        {/* --- CONTEÚDO CENTRALIZADO --- */}
        <div className="px-5 pb-8 relative flex flex-col items-center">
            
            {/* --- FOTO DE PERFIL (Centralizada) --- */}
            <div className="-mt-16 mb-6 relative w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden group cursor-pointer shadow-sm">
                {user.mediaSrc ? (
                    <Image 
                        src={user.mediaSrc} 
                        alt="Foto" 
                        fill 
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <CameraIcon className="w-10 h-10 text-gray-400" />
                    </div>
                )}
                
                {/* Overlay visual (apenas visual, sem função ainda) */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <CameraIcon className="w-8 h-8 text-white" />
                </div>
            </div>

            {/* --- INPUTS --- */}
            <div className="w-full flex flex-col gap-6">
                
                {/* Input Nome */}
                <div className="relative border border-gray-300 rounded-md focus-within:border-azul-principal focus-within:ring-1 focus-within:ring-azul-principal px-3 py-2 transition-all">
                    <label htmlFor="nome" className="block text-xs text-gray-500 mb-1">
                        Nome
                    </label>
                    <input 
                        type="text" 
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full outline-none text-gray-900 font-medium bg-transparent"
                    />
                </div>

            </div>

        </div>

      </div>
    </div>
  );
}