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
        flex items-center justify-center gap-6 
        w-[350px] h-[120px] 
        bg-white 
        border-[2px] border-[#67A8FF] 
        rounded-[15px] 
        shadow-md
      "
    >
      <div>
        {icone}
      </div>
      
      {/* Texto */}
      <span className="
        text-[22px] font-bold 
        text-[var(--color-azul-dark)] 
        font-[var(--fonte-primaria)] 
        text-left leading-tight
        w-[140px]
      ">
        {texto}
      </span>
    </button>
  );
}