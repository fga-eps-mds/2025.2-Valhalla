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
    <div>
      <div>
        {/* O conteúdo do modal virá aqui */}
        Modal de Exclusão
      </div>
    </div>
  );
}