'use client';

// Imports ESTRUTURAIS do React e Next
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ModalDenuncia from '@/components/modalDenuncia';
import { useAuth } from '@/contexts/AuthContext';

// Imports VISUAIS
import {
  BookOpenIcon,
  NewspaperIcon,
  HomeIcon,
  ArchiveBoxIcon,
  UserCircleIcon,
  PlusIcon,
} from '@heroicons/react/24/solid';


export default function PaginaDenuncias() {

  const [abrirModal, setabrirModal] = useState(false) 

  //Estados (Descrição, Categoria, Anonimato) da denúncia


  return (
    // Container principal da página
    <div className="bg-white min-h-screen relative">

      <main>
        {/*Conteúdo da lista de denúncias*/}
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