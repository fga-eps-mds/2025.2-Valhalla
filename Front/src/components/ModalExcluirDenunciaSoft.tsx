"use client";

import { 
  ExclamationTriangleIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface ModalExcluirDenunciaSoftProps {
  isOpen: boolean;
  onClose: () => void;
  denunciaId?: number | null;     
  onDeleted?: (id: number) => void;
}

export default function ModalExcluirDenunciaSoft({ 
  isOpen, 
  onClose, 
  denunciaId, 
  onDeleted 
}: ModalExcluirDenunciaSoftProps) {

  if (!isOpen) return null;

  return (
    <div 
      className='fixed inset-0 z-[999999] bg-black/40 flex items-center justify-center backdrop-blur-sm'
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

        {/* Botões */}

      </div>
    </div>
  );
}