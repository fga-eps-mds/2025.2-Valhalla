'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from "../../../components/navbar"; 
import ModalNoticia from "../../../components/ModalAdicionarNoticia";
import { listarNoticias } from "@/utils/api"; // Vamos usar essa função centralizada
import { useAuth } from "@/contexts/AuthContext";
import { PlusIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import { TipoNoticia } from '@/types';
import CardNoticia from '@/components/ui/cardNoticia';

// Interface ajustada para bater com o que o Card espera
interface NoticiaFormatada {
  id: number;
  nomeUsuario: string;
  fotoUsuario?: string | null;
  descricao: string;
  tipo: TipoNoticia;
  data: string; 
}

export default function NoticiasPage() {
  const { user } = useAuth();
  
  // Estados
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listaNoticias, setListaNoticias] = useState<NoticiaFormatada[]>([]); // Estado tipado

  const LIMIT = 10;

  // --- BUSCA UNIFICADA E SEGURA ---
  const carregarDados = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Busca da API (page, limit)
      const dados = await listarNoticias(page, LIMIT);
      
      // FORMATAÇÃO DOS DADOS (O Segredo para o Card funcionar)
      const formatadas: NoticiaFormatada[] = dados.noticias.map((n: any) => ({
        id: n.id,
        // Garante que pega o nome ou fallback
        nomeUsuario: n.usuario?.nome || "Usuário Desconhecido", 
        fotoUsuario: n.usuario?.mediaSrc,
        descricao: n.descricao,
        tipo: n.tipo,
        // Formata a data para string bonita
        data: new Date(n.dataCriacao).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }),
      }));

      setListaNoticias(formatadas);
      setTotal(dados.totalNoticias);

    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      toast.error("Não foi possível carregar as notícias.");
    } finally {
      setIsLoading(false);
    }
  }, [page]); // Recarrega se mudar a página

  // Roda a busca inicial
  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleOpenCreateModal = () => setIsModalOpen(true);
  
  const handleModalSuccess = () => {
    setIsModalOpen(false); 
    carregarDados(); // Atualiza a lista após criar
  };

  const isAdmin = user?.tipo === 'ADMIN' || user?.tipo === 'ADMINMASTER';

  return (
    <main className="min-h-screen bg-branco pb-20">
      
      <div className="pt-24 px-4 sm:px-8 flex justify-center">
        <div className="w-full max-w-[1000px]">
          
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-h2 text-left text-texto-primario">
              Mural de Notícias
            </h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-azul-principal"></div>
            </div>
          ) : listaNoticias.length > 0 ? (
            <div className="space-y-4">
              {listaNoticias.map((noticia) => (
                <CardNoticia
                  key={noticia.id}
                  id={noticia.id}
                  nomeUsuario={noticia.nomeUsuario}
                  fotoUsuario={noticia.fotoUsuario}
                  descricao={noticia.descricao}
                  tipo={noticia.tipo}
                  data={noticia.data}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 text-body font-secondary">
              Nenhuma notícia encontrada.
            </div>
          )}

          {/* Paginação */}
          {total > LIMIT && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-md bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition text-texto-corpo"
              >
                Anterior
              </button>
              <span className="flex items-center font-bold text-azul-dark">
                Página {page}
              </span>
              <button
                disabled={listaNoticias.length < LIMIT || (page * LIMIT) >= total}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-md bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition text-texto-corpo"
              >
                Próxima
              </button>
            </div>
          )}

        </div>
      </div>

      {isAdmin && (
        <button
          onClick={handleOpenCreateModal}
          className="fixed bottom-10 right-10 w-16 h-16 bg-azul-principal hover:bg-azul-hover text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-50 cursor-pointer"
          title="Nova Notícia"
        >
          <PlusIcon className="w-8 h-8" />
        </button>
      )}

      <ModalNoticia 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

    </main>
  );
}
