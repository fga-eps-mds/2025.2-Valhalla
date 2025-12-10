"use client";

import {useState, useEffect} from "react";
import{
    CameraIcon,
    ArrowLeftIcon,

} from "@heroicons/react/24/outline";
import{
    ChevronUpDownIcon,
    PlusIcon
} from "@heroicons/react/20/solid";
import api from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import {toast} from 'sonner';

interface Categoria {
  id: number;
  nome: string;
}

const getCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await api.get('/categorias');
    return response.data;
  } catch (error) {
    toast.error("Erro ao buscar categorias.");
    console.error("Erro ao buscar categorias:", error);
    return [];
  }
};

interface CriarNoticiaDados {
  descricao: string;
  idCategoria: number;
  anonimato?: boolean;
  mediaSrc?: string;
}

const adicionarNoticia = async (dados: CriarNoticiaDados) => {
  try {
    const response = await api.post('/noticias', dados);
    return response.data;
  } catch (error) {
    toast.error("Erro ao adicionar notícia.");
    console.error("Erro ao adicionar notícia:", error);
    throw error; 
  }
};

export default function ModalAdicionarNoticia ({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
  

  const [descricao, setDescricao] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [anonimato, setAnonimato] = useState<boolean | null>(null);
  const [mediaSrc, setMediaSrc] = useState<string>('');
  const {user} = useAuth();

  const idUsuario = user?.id;
  // Estado local para guardar a LISTA CATEGORIA
    const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);

    useEffect(() => {
      const carregar = async () => {
        const dados = await getCategorias();
        setListaCategorias(dados);
      };
      carregar();
    }, []); 

    // Função que é chamada ao clicar em PUBLICAR
    const publicarNoticia = async () => {

    if (!descricao || !idCategoria) {
      toast.error("Por favor, preencha a descrição e selecione uma categoria.");
      return;
    }

    try {
      if (!idUsuario) {
        toast.error("Usuário não autenticado.");
        return;
      }

      if (!descricao.trim()) {
        toast.error("A descrição não pode estar vazia.");
        return;
      }

      if (!idCategoria) {
        toast.error("Por favor, selecione uma categoria.");
        return;
      }

      await adicionarNoticia({
        descricao: descricao,
        idCategoria: Number(idCategoria),
        mediaSrc: mediaSrc,
      });

      toast.success("Notícia publicada com sucesso!");
      onClose();

    } catch (error) {
      toast.error("Erro ao publicar notícia. Verifique o console.");
      console.error(error);
    }
  };

  if (!isOpen) return null;
        return (
          <>
            <div 

              onClick={onClose}
              className='fixed inset-0 z-[999999] bg-black/40 flex items-center justify-center'>
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className='pointer-events-auto relative flex flex-col items-center w-[720px] max-w-[100%] max-h-[100vh] overflow-y-auto rounded-[1rem] bg-white shadow-[0_0.25rem_0.25rem_0_rgba(0,0,0,0.25)] border p-6 [&::-webkit-scrollbar]:hidden'
                    >
                    
                    {/*Botão de "voltar"*/}
                    <button
                      type="button"
                      onClick={onClose}
                      className="absolute top-6 left-6 text-black hover:text-gray-600 transition-colors">
                      <ArrowLeftIcon className="size-[48px]" />
                    </button>

                    <h1 className='text-h1 mb-[35px]'>Qual sua Notícia?</h1>

                    {/*Botões de TIPO DE NOTÍCIA*/}
                    <div className='flex items-center gap-[10px] mb-[26px]'></div>

                    {/*Campo de CATEGORIA*/}
                    <div className='w-[366px] h-[52px] border border-[var(--color-azul-dark)] rounded-[10px] flex items-center p-[16px] mb-[30px]'>
                    <ChevronUpDownIcon className='size-[24px]'/>
                    <select 
                      className='w-full h-full 
                        px-[16px] text-small cursor-pointer bg-white
                        appearance-none focus:outline-none focus:border-[var(--color-azul-principal)'
                      value={idCategoria}
                      onChange={(e) => setIdCategoria(e.target.value)}
                    >
                              <option value="" disabled>Selecione a Categoria</option>
                              
                              {listaCategorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.nome}
                              </option>
                            ))}

                          </select>
                    </div>

                     {/*Campo DESCRIÇÃO*/} 
                    <div>
                      <label htmlFor="descricao" className="text-body mb-1">Descrição</label>
                      <div>
                        <textarea id="descricao"
                          className="w-[500px] h-[273px] rounded-[15px] border border-[var(--color-bordas)] p-2 resize-none "
                          placeholder="Escreva a sua notícia..."
                          value={descricao} /*Valor é o que está guardado na memória "descricao"*/
                          onChange={(e) => setDescricao(e.target.value)} /*Quando usuário digita é guardado na memómria*/
                         />
                      </div>
                    </div>

                    {/*Botão PUBLICAR*/}
                    <button
                      type="submit"
                      onClick={publicarNoticia}
                      className="flex items-center justify-center border border-[#1A2A4A] rounded-md py-[11px] my-[38px] gap-[5px] bg-[var(--color-azul-principal)] w-[240px] h-[45px] text-white rounded cursor-pointer hover:bg-[var(--color-azul-light)] transition font-bold">
                      PUBLICAR
                    </button>

                </div>
            </div>
          </>
        )
}