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
    const [descricao, setDescricao] = useState('');
    const [idCategoria, setIdCategoria] = useState('');
    const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);
    if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className='fixed inset-0 z-[999999] bg-black/40 flex items-center justify-center'>
        <div 
          onClick={(e) => e.stopPropagation()}
          className='pointer-events-auto relative flex flex-col items-center w-[720px] max-w-[100%] max-h-[100vh] overflow-y-auto rounded-[1rem] bg-white shadow-[0_0.25rem_0.25rem_0_rgba(0,0,0,0.25)] border p-6 [&::-webkit-scrollbar]:hidden'
        >
           <button
            type="button"
            onClick={onClose}
            className="absolute top-6 left-6 text-black hover:text-gray-600 transition-colors">
            <ArrowLeftIcon className="size-[48px]" />
          </button>

          <h1 className='text-h1 mb-[35px]'>Editar Notícia</h1>

          <div className='w-[366px] h-[52px] border border-[var(--color-azul-dark)] rounded-[10px] flex items-center p-[16px] mb-[30px]'>
            <ChevronUpDownIcon className='size-[24px]'/>
            <select className='w-full h-full px-[16px] text-small cursor-pointer bg-white appearance-none focus:outline-none'>
                <option value="" disabled>Selecione a Categoria</option>
            </select>
          </div>

          <div>
            <label htmlFor="descricao" className="text-body mb-1">Descrição</label>
            <div>
              <textarea id="descricao"
                className="w-[500px] h-[273px] rounded-[15px] border border-[var(--color-bordas)] p-2 resize-none"
                placeholder="Edite a sua notícia..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center border border-[#1A2A4A] rounded-md py-[11px] my-[38px] gap-[5px] bg-[var(--color-azul-principal)] w-[240px] h-[45px] text-white cursor-pointer hover:bg-[var(--color-azul-light)] transition font-bold">
            SALVAR ALTERAÇÕES
          </button>
        </div>
    </div>
  )
}