'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from "../../../../components/secao/navbar"; 
import ModalNoticia from "../../../../components/modais/modalAdicionarNoticia";
import { listarNoticias } from "@/utils/api"; 
import api from '@/utils/api'; // Importei o api geral para o futuro fetch das top 3
import { useAuth } from "@/contexts/AuthContext";
import { PlusIcon, FireIcon } from "@heroicons/react/24/solid"; // Icone de fogo para "Em alta"
import { toast } from "sonner";
import { TipoNoticia } from '@/types';
import CardNoticia from '@/components/ui/cardNoticia';
import CardDenuncia from '@/components/ui/cardDenuncia'; // <--- Importando o Card

// Interface para as Denúncias (Compatível com o CardDenuncia)
type DenunciaTop = {
  id: number;
  nomeUsuario: string;
  fotoUsuario?: string | null;
  descricao: string;
  anonimato: boolean;
  categoria: string;
  data: string;
};

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
  
  // Estados Notícias
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [listaNoticias, setListaNoticias] = useState<NoticiaFormatada[]>([]);
  
  // Estados Denúncias (Top 3)
  const [topDenuncias, setTopDenuncias] = useState<DenunciaTop[]>([]);
  const [loadingTop, setLoadingTop] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const LIMIT = 10;

  // --- BUSCA NOTÍCIAS ---
  const carregarNoticias = useCallback(async () => {
    try {
      setIsLoading(true);
      const dados = await listarNoticias(page, LIMIT);
      
      const formatadas: NoticiaFormatada[] = dados.noticias.map((n: any) => ({
        id: n.id,
        nomeUsuario: n.usuario?.nome || "Usuário Desconhecido", 
        fotoUsuario: n.usuario?.mediaSrc,
        descricao: n.descricao,
        tipo: n.tipo,
        data: new Date(n.dataCriacao).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
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
  }, [page]);

  // --- BUSCA TOP 3 DENÚNCIAS (Placeholder) ---
// --- BUSCA TOP 3 DENÚNCIAS (Agora conectada ao Back) ---
  const carregarTopDenuncias = useCallback(async () => {
    try {
      setLoadingTop(true);
      
      // Notei na sua URL do Postman que a rota ficou duplicada "/denuncias/denuncias/..."
      // Se no Postman funcionou assim, mantenha assim por enquanto:
      const response = await api.get('/denuncias/denuncias/top-denuncias'); 
      
      // 👇 A CORREÇÃO ESTÁ AQUI:
      // Verificamos se veio dentro de "denuncias" ou se veio direto (fallback)
      const listaBruta = response.data.denuncias || response.data; 

      // Verificação de segurança: se não for array, transforma em array vazio para não quebrar o .map
      const arraySeguro = Array.isArray(listaBruta) ? listaBruta : [];

      const formatadas: DenunciaTop[] = arraySeguro.map((d: any) => ({
        id: d.id,
        nomeUsuario: d.usuario?.nome || "Anônimo",
        fotoUsuario: d.usuario?.mediaSrc,
        descricao: d.descricao,
        anonimato: d.anonimato,
        categoria: d.categoria?.nome || "Geral", 
        data: new Date(d.dataCriacao).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }),
      }));

      setTopDenuncias(formatadas);

    } catch (error) {
      console.error("Erro ao carregar top denúncias", error);
      toast.error("Erro ao carregar destaques");
    } finally {
      setLoadingTop(false);
    }
  }, []);

  // Inicialização
  useEffect(() => {
    carregarNoticias();
    carregarTopDenuncias();
  }, [carregarNoticias, carregarTopDenuncias]);

  const handleOpenCreateModal = () => setIsModalOpen(true);
  
  const handleModalSuccess = () => {
    setIsModalOpen(false); 
    carregarNoticias(); 
  };

  const isAdmin = user?.tipo === 'ADMIN' || user?.tipo === 'ADMINMASTER';

  return (
    <main className="min-h-screen bg-branco pb-20">
      
      <div className="pt-24 px-4 sm:px-8 flex justify-center">
        {/* Aumentei o max-width para caber o layout de duas colunas confortavelmente */}
        <div className="w-full max-w-[1200px]">
          
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-h2 text-left text-texto-primario">
              Mural de Notícias
            </h1>
          </div>

          {/* --- GRID LAYOUT (Principal mudança) --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUNA ESQUERDA (2/3): Lista de Notícias */}
            <div className="lg:col-span-2 space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-azul-principal"></div>
                </div>
              ) : listaNoticias.length > 0 ? (
                <>
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

                  {/* Paginação das Notícias */}
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
                </>
              ) : (
                <div className="text-center py-20 text-gray-500 text-body font-secondary">
                  Nenhuma notícia encontrada.
                </div>
              )}
            </div>

            {/* COLUNA DIREITA (1/3): Top 3 Denúncias */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24"> {/* Sticky faz ela fixar ao rolar */}
                <div className="bg-white rounded-2xl p-6 border border-azul-principal shadow-sm mb-4">
                  <div className="flex items-center gap-2 mb-4 border-b pb-2 border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">Denuncias mais Apoiadas</h3>
                  </div>

                  <div className="space-y-4">
                    {loadingTop ? (
                       <p className="text-gray-500 text-sm">Carregando...</p>
                    ) : topDenuncias.length > 0 ? (
                      topDenuncias.map((denuncia) => (
                        <div key={denuncia.id} className="scale-95 origin-top-left w-full"> 
                           {/* Renderizamos o Card, talvez você queira um Card 'mini', 
                               mas o CardNormal funciona com scale ou css ajustado */}
                           <CardDenuncia
                              idDenuncia={denuncia.id}
                              usuarioId={user?.id || 0} // User do Auth
                              nomeUsuario={denuncia.nomeUsuario}
                              fotoUsuario={denuncia.fotoUsuario}
                              descricao={denuncia.descricao}
                              anonimato={denuncia.anonimato}
                              categoria={denuncia.categoria}
                              data={denuncia.data}

                            />
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        Nenhuma denúncia em destaque no momento.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </aside>
            
            {/* VERSÃO MOBILE DO TOP 3 (Aparece embaixo das notícias em telas pequenas) */}
            <div className="block lg:hidden mt-8">
               <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <FireIcon className="w-6 h-6 text-orange-500" />
                    <h3 className="text-xl font-bold text-gray-800">Mais Apoiadas</h3>
                  </div>
                  <div className="flex flex-col gap-4">
                     {/* Mesma lógica de renderização do Desktop */}
                     {topDenuncias.map((d) => (
                        <CardDenuncia 
                          key={d.id}
                          idDenuncia={d.id}
                          usuarioId={user?.id || 0}
                          nomeUsuario={d.nomeUsuario}
                          fotoUsuario={d.fotoUsuario}
                          descricao={d.descricao}
                          anonimato={d.anonimato}
                          categoria={d.categoria}
                          data={d.data}
                        />
                     ))}
                  </div>
               </div>
            </div>

          </div> {/* Fim do Grid */}

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