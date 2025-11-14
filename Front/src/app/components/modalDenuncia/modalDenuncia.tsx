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
            <div className='flex flex-col items-center justify-center'>
              <h1 className='text-black'>Qual sua Denúncia?</h1>
              <div>
                <button>ANÔNIMA</button>
                <button>PÚBLICA</button>
              <select className='w-full outline-none px-[9px] '>
                        <option value="" disabled selected>Selecione a Categoria</option>
                        <option value="">Servidor</option>
                        <option value="">Aluno</option>
                    </select>
              </div>
              
              <button>PUBLICAR</button>
            </div>
            </>
        )
    
}
