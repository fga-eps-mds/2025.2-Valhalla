'use client';

// Imports ESTRUTURAIS do React e Next
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

  return (
    <div className="bg-white min-h-screen relative">
        {/*Cabeçalho*/}
      <div className="bg-[#1A293F] h-21 shadow-md flex items-center justify-between pl-5 pr-15">
        {/*Conteúdo do header*/}

        {/*Esquerda: Logo e Título */}
        <div>
          <Image
            src="/Corujuda - Contorno.svg"
            alt="Logo Guardiões da Universidade"
            width={84}
            height={84}
          />
          <h1>Guardiões da Universidade</h1>
        </div>

        {/*Direita: Ícones de Navegação */}
        <div>
          <button aria-label="Orientação">
            <BookOpenIcon />
          </button>
          <button aria-label="Notícias">
            <NewspaperIcon />
          </button>
          <button aria-label="Denúncia">
            <HomeIcon />
          </button>
          <button aria-label="Histórico">
            <ArchiveBoxIcon />
          </button>
          <button aria-label="Meu Perfil">
            <UserCircleIcon />
          </button>
        </div>

      </div>
      <main>
        {/*Conteúdo da lista de denúncias*/}
      </main>

      {/* Botão flutuante */}
      <button aria-label="Nova Denúncia">
        <PlusIcon />
      </button>

    </div>
  );
}