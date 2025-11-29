import React from 'react';

interface BotaoMenuProps {
  texto: string;
  icone: React.ReactNode;
  onClick?: () => void;
}

export default function BotaoMenu({ texto, icone, onClick }: BotaoMenuProps) {
  return (
    <button onClick={onClick}>
      <div>
        {icone}
      </div>
      <span>
        {texto}
      </span>
    </button>
  );
}