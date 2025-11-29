"use client";

import React from 'react';

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
        onClick={(e) => e.stopPropagation()} // Impede que clicar no card feche o modal
        className='bg-white rounded-2xl shadow-xl w-[400px] p-6 flex flex-col items-center text-center relative animate-in fade-in zoom-in duration-200'
      >
      </div>
    </div>
  );
}