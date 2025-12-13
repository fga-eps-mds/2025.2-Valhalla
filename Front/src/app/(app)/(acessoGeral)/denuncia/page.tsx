'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ModalDenuncia from '@/components/modais/modalDenuncia';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import api from '@/utils/api';
import CardDenuncia from '@/components/ui/cardDenuncia';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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
  descricao: string;
  anonimato: boolean;
  categoria: string;
  data: string;
};

export default function PaginaDenuncias() {

  const [abrirModal, setabrirModal] = useState(false)
  
  const [todasDenuncias, setTodasDenuncias] = useState<Denuncia[]>([]);
  
  const [isLoading, setIsloading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itensPorPagina] = useState(20); 
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');

  const { user } = useAuth();


  const buscarTudo = useCallback(async () => {
    try {
      const response = await api.get(`/denuncias?limit=1000`);
      
      const listaBruta = response.data.denuncias || response.data;
      
      const denunciasFormatadas: Denuncia[] = listaBruta.map((denuncia: DenunciaBackend) => ({
        id: denuncia.id,
        nomeUsuario: denuncia.usuario?.nome,
        fotoUsuario: denuncia.usuario?.mediaSrc,
        descricao: denuncia.descricao,
        anonimato: denuncia.anonimato,
        categoria: denuncia.categoria.nome,
        data: new Date(denuncia.dataCriacao).toLocaleDateString('pt-BR', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        }),
      }));
      
      setTodasDenuncias(denunciasFormatadas);

    } catch (error) {
      console.error("Erro ao buscar denúncias:", error);
      toast.error("Erro ao atualizar lista.");
    } finally {
    }
  }, []);

  useEffect(() => {
    setIsloading(true);
    buscarTudo().finally(() => setIsloading(false));
  }, [buscarTudo]);

  const { dadosVisiveis, totalPaginas } = useMemo(() => {
    
    const filtrados = todasDenuncias.filter((denuncia) => {
      const textoDigitado = termoBusca.toLowerCase();
      const matchTexto = 
        denuncia.descricao.toLowerCase().includes(textoDigitado) ||
        (denuncia.nomeUsuario && denuncia.nomeUsuario.toLowerCase().includes(textoDigitado));

      const matchCategoria = 
        filtroCategoria === 'Todas' || 
        denuncia.categoria === filtroCategoria;

      return matchTexto && matchCategoria;
    });

    const totalPaginasCalc = Math.ceil(filtrados.length / itensPorPagina);
    
    const inicio = (currentPage - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const dadosVisiveisCalc = filtrados.slice(inicio, fim);

    return { 
        dadosVisiveis: dadosVisiveisCalc, 
        totalPaginas: totalPaginasCalc || 1 
    };

  }, [todasDenuncias, termoBusca, filtroCategoria, currentPage, itensPorPagina]);


  useEffect(() => {
    setCurrentPage(1);
  }, [termoBusca, filtroCategoria]);


  return (
    <div className="bg-white min-h-screen relative">
      <main>
            {isLoading ? (
              <div className="py-12 text-center">
                <p className="text-gray-500 text-lg">Carregando todas as denúncias...</p>
              </div>
            ) : (
              <>
                <section>
                  <div className="container mx-auto max-w-7xl p-4 md:p-8">
                    
                    {/* Barra de Pesquisa */}
                    <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-[20px] shadow-lg border border-azul-principal">
                        <div className="relative w-full md:w-2/3">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Pesquisar em todas as denúncias..."
                                className="pl-12 w-full p-3 bg-gray-50 border-none rounded-full focus:ring-2 focus:ring-azul-dark/50 focus:bg-white transition-all outline-none text-gray-700 placeholder-gray-400"
                                value={termoBusca}
                                onChange={(e) => setTermoBusca(e.target.value)}
                            />
                        </div>

                        <div className="w-full md:w-1/3">
                            <select 
                                className="w-full p-3 bg-gray-50 border-none rounded-full px-4 outline-none cursor-pointer text-gray-700 focus:ring-2 focus:ring-azul-dark/50 focus:bg-white transition-all appearance-none"
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}
                                style={{ 
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: `right 1rem center`,
                                    backgroundRepeat: `no-repeat`,
                                    backgroundSize: `1.5em 1.5em` 
                                }}
                            >
                                <option value="Todas">Todas as Categorias</option>
                                <option value="Assédio">Assédio</option>
                                <option value="Fraude">Fraude</option>
                                <option value="Infraestrutura">Infraestrutura</option>
                                <option value="Direitos Humanos">Direitos Humanos</option>
                                <option value="Melhorias">Melhorias</option>
                                <option value="Integridade">Integridade</option>
                            </select>
                        </div>
                    </div>

                    {/* Renderização dos Cards */}
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                      {dadosVisiveis.length > 0 ? (
                        dadosVisiveis.map(denuncia => (
                              <CardDenuncia
                                key={denuncia.id}
                                idDenuncia={denuncia.id}
                                usuarioId={user.id}
                                nomeUsuario={denuncia.nomeUsuario}
                                fotoUsuario={denuncia.fotoUsuario}
                                descricao={denuncia.descricao}
                                anonimato={denuncia.anonimato}
                                categoria={denuncia.categoria}
                                data={denuncia.data}
                              />
                          ))
                      ) : (
                        <p className="col-span-full text-center text-gray-500 text-lg">
                          Ops! Nenhuma Denuncia foi encontrada.
                        </p>
                      )}
                    </div>
                  </div>
                </section>
                
                {/* Paginação Front-end */}
                {totalPaginas > 1 && (
                    <section className="flex justify-center items-center space-x-2 py-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded bg-white text-black shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-default hover:bg-gray-50"
                    >
                        Anterior
                    </button>
                    
                    {/* Lógica simples para mostrar botões de página (limita se houver muitas páginas) */}
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                        .slice(Math.max(0, currentPage - 3), Math.min(totalPaginas, currentPage + 2)) // Mostra apenas algumas páginas próximas
                        .map(pageNumber => (
                        <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-4 py-2 rounded shadow-sm transition-colors ${
                            currentPage === pageNumber 
                            ? 'bg-amarelo text-white' 
                            : 'bg-white text-black hover:bg-gray-50' 
                        }`}
                        >
                        {pageNumber}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPaginas))}
                        disabled={currentPage === totalPaginas}
                        className="px-4 py-2 rounded bg-white text-black shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-default hover:bg-gray-50"
                    >
                        Próximo
                    </button>
                    </section>
                )}
              </>
            )}
      </main>

      {/* Botão flutuante */}
      <button 
      onClick={() => setabrirModal(true)}
      aria-label="Nova Denúncia"
      className="fixed bottom-10 right-10 w-16 h-16 bg-azul-principal hover:bg-azul-hover text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-50 cursor-pointer"
      >
        <PlusIcon className="h-12 w-12 text-white"/>
      </button>

      <ModalDenuncia 
        isOpen={abrirModal}
        onClose={() => setabrirModal(false)}
        onSucess={buscarTudo}
      />
    </div>
  );
}