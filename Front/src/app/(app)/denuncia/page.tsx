'use client';

// Imports ESTRUTURAIS do React e Next
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ModalDenuncia from '@/components/modalDenuncia';
import { useAuth } from '@/contexts/AuthContext';
import { PlusIcon} from '@heroicons/react/24/solid';
import api from '@/utils/api';
import CardDenuncia from '@/components/ui/card-denuncia';
import { toast } from 'sonner';

interface DenunciaBackend {
  id: number;
  descricao: string;
  idCategoria: number;
  mediaSrc: string | null;
  anonimato: boolean;
  dataCriacao: string; // "2025-11-27T..."
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
  const [listagemDenuncias, setListagemDenuncias] = useState<Denuncia[]>([]);
  const [totalDePaginas, setTotalDePaginas] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limite, setLimite] = useState(3);

  const [isLoading, setIsloading] = useState(false);


  useEffect(() => {
    const buscarDenuncias = async () => {
      try {
        setIsloading(true);

        const response = await api.get(`/denuncias?page=${currentPage}&limit=${limite}`);

        const denunciasFormatadas: Denuncia[] = response.data.denuncias.map((denuncia: DenunciaBackend) => ({
          id: denuncia.id,
          nomeUsuario: denuncia.usuario?.nome,
          fotoUsuario: denuncia.usuario?.mediaSrc,
          descricao: denuncia.descricao,
          anonimato: denuncia.anonimato,
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
  }, [currentPage, limite]);

  return (
    // Container principal da página
    <div className="bg-white min-h-screen relative">

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
                                nomeUsuario={denuncia.nomeUsuario}
                                fotoUsuario={denuncia.fotoUsuario}
                                descricao={denuncia.descricao}
                                anonimato={denuncia.anonimato}
                                categoria={denuncia.categoria}
                                data={denuncia.data}
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
              </>
            )}
      </main>

      {/* Botão flutuante */}
      <button 
      onClick={() => setabrirModal(true)}
      aria-label="Nova Denúncia"
      className="
          fixed                   /* Fixo na tela */
          bottom-14               /* Posição: 56px de baixo */
          right-[50px]            /* Posição: 50px da direita */
          h-26                    /* Altura: 104px */
          w-26                    /* Largura: 104px */
          rounded-full            /* Totalmente redondo */
          bg-azul-dark          /* Cor de fundo */
          hover:bg-azul-light   /* Cor ao passar o mouse */
          flex                    /* Para centralizar o ícone */
          items-center            /* ...verticalmente */
          justify-center          /* ...horizontalmente */
          shadow-lg               /* Sombra */
          transition-colors       /* Efeito de transição */
          duration-300
          cursor-pointer
        "
      >
        <PlusIcon className="h-12 w-12 text-white"/>
      </button>

      <ModalDenuncia 
        isOpen={abrirModal}
        onClose={() => setabrirModal(false)}
      />
    </div>
  );
}