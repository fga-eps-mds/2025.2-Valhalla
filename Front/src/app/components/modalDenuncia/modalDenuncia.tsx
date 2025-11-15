"use client";

import { CameraIcon } from '@heroicons/react/24/outline';
import {
  ChevronUpDownIcon,
  PlusIcon
} from '@heroicons/react/24/solid';

interface DenunciaModalProps {
  isOpen: boolean;
  // onClose: () => void;
}

export default function ModalDenuncia ({isOpen}:DenunciaModalProps) {
    if (!isOpen) return null;
        return (
          <>
            <div className='fixed inset-0 z-[999999] bg-black/40 pointer-events-none flex items-center justify-center'>
                  <div className='pointer-events-auto flex flex-col items-center w-[720px] max-w-[100%] max-h-[100vh] overflow-y-auto rounded-[1rem] bg-white shadow-[0_0.25rem_0.25rem_0_rgba(0,0,0,0.25)] border p-6'>
                    <h1 className='text-h1 mb-[48px]'>Qual sua Denúncia?</h1>
                    <div className='flex items-center gap-[10px] mb-[26px]'>
                      <button type='button' className='w-[135px] h-[45px] border rounded-[46px] text-body'>ANÔNIMA</button>
                      <button type='button' className='w-[135px] h-[45px] border rounded-[46px] text-body'>PÚBLICA</button>
                    </div>
                    
                    <div className='w-[366px] h-[52px] border border-[var(--color-bordas)] rounded-[10px] flex items-center p-[16px]'>
                    <ChevronUpDownIcon className='size-[24px]'/>
                    <select className='flex items-center mx-[5px] text-small'>
                              <option value="" disabled selected>Selecione a Categoria</option>
                              <option value="">Servidor</option>
                              <option value="">Aluno</option>
                          </select>
                    </div>
                    
                    <div className='w-[256px] h-[159px] flex items-center justify-center border border-[3px] border-dashed border-[var(--color-azul-principal)] rounded-[20px] relative'>
                      <CameraIcon className='size-[74px] text-[var(--color-azul-principal)]'/>
                      <div
                        className='size-[39px] text-[var(--color-branco)] absolute bottom-[30.84px] right-[70px] bg-[var(--color-azul-principal)] rounded-full flex items-center justify-center'>
                        {/*Ícone "+"*/}
                        <PlusIcon className='size-[23px] text-[var(--color-branco)]' />
                      </div>
                    </div>
                     
                    <div>
                      <label htmlFor="descricao">Descrição</label>
                      <textarea id="descricao" />
                    </div>
                    
                    <button
                      type="submit"
                      className="flex items-center justify-center border border-[#1A2A4A] rounded-md py-[11px] my-[38px] gap-[5px] bg-[var(--color-azul-principal)] w-[240px] h-[45px] text-white rounded hover:bg-[#67A8FF] transition">
                      PUBLICAR
                    </button>
                </div>
            </div>
          </>
        )
}
