'use client';

import React from 'react';

type LinkCardProps = {
  href: string;
  title: string;
  text: string;
};

const LinkCard: React.FC<LinkCardProps> = ({ href, title, text }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
    >
      <h3 className="font-bold text-lg text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{text}</p>
    </a>
  );
};

export default function DireitosHumanosPage() {
  const pageData = {
    mainTitle: "Defesa dos Direitos Humanos",
    illustration: "/images/illust_direitos_humanos.png",
    subTopics: [
      { title: "Discriminação" },
      { title: "Bullying" },
      { title: "Preconceito" },
    ],
    infoBox: {
      title: "O que denunciar?",
      text: "Atos de intolerância (raça, gênero, orientação sexual, deficiência, etc.).",
    },
    links: [
      {
        href: "https://falabr.cgu.gov.br/",
        title: "Ouvidoria da UnB (Via Fala.BR)",
        text: "Para apuração administrativa interna de casos de discriminação."
      },
      {
        href: "tel:100",
        title: "Disque 100",
        text: "Canal federal para denúncias de violações de direitos humanos."
      },
      {
        href: "https://www.pcdf.df.gov.br/servicos/registro-online",
        title: "Polícia Civil (PCDF)",
        text: "Registre B.O. para crimes como injúria racial, racismo, etc."
      },
      {
        href: "https://comissaodeetica.unb.br/como-fazer-uma-denuncia",
        title: "Comissão de Ética da UnB",
        text: "Para desvios de conduta de servidores ou professores."
      },
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
          <div className="w-full md:w-1/2">
            <img 
              src={pageData.illustration} 
              alt="Ilustração sobre direitos humanos" 
              className="w-full h-auto rounded-lg object-cover"
              onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src="https://placehold.co/500x300/EFEFEF/AAAAAA?text=Ilustração+Direitos+Humanos"; }}
            />
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {pageData.subTopics.map((topic, index) => (
            <div 
              key={index} 
              className="p-6 h-24 bg-white rounded-lg shadow-sm flex items-center justify-center"
            >
              <h2 className="text-xl font-semibold text-gray-700">
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