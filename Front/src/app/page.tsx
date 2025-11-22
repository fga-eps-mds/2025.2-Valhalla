'use client';

import Image from "next/image";

import SecaoDesenvolvedores from "@/components/secaoDevs";
import Footer from "@/components/footer";
import Header from "@/components/header"
import FeaturesSection from "@/components/secao";

// Imports ESTRUTURAIS do React e Next
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  return (
    <main>

      <header>
        <Header/>
      </header>

      <div className="flex justify-center">
        <div className="w-full scroll-m-0 max-w-[1440px] bg-gray-50  rounded-md px-12 py-14">
          
          <div className=""> {/* grid grid-cols-2 md:grid-cols-3 Corrigir responsividade */}
            <div className="flex items-start my-12 gap-24 ml-10 mr-10">

              <div className="flex-1 max-w-xl">
                <h1 className="text-h1">Guardiões da Universidade</h1>

                <p className="text-medium text-justify  mb-8"> 
                  O projeto <em>Guardiões da Universidade</em> é uma plataforma criada para dar voz à comunidade da <strong>Universidade de Brasília UnB</strong>, permitindo que discentes e servidores conheçam os procedimentos oficiais de denúncia e visualizem as principais demandas da universidade.
                  <br></br>
                  Aqui, você encontra orientações claras, links e o passo a passo para registrar denúncias nos canais oficiais competentes. <em>Mesmo não sendo um meio oficial da UnB</em>, o projeto existe para <strong>desburocratizar, informar e fortalecer o senso de comunidade</strong> e segurança, destacando os problemas que impactam o dia a dia da universidade.
                </p>

                <div className="flex gap-8 justify-center">
                  <button className="text-sm w-36 h-12  bg-white  hover:bg-gray-200 border border-black text-texto-corpo rounded-md cursor-pointer shadow-sm hover:shadow-md transition">
                    Sobre Nós
                  </button>
                  <button className="text-sm w-36 h-12  bg-azul-principal  hover:bg-azul-hover border border-black text-off-white rounded-md cursor-pointer shadow-sm hover:shadow-md transition">
                    Denuncie
                  </button>
                </div>
              </div>

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
          
          {/* Seção outra*/}
          <div>
            <FeaturesSection/>
          </div>

          
          {/* Seção dos Devs*/}
          <div>
            <SecaoDesenvolvedores/>
          </div>

          
        </div>
      </div>

      {/* Footer */}
      <footer>
        <Footer/>
      </footer>

    </main>
  )
}