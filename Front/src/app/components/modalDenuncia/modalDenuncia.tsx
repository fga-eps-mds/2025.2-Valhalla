"use client";

import {
  ChevronUpDownIcon,
  PlusIcon,
  CameraIcon
} from '@heroicons/react/24/solid';

interface DenunciaModalProps {
  isOpen: boolean;
  // onClose: () => void;
}

export default function ModalDenuncia ({isOpen}:DenunciaModalProps) {
    if (!isOpen) return null;
        return (
            <>
            <div className='flex flex-col items-center justify-center border w-[720px] h-[993px] rounded-[1rem] opacity-80 shadow-[0_0.25rem_0.25rem_0_rgba(0,0,0,0.25)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
              <h1 className='text-black'>Qual sua Denúncia?</h1>
              <div className='border'>
                <button>ANÔNIMA</button>
                <button>PÚBLICA</button>
              <select className='w-full outline-none px-[9px] '>
                        <option value="" disabled selected>Selecione a Categoria</option>
                        <option value="">Servidor</option>
                        <option value="">Aluno</option>
                    </select>
              </div>
              <div className='border'>
                <CameraIcon className='size-[74px]'/>
                <PlusIcon className='size-[41px]'/>
              </div>
              <button
                type="submit"
                className="flex items-center justify-center border border-[#1A2A4A] rounded-md py-[11px] my-[38px] gap-[5px] bg-[#3060BF] w-[240px] h-[45px] text-white rounded hover:bg-[#67A8FF] transition">
                PUBLICAR
            </button>
            </div>
            </>
        )
    
}
