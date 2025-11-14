'use client';

// Imports ESTRUTURAIS do React e Next
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import modalDenuncia from '@/app/components/modalDenuncia/modalDenuncia';

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

  return (
    // Container principal da página
    <div className="bg-white min-h-screen relative">

        {/*Cabeçalho*/}
      <div className="bg-[#1A293F] h-21 shadow-md flex items-center justify-between pl-5 pr-15">
        
        {/*Conteúdo do header*/}
        {/*Esquerda: Logo e Título */}
        <div className="flex items-center space-x-4">
          <Image
            src="/Corujuda - Contorno.svg"
            alt="Logo Guardiões da Universidade"
            width={84}
            height={84}
          />
          <h1 className="text-white text-3xl font-bold">
            Guardiões da Universidade</h1>
        </div>

        {/*Direita: Ícones de Navegação */}
        <div className="flex items-center space-x-6">
          <button aria-label="Orientação">
            <BookOpenIcon className="h-10 w-10 text-white hover:opacity-80 transition-opacity"/>
          </button>
          <button aria-label="Notícias">
            <NewspaperIcon className="h-10 w-10 text-white hover:opacity-80 transition-opacity"/>
          </button>
          <button aria-label="Denúncia">
            <HomeIcon className="h-10 w-10 text-[#67A8FF]"/>
          </button>
          <button aria-label="Histórico">
            <ArchiveBoxIcon className="h-10 w-10 text-white hover:opacity-80 transition-opacity"/>
          </button>
          <button aria-label="Meu Perfil">
            <UserCircleIcon className="h-10 w-10 text-white hover:opacity-80 transition-opacity"/>
          </button>
        </div>

      </div>
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
          bg-[#1A2A4A]          /* Cor de fundo */
          hover:bg-[#67A8FF]    /* Cor ao passar o mouse */
          flex                    /* Para centralizar o ícone */
          items-center            /* ...verticalmente */
          justify-center          /* ...horizontalmente */
          shadow-lg               /* Sombra */
          transition-colors       /* Efeito de transição */
          duration-300
        "
      >
        <PlusIcon className="h-12 w-12 text-white"/>
      </button>
    </div>
  );
}