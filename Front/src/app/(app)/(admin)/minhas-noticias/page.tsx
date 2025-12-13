'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from 'sonner';
import api from "@/utils/api";
import { TipoNoticia } from "@/types";
import CardNoticia from "@/components/ui/cardNoticiaGerencia";
import ModalExcluirNoticiaSoftProps from "@/components/modais/modalExcluirNoticiaSoft";
import ModalEditarNoticia from "@/components/modais/modalEditarNoticia";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

interface CardNoticia {
  id: number;
  nomeUsuario: string;
  fotoUsuario?: string | null;
  descricao: string;
  tipo: TipoNoticia;
  data: string;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

interface NoticiaBackend {
  id: number;
  descricao: string;
  mediaSrc: string | null;
  dataCriacao: string;
  dataUpdate: string;
  idUsuario: number;
  tipo: TipoNoticia;
  usuario: {
          nome: string;
          mediaSrc: string | null;
      };
}

export default function Gerencia() {
    
  const { user } = useAuth();
  
  // --- ESTADOS DA LISTA ---
  const [isLoading, setIsLoading] = useState(true);
  const [totalDePaginas, setTotalDePaginas] = useState(1);

  // --- ESTADOS DO MODAL (Novos) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todasNoticias, setTodasNoticias] = useState<CardNoticia[]>([]);

  const [isModalExcluirOpen, setIsModalExcluirOpen] = useState(false);
  const [selectedNoticiaId, setSelectedNoticiaId] = useState<number | null>(null);

  const [isModalEditarOpen, setIsModalEditarOpen] = useState(false);
  const [selectedNoticia, setSelectedNoticia] = useState<CardNoticia | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [limite, setLimite] = useState(20);

    useEffect(() => {
    const buscarTudo = async () => {
      try {
        setIsLoading(true);

        const response = await api.get(`/noticias/usuario/${user?.id}?page=${currentPage}&limit=${limite}`);

        const listaBruta = response.data.noticias || response.data;

        const noticiasFormatadas: CardNoticia[] = listaBruta.map((noticia: NoticiaBackend) => ({
          id: noticia.id,
          nomeUsuario: noticia.usuario?.nome,
          fotoUsuario: noticia.usuario?.mediaSrc,
          descricao: noticia.descricao,
          tipo: noticia.tipo,
          data: new Date(noticia.dataCriacao).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
        }));

        setTodasNoticias(noticiasFormatadas);

      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
        toast.error("Erro ao buscar notícias.");
      } finally {
        setIsLoading(false);
      }
    }

    buscarTudo();
  }, []); 

return (
        <main>
          {isLoading ? (
                  <div className="py-12 text-center">
                    <div className="max-w-7xl pt-8 mx-auto w-full flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <Link href="/gerencia" className="p-2 rounded-full hover:bg-gray-200 transition">
                              <ArrowLeftIcon className="w-6 h-6 text-azul-dark" />
                          </Link>
                      </div>
                    </div>
                    <p className="text-gray-500 text-lg">Carregando...</p>
                  </div>
                ) : (
                  <>
                    <section>
                      <div className="container mx-auto max-w-7xl p-4 md:p-8">
                        <div className="max-w-7xl pt-8 mx-auto w-full flex items-center justify-between">
                          <div className="flex items-center gap-4">
                              <Link href="/gerencia" className="p-2 rounded-full hover:bg-gray-200 transition">
                                  <ArrowLeftIcon className="w-6 h-6 text-azul-dark" />
                              </Link>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 pt-8 gap-4 md:gap-6">
                          {todasNoticias.length > 0 ? (
                            todasNoticias.map(noticia => {
                              return (
                                  <CardNoticia
                                    key={noticia.id}
                                    id={noticia.id}
                                    nomeUsuario={noticia.nomeUsuario}
                                    fotoUsuario={noticia.fotoUsuario}
                                    descricao={noticia.descricao}
                                    tipo={noticia.tipo}
                                    data={noticia.data}
                                    onDelete={(id) => {
                                      setSelectedNoticiaId(id);
                                      setIsModalExcluirOpen(true);
                                    }}
                                    onEdit={(id) => {
                                      const found = todasNoticias.find(d => d.id === id) || null;
                                      setSelectedNoticia(found);
                                      setIsModalEditarOpen(true);
                                    }}
                                  />
                              );
                            })
                          ) : (
                            <p className="col-span-full text-center text-gray-500 text-lg">
                              Ops! Nenhuma Denuncia foi encontrada.
                            </p>
                          )}
                        </div>
                      </div>
                    </section>
                    <section className="flex justify-center items-center space-x-2 py-8">
                      
                      {/* Botão "Anterior" */}
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded bg-white text-black shadow-sm disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      {/* Botões de Número */}
                      {Array.from({ length: totalDePaginas }, (_, i) => i + 1).map(pageNumber => (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-4 py-2 rounded shadow-sm ${
                            currentPage === pageNumber 
                            ? 'bg-amarelo text-white' 
                            : 'bg-white text-black' 
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      {/* Botão "Próximo" */}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalDePaginas))}
                        disabled={currentPage === totalDePaginas}
                        className="px-4 py-2 rounded bg-white text-black shadow-sm disabled:opacity-50"
                      >
                        Próximo
                      </button>
                    </section>
                    <ModalExcluirNoticiaSoftProps 
                            isOpen={isModalExcluirOpen} 
                            onClose={() => setIsModalExcluirOpen(false)}
                            noticiaId={selectedNoticiaId}
                            onDeleted={(id) => setTodasNoticias(prev => prev.filter(d => d.id !== id))}
                          />
                    <ModalEditarNoticia
                      isOpen={isModalEditarOpen}
                      onClose={() => setIsModalEditarOpen(false)}
                      noticia={selectedNoticia ? {
                        id: selectedNoticia.id,
                        descricao: selectedNoticia.descricao,
                        tipo: selectedNoticia.tipo,
                      } : null}
                      onSaved={(updated) => {
                        setTodasNoticias(prev => prev.map(d => d.id === updated.id ? {
                          ...d,
                          descricao: updated.descricao ?? d.descricao,
                          tipo: updated.tipo ?? d.tipo,
                        } : d));
                      }}
                    />
                  </>
                )}
        </main>
      );
}