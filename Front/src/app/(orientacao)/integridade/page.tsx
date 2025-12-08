'use client';

import React from 'react';
import Image from "next/image";

interface LinkCardProps {
  href: string;
  title: string;
  text: string;
}

const LinkCard = ({ href, title, text }: LinkCardProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 h-full"
    >
      <h3 className="font-bold text-lg text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{text}</p>
    </a>
  );
};

export default function IntegridadePage() {
  const pageData = {
    mainTitle: "Integridade, Transparência e Corrupção",
    illustration: "/imagens_orientacao/integridade.svg",
    subTopics: [
      { title: "Falta de Transparência" },
      { title: "Desinformação" },
      { title: "Corrupção" },
    ],
    infoBox: {
      title: "O que denunciar?",
      text: "Atos de má gestão, desvio de conduta de servidor, uso indevido de recursos.",
    },
    links: [
      {
        href: "https://falabr.cgu.gov.br/",
        title: "Ouvidoria da UnB (Via Fala.BR)",
        text: "Canal primário. Registre como 'Denúncia' para atos de má gestão ou desvio de conduta."
      },
      {
        href: "https://falabr.cgu.gov.br/",
        title: "Controladoria-Geral da União (CGU)",
        text: "Escale para a CGU se a resposta da UnB for insatisfatória ou não houver resposta."
      },
      {
        href: "https://www.mpf.mp.br/mpfservicos/denuncia",
        title: "Ministério Público Federal (MPF)",
        text: "Para casos graves de corrupção ou lesão ao patrimônio público."
      },
      {
        href: "https://representacaov2.apps.tcu.gov.br/denuncie",
        title: "Tribunal de Contas da União (TCU)",
        text: "Para irregularidades em licitações, contratos e uso de verba pública."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <main className="max-w-6xl mx-auto">
        
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl font-bold text-gray-800 leading-tight">
              {pageData.mainTitle}
            </h1>
          </div>

          <div className="w-full md:w-1/2 flex justify-center items-center">
            <Image 
              src={pageData.illustration} 
              alt="Ilustração sobre Integridade" 
              width={320} 
              height={140}
              
              className="rounded-lg h-auto w-auto max-w-full"
              priority
            />
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {pageData.subTopics.map((topic, index) => (
            <div 
              key={index} 
              className="p-6 h-24 bg-white rounded-lg shadow-sm flex items-center justify-center"
            >
              <h2 className="text-xl font-semibold text-gray-700 text-center">
                {topic.title}
              </h2>
            </div>
          ))}
        </section>

        <section className="bg-blue-100 p-6 rounded-lg mb-12 shadow-sm">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">
            {pageData.infoBox.title}
          </h2>
          <p className="text-blue-700 text-lg">
            {pageData.infoBox.text}
          </p>
        </section>

        <section>
          <p className="text-center text-gray-500 mb-6">
            Clique nos cards abaixo para ser redirecionado e saber mais.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pageData.links.map((link, index) => (
              <LinkCard 
                key={index}
                href={link.href}
                title={link.title}
                text={link.text}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}