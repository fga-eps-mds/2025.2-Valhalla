"use client";

import { useState, useEffect } from 'react';
import { CameraIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import api from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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

interface EditarDenunciaDados {
  descricao: string;
  idCategoria: number;
  anonimato?: boolean;
  mediaSrc?: string;
}

const editarDenuncia = async (id: number, dados: EditarDenunciaDados) => {
  try {
    const response = await api.patch(`/denuncias/${id}`, dados);
    return response.data;
  } catch (error) {
    toast.error("Erro ao editar denúncia.");
    console.error("Erro ao editar denúncia:", error);
    throw error;
  }
};

export default function ModalEditarDenuncia ({
  isOpen,
  onClose,
  denuncia,
  onSaved,
}: {
  isOpen: boolean;
  onClose: () => void;
  denuncia?: {
    id: number;
    descricao: string;
    categoria: string;
    idCategoria: number;
    anonimato: boolean;
    mediaSrc?: string | null;
  } | null;
  onSaved?: (updatedDenuncia: any) => void;
}) {

  const [descricao, setDescricao] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [anonimato, setAnonimato] = useState<boolean | null>(null);
  const [categoria, setCategoria] = useState('');
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

    // quando uma denúncia é passada, preencher campos do formulário
    useEffect(() => {
      if (denuncia) {
        setDescricao(denuncia.descricao ?? '');
        setIdCategoria(denuncia.idCategoria?.toString() ?? '');
        setCategoria(denuncia.categoria ?? '');
        setAnonimato(denuncia.anonimato ?? null);
        setMediaSrc(denuncia.mediaSrc ?? '');
      }
    }, [denuncia]);

    // Função que é chamada ao clicar em Editar
    const publicarEdicaoDenuncia = async () => {
      
      if (!descricao || !idCategoria) {
        toast.error("Por favor, preencha a descrição e selecione uma categoria.");
        return;}

      try {

        if (!idUsuario) {
          toast.error("Usuário não autenticado.");
          return;
        }

        if (anonimato === null) {
          toast.error("Por favor, selecione o tipo de denúncia (Anônima ou Pública).");
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

        if (!denuncia?.id) {
          toast.error('Denúncia inválida.');
          return;
        }

        const categoriaSelecionadaObj = listaCategorias.find(c => c.id === Number(idCategoria));
        const nomeCategoriaNova = categoriaSelecionadaObj?.nome;

        const updated = await editarDenuncia(denuncia.id, {
          descricao: descricao,
          idCategoria: Number(idCategoria),
          anonimato: anonimato as boolean,
          mediaSrc: mediaSrc,
        });

        toast.success("Denúncia editada com sucesso!");
        onClose();
        if (onSaved) onSaved({...updated, nomeCategoriaFront: nomeCategoriaNova});

      } catch (error) {
        toast.error("Erro ao editar denúncia. Verifique o console.");
        console.error(error);
      }
    };


    if (!isOpen) return null;
        return (
          <>
            <div 

              onClick={onClose}
              className='fixed inset-0 z-999999 bg-black/40 flex items-center justify-center'>
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className='pointer-events-auto relative flex flex-col items-center w-[720px] max-w-full max-h-screen overflow-y-auto rounded-2xl bg-white shadow-[0_0.25rem_0.25rem_0_rgba(0,0,0,0.25)] border p-6 [&::-webkit-scrollbar]:hidden'
                    >
                    
                    {/*Botão de "voltar"*/}
                    <button
                      type="button"
                      onClick={onClose}
                      className="absolute top-6 left-6 text-black hover:text-gray-600 transition-colors">
                      <ArrowLeftIcon className="size-12" />
                    </button>

                    <h1 className='text-h1 mb-[35px]'>Edite sua Denúncia</h1>
                    
                    {/*Botões de TIPO DE DENUNCIA*/}
                    <div className='flex items-center gap-2.5 mb-[26px]'>

                    {/* Botão ANÔNIMA (Ativo se anonimato === true) */}
                      <button 
                        type='button' 
                        onClick={() => setAnonimato(true)} 
                        className={`
                          w-[135px] h-[45px] border rounded-[46px] text-small cursor-pointer transition-colors font-bold
                          ${anonimato === true 
                            ? 'bg-azul-dark text-branco border-azul-dark'
                            : 'bg-branco text-azul-dark border-azul-dark hover:bg-off-white'}
                        `}
                      > ANÔNIMA
                      </button>
                      
                      {/* Botão PÚBLICA (Ativo se anonimato === false) */}
                      <button 
                        type='button' 
                        onClick={() => setAnonimato(false)} 
                        className={`
                          w-[135px] h-[45px] border rounded-[46px] text-small cursor-pointer transition-colors font-bold
                          ${anonimato === false
                            ? 'bg-azul-dark text-branco border-azul-dark'
                            : 'bg-branco text-azul-dark border-azul-dark hover:bg-off-white'}
                        `}
                      > PÚBLICA
                      </button>
                    </div>
                    
                    {/*Campo de CATEGORIA*/}
                    <div className='w-[366px] h-[52px] border border-azul-dark rounded-[10px] flex items-center p-4 mb-[30px]'>
                    <ChevronUpDownIcon className='size-6'/>
                    <select 
                      className='w-full h-full 
                        px-4 text-small cursor-pointer bg-white
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
                    
                    {/*Campo de INSERÇÃO DE IMAGEM
                    <div 
                      className='
                        w-[256px] h-[159px] shrink-0 
                        flex items-center justify-center 
                        border border-[3px] border-dashed border-[var(--color-azul-principal)] 
                        rounded-[20px] relative mb-[15px]                        
                    
                        group
                        cursor-pointer
                        hover:border-[var(--color-azul-light)]
                        transition-colors duration-300'
                      >
                      <CameraIcon className='size-[74px] text-[var(--color-azul-principal)] group-hover:text-[var(--color-azul-light)] transition-colors duration-300'/>
                      <div
                        className='size-[39px] text-[var(--color-branco)] absolute bottom-[30.84px] right-[70px] bg-[var(--color-azul-principal)] rounded-full flex items-center justify-center group-hover:bg-[var(--color-azul-light)] transition-colors duration-300'>
                        {/*Ícone "+"
                        <PlusIcon className='size-[23px] text-[var(--color-branco)] ' />
                      </div>
                    </div>
                    */}

                    {/*Campo DESCRIÇÃO*/} 
                    <div>
                      <label htmlFor="descricao" className="text-body mb-1">Descrição</label>
                      <div>
                        <textarea id="descricao"
                          className="w-[500px] h-[273px] rounded-[15px] border border-bordas p-2 resize-none "
                          placeholder="Escreva a sua denúncia..."
                          value={descricao} /*Valor é o que está guardado na memória "descricao"*/
                          onChange={(e) => setDescricao(e.target.value)} /*Quando usuário digita é guardado na memómria*/
                         />
                      </div>
                    </div>
                    
                    {/*Botão Editar*/}
                    <button
                      type="submit"
                      onClick={publicarEdicaoDenuncia}
                      className="flex items-center justify-center border border-azul-dark rounded-md py-[11px] my-[38px] gap-[5px] bg-azul-principal w-60 h-[45px] text-white cursor-pointer hover:bg-azul-light transition font-bold">
                      Editar
                    </button>

                </div>
            </div>
          </>
        )
}