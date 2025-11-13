'use client';

import Image from "next/image";

// Imports ESTRUTURAIS do React e Next
import React, { useState, useEffect } from 'react';
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

export default function Home() {
  return (
    <div>
      <header className="bg-[#1A293F] h-17 shadow-md flex items-center justify-between pl-5 pr-15">

        {/*Conteúdo do header*/}
        {/*Esquerda: Logo e Título */}
        <div className="flex items-center space-x-3">
          <Image
            src="/Corujuda-Contorno.svg"
            alt="Logo Guardiões da Universidade"
            width={84}
            height={84}
          />
          <h1 className="text-white text-3xl font-bold">
            Guardiões da Universidade</h1>
        </div>
      </header>
      <div> porra
      </div>
    </div>
  );
}