import React from 'react';

interface BotaoMenuProps {
  texto: string;
  icone: React.ReactNode;
  onClick?: () => void;
}

export default function BotaoMenu({ texto, icone, onClick }: BotaoMenuProps) {
  return (
    <button
      onClick={onClick}
      className="
        px-10
        flex items-center justify-center
        w-[330px] h-[120px] 
        bg-white 
        border-2 border-azul-principal 
        rounded-[15px] 
        shadow-md hover:shadow-lg 
        transform hover:-translate-y-1 
        transition-all duration-300
        group
        cursor-pointer
        gap-3
      "
    >
      {/* Ícone */}
      <div className="text-azul-dark group-hover:text-azul-principal transition-colors duration-300">
        {icone}
      </div>

      {/* Texto */}
      <span className="
        text-[22px] 
        text-azul-dark
        text-h3
        text-center leading-tight
        w-[140px]
      ">
        {texto}
      </span>
    </button>
  );
}