'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from 'sonner';
import api from "@/utils/api";
import CardDenuncia from "@/components/ui/card-denuncia-gerencia";
import BotaoMenu from "@/components/ui/botao-menu";
import { UsersIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import ModalExcluirDenunciaSoft from "@/components/modalExcluirDenunciaSoft";
import ModalEditarDenuncia from '@/components/modalEditarDenuncia';

interface DenunciaBackend {
  id: number;
  descricao: string;
  idCategoria: number;
  mediaSrc: string | null;
  anonimato: boolean;
  dataCriacao: string;
  usuario: {
    nome: string;
    mediaSrc: string | null;
  };
  categoria: {
    nome: string;
  };
}

type Denuncia = {
  id: number;
  nomeUsuario: string;
  fotoUsuario?: string | null;
  mediaSrc?: string | null;
  descricao: string;
  anonimato: boolean;
  idCategoria?: number;
  categoria: string;
  data: string;
};

export default function Gerencia() {
    
  const { user } = useAuth();
  const router = useRouter();
  
  const [listagemDenuncias, setListagemDenuncias] = useState<Denuncia[]>([]);
  const [totalDePaginas, setTotalDePaginas] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limite, setLimite] = useState(20);

  const [isLoading, setIsloading] = useState(false);

  const [isModalExcluirOpen, setIsModalExcluirOpen] = useState(false);
  const [selectedDenunciaId, setSelectedDenunciaId] = useState<number | null>(null);
  const [isModalEditarOpen, setIsModalEditarOpen] = useState(false);
  const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null);

  useEffect(() => {
    const buscarDenuncias = async () => {
      try {
        setIsloading(true);

        console.log(`denuncias/usuario/${user?.id}?page=${currentPage}&limit=${limite}`);
        const response = await api.get(`/denuncias/usuario/${user?.id}?page=${currentPage}&limit=${limite}`);
        console.log('Resposta da API:', response.data);

        const denunciasFormatadas: Denuncia[] = response.data.denuncias.map((denuncia: DenunciaBackend) => ({
          id: denuncia.id,
          nomeUsuario: denuncia.usuario?.nome,
          fotoUsuario: denuncia.usuario?.mediaSrc,
          mediaSrc: denuncia.mediaSrc,
          descricao: denuncia.descricao,
          anonimato: denuncia.anonimato,
          idCategoria: denuncia.idCategoria,
          categoria: denuncia.categoria.nome,
          data: new Date(denuncia.dataCriacao).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
        }));

        setListagemDenuncias(denunciasFormatadas);
        const totalDeItens = response.data.totalDenuncias;
        setTotalDePaginas(Math.ceil(totalDeItens / limite));

      } catch (error) {
        console.error("Erro ao buscar denúncias:", error);
        toast.error("Erro ao buscar denúncias.");
      } finally {
        setIsloading(false);
      }
    }

    buscarDenuncias();
  }, [currentPage, limite, user]);
  
  if (user?.tipo === 'COMUM') {
      return (
        <main>
          {isLoading ? (
                  <div className="py-12 text-center">
                    <p className="text-gray-500 text-lg">Carregando...</p>
                  </div>
                ) : (
                  <>
                    <section>
                      <div className="container mx-auto max-w-7xl p-4 md:p-8">
                        <div className="grid grid-cols-1 gap-4 md:gap-6">
                          {listagemDenuncias.length > 0 ? (
                            listagemDenuncias.map(denuncia => {
                              return (
                                  <CardDenuncia
                                    key={denuncia.id}
                                    id={denuncia.id}
                                    nomeUsuario={denuncia.nomeUsuario}
                                    fotoUsuario={denuncia.fotoUsuario}
                                    descricao={denuncia.descricao}
                                    anonimato={denuncia.anonimato}
                                    categoria={denuncia.categoria}
                                    data={denuncia.data}
                                    onDelete={(id) => {
                                      setSelectedDenunciaId(id);
                                      setIsModalExcluirOpen(true);
                                    }}
                                    onEdit={(id) => {
                                      const found = listagemDenuncias.find(d => d.id === id) || null;
                                      setSelectedDenuncia(found);
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
                        className="px-4 py-2 rounded bg-white text-black shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-default"
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
                        className="px-4 py-2 rounded bg-white text-black shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-default"
                      >
                        Próximo
                      </button>
                    </section>
                    <ModalExcluirDenunciaSoft 
                            isOpen={isModalExcluirOpen} 
                            onClose={() => setIsModalExcluirOpen(false)}
                            denunciaId={selectedDenunciaId}
                            onDeleted={(id) => setListagemDenuncias(prev => prev.filter(d => d.id !== id))}
                          />

                    <ModalEditarDenuncia
                      isOpen={isModalEditarOpen}
                      onClose={() => setIsModalEditarOpen(false)}
                      denuncia={selectedDenuncia ? {
                        id: selectedDenuncia.id,
                        descricao: selectedDenuncia.descricao,
                        idCategoria: selectedDenuncia.idCategoria ?? 0,
                        anonimato: selectedDenuncia.anonimato,
                        mediaSrc: selectedDenuncia.mediaSrc ?? null,
                      } : null}
                      onSaved={(updated) => {
                        setListagemDenuncias(prev => prev.map(d => d.id === updated.id ? {
                          ...d,
                          descricao: updated.descricao ?? d.descricao,
                          anonimato: updated.anonimato ?? d.anonimato,
                          categoria: updated.categoria?.nome ?? d.categoria,
                        } : d));
                      }}
                    />
                  </>
                )}
        </main>
      );
    } else {
      return (

    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 space-y-6">
      

      {/* Botão 1: Denúncias de Usuários */}
      <BotaoMenu
        icone={<UsersIcon className="w-12 h-12 fill-current" />} // Ícone de grupo
        texto="Denuncias de Usuarios"
        onClick={() => router.push('/denuncias-usuarios')} 
      />

      {/* Botão 2: Minhas Denúncias */}
      <BotaoMenu
        icone={<ChatBubbleLeftIcon className="w-12 h-12 stroke-[2.5]" />} // Ícone de boia/alvo
        texto="Minhas Denuncias"
        onClick={() => router.push('/minhas-denuncias')}
      />

    </div>

      );
    }
}
