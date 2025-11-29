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

export default function MinhasDenuncias() {
    
  const { user } = useAuth();
  const router = useRouter();
  
  const [listagemDenuncias, setListagemDenuncias] = useState<Denuncia[]>([]);
  const [totalDePaginas, setTotalDePaginas] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limite, setLimite] = useState(20);

  const [isLoading, setIsloading] = useState(false);
  const [isModalExcluirOpen, setIsModalExcluirOpen] = useState(false);
  const [selectedDenunciaId, setSelectedDenunciaId] = useState<number | null>(null);

  useEffect(() => {
    const buscarDenuncias = async () => {
      try {
        setIsloading(true);

        const response = await api.get(`/denuncias/usuario/${user?.id}?page=${currentPage}&limit=${limite}`);

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

    if (user?.id) {
        buscarDenuncias();
    }
  }, [currentPage, limite, user]); 

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
                        {/* Grid de Cards */}
                        <div className="grid grid-cols-1 gap-4 md:gap-6">
                           {/* Lista */}
                        </div>
                      </div>
                    </section>
                    
                    {/* Paginação e Modal */}
                  </>
                )}
        </main>
      );
}