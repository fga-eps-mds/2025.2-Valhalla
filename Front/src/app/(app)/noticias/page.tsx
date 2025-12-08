'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from "../../../components/navbar";
import CardNoticia from "@/components/ui/card-noticia"; 
import { listarNoticias, desativarNoticia } from "@/utils/api";
import { Noticia } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { PlusIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";

export default function NoticiasPage() {
  const { user } = useAuth();
  
  // --- ESTADOS (A Memória da Tela) ---
  const [noticias, setNoticias] = useState<Noticia[]>([]); // Lista de notícias
  const [loading, setLoading] = useState(true);            // Carregando?
  const [page, setPage] = useState(1);                     // Página atual
  const [total, setTotal] = useState(0);                   // Total de notícias no banco
  
  const LIMIT = 10; // Quantas notícias por vez?

  // --- BUSCAR DADOS (O Pedido ao Backend) ---
  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);
      // Chama a função que criamos no api.ts
      const dados = await listarNoticias(page, LIMIT);
      
      // Atualiza a memória com o que veio do Backend
      setNoticias(dados.noticias);
      setTotal(dados.totalNoticias);
      
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      toast.error("Não foi possível carregar as notícias.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Executa a busca assim que a tela abre ou a página muda
  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // --- AÇÕES DO CARD ---
  
  const handleDelete = async (id: number) => {
    // Passo 1: Confirmação simples (Melhoraremos na Aula 6 com Modal)
    if (!confirm("Tem certeza que deseja excluir esta notícia?")) return;

    // Passo 2: Chamada API
    try {
      await desativarNoticia(id);
      toast.success("Notícia excluída com sucesso!");
      carregarDados(); // Recarrega a lista para sumir com o item
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir notícia.");
    }
  };

  const handleEdit = (id: number) => {
    // Vamos implementar isso na próxima aula (Aula 5)
    console.log("Editar ID:", id);
    toast.info("A edição será criada na próxima etapa!");
  };

  const handleOpenCreateModal = () => {
    // Vamos implementar isso na próxima aula (Aula 5)
    toast.info("A criação será criada na próxima etapa!");
  };

  // Verifica permissão para mostrar o botão "+"
  const isAdmin = user?.tipo === 'ADMIN' || user?.tipo === 'ADMINMASTER';

  return (
    <main className="min-h-screen bg-[var(--color-off-white)] pb-20">
      
      {/* 1. Navbar */}
      <Header />

      {/* 2. Área Principal */}
      <div className="pt-24 px-4 sm:px-8 flex justify-center">
        <div className="w-full max-w-[1000px]">
          
          {/* Cabeçalho da Seção */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-h2 text-left text-[var(--color-texto-primario)]">
              Mural de Notícias
            </h1>
          </div>

          {/* 3. Conteúdo Dinâmico */}
          {loading ? (
            // SKELETON / LOADING
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-azul-principal)]"></div>
            </div>
          ) : noticias.length > 0 ? (
            // LISTA DE CARDS
            <div className="flex flex-col gap-6">
              {noticias.map((noticia) => (
                <CardNoticia
                  key={noticia.id}
                  id={noticia.id}
                  descricao={noticia.descricao}
                  tipo={noticia.tipo}
                  mediaSrc={noticia.mediaSrc}
                  dataCriacao={noticia.dataCriacao}
                  autorId={noticia.idUsuario}
                  // Proteção contra autor nulo
                  autorNome={noticia.usuario?.nome || "Usuário"}
                  autorFoto={noticia.usuario?.mediaSrc}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            // LISTA VAZIA
            <div className="text-center py-20 text-gray-500 text-body font-[var(--fonte-secundaria)]">
              Nenhuma notícia encontrada.
            </div>
          )}

          {/* 4. Paginação */}
          {total > LIMIT && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-md bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition text-[var(--color-texto-corpo)]"
              >
                Anterior
              </button>
              <span className="flex items-center font-bold text-[var(--color-azul-dark)]">
                Página {page}
              </span>
              <button
                disabled={noticias.length < LIMIT || (page * LIMIT) >= total}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-md bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition text-[var(--color-texto-corpo)]"
              >
                Próxima
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 5. Botão Flutuante (FAB) - Só aparece para Admin */}
      {isAdmin && (
        <button
          onClick={handleOpenCreateModal}
          className="fixed bottom-10 right-10 w-16 h-16 bg-[var(--color-azul-principal)] hover:bg-[var(--color-azul-hover)] text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-50 cursor-pointer"
          title="Nova Notícia"
        >
          <PlusIcon className="w-8 h-8" />
        </button>
      )}

    </main>
  );
}