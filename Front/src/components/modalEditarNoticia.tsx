"use client";

import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import api from '@/utils/api'; 
import { toast } from 'sonner';

interface Categoria {
  id: number;
  nome: string;
}

export interface Noticia {
  id: number;
  descricao: string;
  idCategoria: number;
  mediaSrc?: string;
}

interface ModalEditarProps {
  isOpen: boolean;
  onClose: () => void;
  noticiaParaEditar: Noticia | null;
  aoAtualizar: () => void;
}

export default function ModalEditarNoticia({ isOpen, onClose, noticiaParaEditar, aoAtualizar }: ModalEditarProps) {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className='fixed inset-0 z-[999999] bg-black/40 flex items-center justify-center'>
        <div 
          onClick={(e) => e.stopPropagation()}
          className='pointer-events-auto relative flex flex-col items-center w-[720px] max-w-[100%] max-h-[100vh] overflow-y-auto rounded-[1rem] bg-white shadow-[0_0.25rem_0.25rem_0_rgba(0,0,0,0.25)] border p-6 [&::-webkit-scrollbar]:hidden'
        >
           {/* virá adição aqui */}
        </div>
    </div>
  )
}