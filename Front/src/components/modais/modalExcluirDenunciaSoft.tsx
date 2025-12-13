"use client";

import { useState } from 'react';
import { 
  ExclamationTriangleIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import api from '@/utils/api';

interface ModalExcluirDenunciaSoftProps {
  isOpen: boolean;
  onClose: () => void;
  denunciaId?: number | null;
  onDeleted?: (id: number) => void;
}

export default function ModalExcluirDenunciaSoft({ isOpen, onClose, denunciaId, onDeleted }: ModalExcluirDenunciaSoftProps) {

const [isDeleting, setIsDeleting] = useState(false);


  const handleDeleteDenuncia = async (idParaDeletar?: number) => {
    const id = idParaDeletar ?? denunciaId;
    if (!id) {
      toast.error('ID da denúncia inválido.');
      return;
    }
    setIsDeleting(true);
    try {
      await api.delete(`/denuncias/${id}`);
      toast.success('Denúncia deletada com sucesso!');

      if (onDeleted) onDeleted(id);
      onClose();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao tentar deletar a denúncia.');
    } finally {
      setIsDeleting(false);
    }
  };

if (!isOpen) return null;

  return (
    <div 
      className='fixed inset-0 z-999999 bg-black/40 flex items-center justify-center backdrop-blur-sm'
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className='bg-white rounded-2xl shadow-xl w-[400px] p-6 flex flex-col items-center text-center relative animate-in fade-in zoom-in duration-200'
      >
        
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-[#DB3C1A]" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Excluir Denuncia?
        </h2>
        
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            Tem certeza que deseja excluir essa denúncia?
        </p>

        <div className="flex gap-3 w-full">
            <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
                Cancelar
            </button>
            
            <button
              onClick={() => handleDeleteDenuncia()}
              disabled={isDeleting}
              className="flex-1 py-3 rounded-xl bg-[#DB3C1A] text-white font-semibold hover:bg-[#b02f14] transition shadow-md disabled:opacity-60"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </button>
        </div>

        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
            <XMarkIcon className="w-6 h-6" />
        </button>

      </div>
    </div>
  );
}
