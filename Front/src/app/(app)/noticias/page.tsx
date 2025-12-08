'use client';

import { useState, useEffect, useCallback } from 'react';

// --- IMPORTS (Caminhos Relativos para evitar erros) ---
import Header from "../../../components/navbar"; 
import CardNoticia from "../../../components/ui/card-noticia";
import ModalNoticia from "../../../components/ui/modal-noticia"; // <--- NOVO IMPORT

import { listarNoticias, desativarNoticia } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { Noticia } from "@/types";
import { PlusIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";

export default function NoticiasPage() {
  const { user } = useAuth();
  
  // --- ESTADOS DA LISTA ---
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  // --- ESTADOS DO MODAL (Novos) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noticiaEditando, setNoticiaEditando] = useState<Noticia | null>(null);

  const LIMIT = 10;

  // --- BUSCA DE DADOS ---
  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);
      const dados = await listarNoticias(page, LIMIT);
      setNoticias(dados.noticias);
      setTotal(dados.totalNoticias);
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      toast.error("Não foi possível carregar as notícias.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // --- AÇÕES (Deletar) ---
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta notícia?")) return;
    try {
      await desativarNoticia(id);
      toast.success("Notícia excluída com sucesso!");
      carregarDados(); 
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir notícia.");
    }
  };

  // --- AÇÕES (Abrir Modal) ---

  // 1. Criar Nova (Botão +)
  const handleOpenCreateModal = () => {
    setNoticiaEditando(null); // Garante que o formulário venha limpo
    setIsModalOpen(true);     // Abre a janelinha
  };

  // 2. Editar Existente (Botão Lápis)
  const handleEdit = (id: number) => {
    // Procura a notícia na lista atual da memória
    const noticiaAlvo = noticias.find((n) => n.id === id);
    
    if (noticiaAlvo) {
      setNoticiaEditando(noticiaAlvo); // Preenche o formulário
      setIsModalOpen(true);            // Abre a janelinha
    }
  };

  // 3. Sucesso (Quando o modal termina de salvar)
  const handleModalSuccess = () => {
    setIsModalOpen(false); // Fecha
    carregarDados();       // Atualiza a lista para mostrar a mudança
  };

  const isAdmin = user?.tipo === 'ADMIN' || user?.tipo === 'ADMINMASTER';

  return (
    // LIMPEZA 1: bg-[var(--color-off-white)] -> bg-off-white
    <main className="min-h-screen bg-off-white pb-20">
      
      <Header />

      <div className="pt-24 px-4 sm:px-8 flex justify-center">
        <div className="w-full max-w-[1000px]">
          
          <div className="flex justify-between items-center mb-8">
            {/* LIMPEZA 2: text-[var(--color-texto-primario)] -> text-texto-primario */}
            <h1 className="text-h2 text-left text-texto-primario">
              Mural de Notícias
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              {/* LIMPEZA 3: border-[var(--color-azul-principal)] -> border-azul-principal */}
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-azul-principal"></div>
            </div>
          ) : noticias.length > 0 ? (
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
                  autorNome={noticia.usuario?.nome || "Usuário"}
                  autorFoto={noticia.usuario?.mediaSrc}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 text-body font-secondary">
              Nenhuma notícia encontrada.
            </div>
          )}

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
                disabled={noticias.length < LIMIT || (page * LIMIT) >= total}
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
          // LIMPEZA 4: Cores simplificadas
          className="fixed bottom-10 right-10 w-16 h-16 bg-azul-principal hover:bg-azul-hover text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-50 cursor-pointer"
          title="Nova Notícia"
        >
          <PlusIcon className="w-8 h-8" />
        </button>
      )}

      <ModalNoticia 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        noticiaParaEditar={noticiaEditando}
        onSuccess={handleModalSuccess}
      />

    </main>
  );
}