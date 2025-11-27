import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface CardDenunciaProps {
  nomeUsuario: string;
  fotoUsuario?: string | null;
  descricao: string;
  anonimato: boolean;
  categoria: string; 
  data: string; 
}

export default function CardDenuncia({ 
  nomeUsuario, 
  fotoUsuario, 
  descricao, 
  anonimato,
  categoria,
  data
}: CardDenunciaProps) {

  // Lógica de Anonimato
  const displayName = anonimato ? "Anônimo" : nomeUsuario;
  const showPhoto = !anonimato && fotoUsuario;

  return (
    <div className="w-full text-branco border-2 border-azul-dark rounded-[20px] p-6 shadow-sm mb-4">
      
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
                    src={fotoUsuario}
                    alt={`Foto de ${displayName}`}
                    fill
                    className="rounded-full object-cover border border-gray-200"
                    />
                ) : (
                    // Placeholder cinza (#D9D9D9)
                    <div className="w-full h-full rounded-full bg-bordas flex items-center justify-center">
                        {!anonimato && <UserCircleIcon className="w-8 h-8 text-gray-500 opacity-20" />}
                    </div>
                )}
                </div>

                {/* Nome (Fonte Primária/Serifa) */}
                <h3 className="text-h2">
                    {displayName}
                </h3>
            </div>

            {/* Data (Abaixo do avatar/nome) */}
            <span className="text-[12px] text-small mt-1 ml-1">
                {data}
            </span>
        </div>

        {/* LADO DIREITO: Categoria (Fonte Primária/Serifa) */}
        <div>
            <span className="text-h3">
                {categoria}
            </span>
        </div>

      </div>

      {/* --- DESCRIÇÃO --- */}
      {/* Margem top para separar da data */}
      <div className="mt-4 text-body text-base leading-relaxed wrap-break-words whitespace-pre-wrap">
        {descricao}
      </div>

    </div>
  );
}