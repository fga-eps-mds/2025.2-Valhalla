import Image from "next/image";
import { UserCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
// removed unused imports: api, toast, useState

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
            
            {/* Linha Avatar + Nome */}
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative w-[50px] h-[50px] shrink-0">
                {showPhoto ? (
                    <Image
                      src={fotoUsuario!} // O ! afirma que não é nulo/undefined aqui
                      alt={`Foto de ${displayName}`}
                      fill
                      className="rounded-full object-cover border border-gray-200"
                    />
                ) : (
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        {<UserCircleIcon className="w-8 h-8 text-azul-dark opacity-80" />}
                    </div>
                )}
                </div>
                
            </div>

        </div>
// ...

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