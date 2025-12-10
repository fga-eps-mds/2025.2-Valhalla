import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface CardDenunciaProps {
  nomeUsuario: string;
  fotoUsuario?: string | null;
  descricao: string;
  anonimato: boolean;
  categoria: string; 
  idCategoria?: number;
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
  const showPhoto = !anonimato && fotoUsuario !== null && fotoUsuario !== undefined;

  return (
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
                    src={fotoUsuario}
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

                {/* Nome (Fonte Primária/Serifa) */}
                <h3 className="text-h3">
                    {displayName}
                </h3>
            </div>


        </div>

        {/* LADO DIREITO: Categoria (Fonte Primária/Serifa) */}
        <div className="flex flex-col items-end cursor-default">
            <span className="text-body">
                {categoria}
            </span>
            {/* Data (Abaixo do avatar/nome) */}
            <span className="text-[12px] text-small mt-1 ml-1 cursor-default">
                {data}
            </span>
        </div>

      </div>

      {/* --- DESCRIÇÃO --- */}
      {/* Margem top para separar da data */}
      <div className="mt-4 text-body leading-relaxed wrap-break-words whitespace-pre-wrap text-left">
        {descricao}
      </div>

    </div>
  );
}