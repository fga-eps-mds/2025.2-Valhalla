"use client";

import { useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ModalReportProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function ModalReport({
  isOpen,
  onClose,
  onConfirm,
}: ModalReportProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Erro na confirmação:", error);
    } finally {
      setLoading(false);
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

        <h2 className="text-2xl font-bold text-gray-900 mb-2 cursor-default">
            {"Reportar Denúncia?"}
        </h2>
        
        <p className="text-gray-500 mb-8 text-sm leading-relaxed cursor-default">
            {"Tem certeza que deseja reportar esta denúncia? Esta ação é irreversível."}
        </p>

        <div className="flex gap-3 w-full">
            <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer"
            >
                {"Cancelar"}
            </button>
            
            <button
                onClick={handleConfirm}
                disabled={loading}
                style={{ backgroundColor: "#DB3C1A" }}
                className="flex-1 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition shadow-md disabled:bg-gray-400 cursor-pointer"
            >
                {loading ? 'Processando...' : "Sim, Reportar"}
            </button>
        </div>
      </div>
    </div>
  );
}
