import React from "react";

interface CardDenunciaProps {
  id: number;
  nomeUsuario: string;
  fotoUsuario?: string | null;
  descricao: string;
  anonimato: boolean;
  categoria: string; 
  data: string;
  onDelete: (id: number) => void;
}

export default function CardDenuncia({ 
  id,
  nomeUsuario, 
  fotoUsuario, 
  descricao, 
  anonimato,
  categoria,
  data,
  onDelete,
}: CardDenunciaProps) {

    // Lógica de Anonimato
    const displayName = anonimato ? "Anônimo" : nomeUsuario;
    const showPhoto = !anonimato && fotoUsuario !== null && fotoUsuario !== undefined;

  return (
    // 1. Container do Card com bordas e sombras
    <div className="w-full text-branco border-2 border-azul-principal rounded-[20px] p-6 shadow-sm mb-4">
      
      {/* --- HEADER (Flexbox para separar Esquerda e Direita) --- */}
      <div className="flex justify-between items-start mb-2">
        
        {/* LADO ESQUERDO: Usuário + Data */}
        <div className="flex flex-col">
        </div>

        {/* LADO DIREITO: Categoria (Fonte Primária/Serifa) */}
        <div className="flex flex-col items-end">
        </div>

      </div>

      {/* --- DESCRIÇÃO --- */}
      <div>
      </div>

    </div>
  );
}