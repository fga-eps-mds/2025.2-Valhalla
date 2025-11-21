"use client";

import React, { useState, useEffect } from 'react';
import { getCategorias, Categoria } from '@/app/services/categoriaService';
import { criarDenuncia } from '../../services/denunciaService'; 
import { 
  CameraIcon, 
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import {
  ChevronUpDownIcon,
  PlusIcon
} from '@heroicons/react/24/solid';

interface DenunciaModalProps {
  isOpen: boolean;
  onClose: () => void;

  descricao: string;
  setDescricao: (text: string) => void;

  categoria: string;
  setCategoria: (text: string) => void;

  anonimato: boolean | null;
  setAnonimato: (valor: boolean) => void;

}

export default function ModalDenuncia ({isOpen, onClose, descricao, setDescricao, categoria, setCategoria, anonimato, setAnonimato}:DenunciaModalProps) {
  
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
    const publicarDenuncia = async () => {
      
      if (!descricao || !categoria) {
        alert("Por favor, preencha a descrição e selecione uma categoria.");
        return;}

      try {
        await criarDenuncia({
          descricao: descricao,
          idCategoria: Number(categoria), 
          anonimato: anonimato ?? false, 
          // idUsuario: 1 ID FIXO PARA TESTE (ALTERAR)
          idUsuario: 1 
        });

        alert("Denúncia realizada com sucesso!");
        onClose();

      } catch (error) {
        alert("Erro ao publicar denúncia. Verifique o console.");
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

                    <h1 className='text-h1 mb-[35px]'>Qual sua Denúncia?</h1>
                    
                    {/*Botões de TIPO DE DENUNCIA*/}
                    <div className='flex items-center gap-[10px] mb-[26px]'>

                    {/* Botão ANÔNIMA (Ativo se anonimato === true) */}
                      <button 
                        type='button' 
                        onClick={() => setAnonimato(true)} 
                        className={`
                          w-[135px] h-[45px] border rounded-[46px] text-small cursor-pointer transition-colors font-bold
                          ${anonimato === true 
                            ? 'bg-[var(--color-azul-dark)] text-[var(--color-branco)] border-[var(--color-azul-dark)]'
                            : 'bg-[var(--color-branco)] text-[var(--color-azul-dark)] border-[var(--color-azul-dark)] hover:bg-[var(--color-off-white)]'}
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
                            ? 'bg-[var(--color-azul-dark)] text-[var(--color-branco)] border-[var(--color-azul-dark)]' 
                            : 'bg-[var(--color-branco)] text-[var(--color-azul-dark)]  border-[var(--color-azul-dark)] hover:bg-[var(--color-off-white)]'}
                        `}
                      > PÚBLICA
                      </button>
                    </div>
                    
                    {/*Campo de CATEGORIA*/}
                    <div className='w-[366px] h-[52px] border border-[var(--color-bordas)] rounded-[10px] flex items-center p-[16px] mb-[30px]'>
                    <ChevronUpDownIcon className='size-[24px]'/>
                    <select 
                      className='flex items-center mx-[5px] text-small cursor-pointer'
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                    >
                              <option value="" disabled>Selecione a Categoria</option>
                              
                              {listaCategorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.nome}
                              </option>
                            ))}

                          </select>
                    </div>
                    
                    {/*Campo de INSERÇÃO DE IMAGEM*/}
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
                        {/*Ícone "+"*/}
                        <PlusIcon className='size-[23px] text-[var(--color-branco)] ' />
                      </div>
                    </div>

                    {/*Campo DESCRIÇÃO*/} 
                    <div>
                      <label htmlFor="descricao" className="text-body mb-1">Descrição</label>
                      <div>
                        <textarea id="descricao"
                          className="w-[500px] h-[273px] rounded-[15px] border border-[var(--color-bordas)] p-2 resize-none "
                          placeholder="Escreva a sua denúncia..."
                          value={descricao} /*Valor é o que está guardado na memória "descricao"*/
                          onChange={(e) => setDescricao(e.target.value)} /*Quando usuário digita é guardado na memómria*/
                         />
                      </div>
                    </div>
                    
                    {/*Botão PUBLICAR*/}
                    <button
                      type="submit"
                      onClick={publicarDenuncia}
                      className="flex items-center justify-center border border-[#1A2A4A] rounded-md py-[11px] my-[38px] gap-[5px] bg-[var(--color-azul-principal)] w-[240px] h-[45px] text-white rounded cursor-pointer hover:bg-[var(--color-azul-light)] transition font-bold">
                      PUBLICAR
                    </button>

                </div>
            </div>
          </>
        )
}
