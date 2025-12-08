'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { criarNoticia, editarNoticia } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { Noticia } from '@/types';

interface ModalNoticiaProps {
  isOpen: boolean;
  onClose: () => void;
  noticiaParaEditar?: Noticia | null;
  onSuccess: () => void;
}

export default function ModalNoticia({ 
  isOpen, 
  onClose, 
  noticiaParaEditar, 
  onSuccess 
}: ModalNoticiaProps) {
  
  const { user } = useAuth();
  
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('GERAL');
  const [mediaSrc, setMediaSrc] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (noticiaParaEditar) {
      setDescricao(noticiaParaEditar.descricao);
      setTipo(noticiaParaEditar.tipo);
      setMediaSrc(noticiaParaEditar.mediaSrc || '');
    } else {
      setDescricao('');
      setTipo('GERAL');
      setMediaSrc('');
    }
  }, [noticiaParaEditar, isOpen]);

  const handleSubmit = async () => {
    if (!descricao.trim()) {
      toast.warning("A descrição é obrigatória.");
      return;
    }
    if (!user?.id) {
      toast.error("Erro de autenticação.");
      return;
    }

    setLoading(true);

    try {
      if (noticiaParaEditar) {
        await editarNoticia(noticiaParaEditar.id, {
          descricao,
          tipo,
          mediaSrc: mediaSrc || undefined
        });
        toast.success("Notícia atualizada com sucesso!");
      } else {
        await criarNoticia({
          idUsuario: user.id,
          descricao,
          tipo,
          mediaSrc
        });
        toast.success("Notícia publicada!");
      }

      onSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar notícia.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className='fixed inset-0 z-50 bg-black/40 ...'
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className='bg-white w-full max-w-[600px] rounded-2xl shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200'
      >
        
        {/* CABEÇALHO */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-texto-primario font-serif">
            {noticiaParaEditar ? 'Editar Notícia' : 'Nova Notícia'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* CAMPOS */}
        <div className="p-6 flex flex-col gap-6">
          
          {/* Tipo */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Tipo de Comunicado</label>
            <div className="flex gap-3">
              {['GERAL', 'AVISO', 'EVENTO'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  className={`
                    px-4 py-2 rounded-full text-xs font-bold transition border
                    ${tipo === t 
                      ? 'bg-azul-principal text-white border-azul-principal' 
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Escreva o conteúdo da notícia aqui..."
              className="w-full h-40 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-azul-principal focus:border-transparent outline-none resize-none text-texto-corpo bg-transparent"
            />
          </div>

          {/* Imagem */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Link da Imagem (Opcional)</label>
            <input
              type="text"
              value={mediaSrc}
              onChange={(e) => setMediaSrc(e.target.value)}
              placeholder="https://..."
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-azul-principal outline-none bg-transparent"
            />
          </div>

        </div>

        {/* RODAPÉ */}
        <div className="p-6 pt-0 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-azul-principal hover:bg-azul-hover text-white px-8 py-3 rounded-xl font-bold transition disabled:opacity-50 shadow-md"
          >
            {loading ? 'Salvando...' : (
              <>
                <span>Publicar</span>
                <PaperAirplaneIcon className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}