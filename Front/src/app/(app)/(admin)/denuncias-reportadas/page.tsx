import Link from 'next/link';
import { WrenchScrewdriverIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface EmConstrucaoProps {
  titulo?: string;
  mensagem?: string;
  voltarPara?: string;
}

export default function EmConstrucao({ 
  titulo = "Página em Construção", 
  mensagem = "Estamos trabalhando duro para trazer novidades nesta seção. Volte em breve!",
  voltarPara = "/"
}: EmConstrucaoProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-gray-50">
      
      {/* Ícone Animado */}
      <div className="bg-white p-6 rounded-full shadow-lg mb-6 animate-pulse">
        <WrenchScrewdriverIcon className="w-16 h-16 text-azul-principal" />
      </div>

      {/* Título */}
      <h1 className="text-3xl md:text-4xl font-bold text-azul-principal mb-4">
        {titulo}
      </h1>

      {/* Descrição */}
      <p className="text-gray-600 text-lg max-w-md mb-8 leading-relaxed">
        {mensagem}
      </p>

      {/* Botão de Voltar */}
      <Link 
        href={voltarPara}
        className="flex items-center gap-2 px-6 py-3 bg-azul-principal text-white rounded-full hover:bg-azul-hover transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Voltar ao Início</span>
      </Link>

    </div>
  );
}