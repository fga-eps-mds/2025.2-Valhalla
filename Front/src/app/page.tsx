'use client';

import SecaoDesenvolvedores from "@/components/secaoDevs";
import Header from "@/components/navbar"
import Image from "next/image";
import Link from "next/link";

import InfoCards from "@/components/secaoInfo";

export default function Home() {
  return (
    <main>

      <header> <Header/> </header>

      <div className="flex justify-center">
        <div className="w-full scroll-m-0 max-w-[1440px] bg-gray-50  rounded-md px-12 py-14 ">
          <article className="grid grid-cols-1 md:grid-cols-2 items-center">

            <div className="order-2 md:order-1 max-w-xl my-10 gap-24 ml-10 mr-10">
              <div>
                <h1 className="text-h1 sm:text-h3">Guardiões da Universidade</h1>

                <p className="text-medium text-justify mb-8"> 
                  O projeto <em>Guardiões da Universidade</em> é uma plataforma criada para dar voz à comunidade da <strong>Universidade de Brasília UnB</strong>, permitindo que discentes e servidores conheçam os procedimentos oficiais de denúncia e visualizem as principais demandas da universidade.
                  <br/>
                  Aqui, você encontra orientações claras, links e o passo a passo para registrar denúncias nos canais oficiais competentes. <em>Mesmo não sendo um meio oficial da UnB</em>, o projeto existe para <strong>desburocratizar, informar e fortalecer o senso de comunidade</strong> e segurança, destacando os problemas que impactam o dia a dia da universidade.
                </p>

                <div className="flex gap-8 justify-center">
                  <a href="#devs">
                    <button className="text-sm w-36 h-12 bg-white hover:bg-gray-200 text-texto-corpo rounded-xl cursor-pointer shadow-sm hover:shadow-md transition">
                      Nosso Time
                    </button>
                  </a>
                  <Link href="/cadastro">
                    <button className="text-sm w-36 h-12 bg-azul-principal hover:bg-azul-hover text-off-white rounded-xl cursor-pointer shadow-sm hover:shadow-md transition">
                      Denuncie
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 flex justify-center mt-2 gap-24 ml-2 mr-2">
              <Image
                src="/FCTE.jpg"
                alt="FCTE - Campus UnB Gama"
                width={633}
                height={473}
                className="object-cover rounded-xl"
              />
            </div>
          </article>

          {/* Seção Informações*/}
          {/*<div> <InfoCards/> </div>*/}
          
          {/* Seção dos Desenvolvdores*/}
          <div id="devs"> <SecaoDesenvolvedores/> </div>

        </div>
      </div>

    </main>
  )
}