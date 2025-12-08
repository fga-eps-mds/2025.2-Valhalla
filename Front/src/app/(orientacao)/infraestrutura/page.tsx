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

export default function InfraestruturaPage() {
  const pageData = {
    mainTitle: "Infraestrutura, Equipamentos e Serviços",
    illustration: "/imagens_orientacao/infraestrutura.svg",
    subTopics: [
      { title: "Problemas em Prédios" },
      { title: "Falha de Equipamentos" },
      { title: "Carência de Serviços" },
    ],
    infoBox: {
      title: "O que denunciar?",
      text: "Problemas em salas de aula (falta de luz, cadeiras quebradas), banheiros interditados, falta de acessibilidade, falhas na rede Wi-Fi, falta de materiais em laboratórios ou problemas estruturais que coloquem a segurança em risco.",
    },
    links: [
      {
        href: "https://www.unb.br/",
        title: "Setor Responsável (PRC, CPD/CET)",
        text: "Tente contato direto com a administração do seu instituto, a Prefeitura do Campus (PRC) ou o Centro de Informática (CPD/CET) para soluções rápidas."
      },
      {
        href: "https://falabr.cgu.gov.br/",
        title: "Ouvidoria da UnB (Via Fala.BR)",
        text: "Se o problema não for resolvido, registre uma 'Reclamação' para formalizar a demanda."
      },
      {
        href: "https://www.mpf.mp.br/mpfservicos/denuncia",
        title: "Ministério Público (MPF / MPDFT)",
        text: "Se a falta de infraestrutura afetar o direito coletivo ao ensino ou colocar a segurança de todos em risco (ex: risco de desabamento)."
      },
      {
        href: "https://www.gov.br/mdh/pt-br/canais_atendimento/disque-100",
        title: "Disque Direitos Humanos (Disque 100)",
        text: "Se a falha for de acessibilidade, pode ser enquadrada como violação de direitos humanos."
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
              alt="Ilustração sobre Infraestrutura" 
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