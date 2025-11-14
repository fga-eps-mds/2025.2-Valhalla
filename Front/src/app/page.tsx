'use client';

import Image from "next/image";

// Imports ESTRUTURAIS do React e Next
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  return (
    <main>

      {/*Header Inicio*/}

      <header className="bg-texto-corpo h-17 shadow-md flex items-center justify-between pl-5 pr-15">

        {/*Conteúdo do header*/} {/*Esquerda: Logo e Título */}
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

      {/*Header Fim*/}

      <div className="flex justify-center">
        <div className="w-full scroll-m-0 max-w-[1440px] bg-gray-100  rounded-md px-12 py-14">
          {/* Conteúdo: texto à esquerda, imagem à direita */}
          <div className="flex items-start my-12 gap-24">
            {/* Coluna de texto */}
            <div className="flex-1 max-w-xl">
              <h1 className="text-h1">Guardiões da Universidade</h1>

              <p className="text-medium text-justify">
                O projeto Guardiões da Universidade foi desenvolvido para ser um canal de denúncia para a comunidade da Universidade de Brasília (UnB), sendo um meio para os discentes e os servidores exporem suas denúncias, conhecerem os procedimentos oficiais de denúncia e visualizarem as demandas da universidade.
              
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400">
                  Sobre Nós
                </button>
                <button className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400">
                  Denuncie
                </button>
              </div>
            </div>
            {/* Imagem */}
            <div className=" shrink-0">
              <Image
                src="/FCTE.jpg"
                alt="FCTE - Campus UnB Gama"
                width={633}
                height={473}
                className="object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

    </main>
  )
}