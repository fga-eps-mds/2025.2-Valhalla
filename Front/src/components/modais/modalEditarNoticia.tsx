"use client";

import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import api from '@/utils/api'; 
import { toast } from 'sonner';
import { TipoNoticia } from "@/types";

// Interface for the news object structure expected by the modal
export interface Noticia {
  id: number;
  descricao: string;
  tipo: TipoNoticia;
  mediaSrc?: string;
}

// Updated props interface to match what Gerencia.tsx is passing
interface ModalEditarProps {
  isOpen: boolean;
  onClose: () => void;
  // Renamed to match parent: 'noticia'
  noticia: Noticia | null; 
  // Renamed to match parent: 'onSaved' (and updated signature to expect the updated object)
  onSaved: (updated: any) => void; 
}

export default function ModalEditarNoticia({ isOpen, onClose, noticia, onSaved }: ModalEditarProps) {
  const [descricao, setDescricao] = useState('');
  const [tipoNoticia, setTipoNoticia] = useState<TipoNoticia | ''>('');

  // EFFECT: Populate form fields when the modal opens with a news item
  useEffect(() => {
    if (noticia) {
      setDescricao(noticia.descricao);
      setTipoNoticia(noticia.tipo);
    }
  }, [noticia]); // Re-run whenever 'noticia' prop changes

  const salvarEdicao = async () => {
    if (!noticia) return;

    if (!descricao.trim() || !tipoNoticia) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Using PATCH instead of PUT for partial updates
      const response = await api.patch(`/noticias/${noticia.id}`, {
        descricao: descricao,
        tipo: tipoNoticia,
      });

      toast.success("Notícia atualizada com sucesso!");
      
      // Call onSaved with the updated data returned from the backend
      onSaved(response.data); 
      
      onClose();
    } catch (error) {
      toast.error("Erro ao atualizar notícia.");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className='fixed inset-0 z-[999999] bg-black/40 flex items-center justify-center'>
        <div 
          onClick={(e) => e.stopPropagation()}
          className='pointer-events-auto relative flex flex-col items-center w-[720px] max-w-[100%] max-h-[100vh] overflow-y-auto rounded-[1rem] bg-white shadow-lg border p-6 [&::-webkit-scrollbar]:hidden'
        >
           <button
            type="button"
            onClick={onClose}
            className="absolute top-6 left-6 text-black hover:text-gray-600 transition-colors">
            <ArrowLeftIcon className="size-[48px]" />
          </button>

          <h1 className='text-h1 mb-[35px]'>Editar Notícia</h1>
          
          {/* Tipo Selection */}
          <div className="flex flex-col gap-2 mb-6 w-full max-w-[500px]">
            <label className="text-body font-bold text-left">Tipo de Notícia</label>
            <div className="flex gap-3 justify-center">
              {['GERAL', 'AVISO', 'EVENTO'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setTipoNoticia(cat as TipoNoticia)}
                  className={`
                    px-6 py-2 rounded-full text-sm font-bold transition border
                    ${tipoNoticia === cat 
                      ? 'bg-azul-principal text-white border-azul-principal' 
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description Input */}
          <div className="mb-8">
            <label htmlFor="descricao" className="text-body mb-2 block font-bold text-left w-[500px]">Descrição</label>
            <div>
              <textarea id="descricao"
                className="w-[500px] h-[273px] rounded-[15px] border border-gray-300 p-4 resize-none focus:outline-none focus:border-azul-principal transition-colors"
                placeholder="Edite a sua notícia..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            onClick={salvarEdicao}
            className="flex items-center justify-center border border-[#1A2A4A] rounded-md py-[11px] gap-[5px] bg-azul-principal w-[240px] h-[45px] text-white cursor-pointer hover:bg-azul-light transition font-bold uppercase tracking-wide">
            SALVAR ALTERAÇÕES
          </button>
        </div>
    </div>
  )
}