'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '@/utils/api';
import CardDenuncia from '@/components/ui/cardDenuncia';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

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
      const response = await api.get(`denuncias/usuario/apoiadas/${user?.id}`);
      
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

      <div className="max-w-7xl pt-8 mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
              <Link href="/gerencia" className="p-2 rounded-full hover:bg-gray-200 transition">
                  <ArrowLeftIcon className="w-6 h-6 text-azul-dark" />
              </Link>
          </div>
      </div>

      <main>
            {isLoading ? (
              <div className="py-12 text-center">
                <p className="text-gray-500 text-lg">Carregando todas as denúncias...</p>
              </div>
            ) : (
              <>
                <section>
                  <div className="container mx-auto max-w-7xl p-4 md:p-8">

                    {/* Renderização dos Cards */}
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                      {dadosVisiveis.length > 0 ? (
                        dadosVisiveis.map(denuncia => (
                              <CardDenuncia
                                key={denuncia.id}
                                idDenuncia={denuncia.id}
                                usuarioId={user?.id}
                                nomeUsuario={denuncia.nomeUsuario}
                                fotoUsuario={denuncia.fotoUsuario}
                                descricao={denuncia.descricao}
                                anonimato={denuncia.anonimato}
                                categoria={denuncia.categoria}
                                data={denuncia.data}
                                atualizar={buscarTudo}
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
    </div>
  );
}