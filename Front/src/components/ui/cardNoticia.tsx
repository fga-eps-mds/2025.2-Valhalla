import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { TipoNoticia } from "@/types";

interface CardNoticiaProps {
  id: number;
  nomeUsuario: string;
  fotoUsuario?: string | null;
  descricao: string;
  tipo: TipoNoticia;
  data: string; 
}

export default function CardNoticia({ 
  id,
  nomeUsuario, 
  fotoUsuario, 
  descricao, 
  tipo,
  data
}: CardNoticiaProps) {


return (
    // ALTERAÇÃO 1: Mudei de 'text-azul-principal' para 'text-black' e adicionei 'bg-white'
    <div className="w-full text-black bg-white border-2 border-azul-principal rounded-[20px] p-6 shadow-sm mb-4">
      
      {/* --- HEADER (Flexbox para separar Esquerda e Direita) --- */}
      <div className="flex justify-between items-start mb-2">
        
        {/* LADO ESQUERDO: Usuário + Data */}
        <div className="flex flex-col">
            
            {/* Linha Avatar + Nome */}
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative w-[50px] h-[50px] shrink-0">
                {fotoUsuario ? (
                    <Image
                    src={fotoUsuario}
                    alt={`Foto de ${nomeUsuario}`}
                    fill
                    className="rounded-full object-cover border border-gray-200"
                    />
                ) : (
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center border border-gray-100">
                        {<UserCircleIcon className="w-8 h-8 text-azul-dark opacity-80" />}
                    </div>
                )}
                </div>

                {/* Nome (Fonte Primária/Serifa) */}
                {/* ALTERAÇÃO 2: Mantive 'text-azul-dark' pois dá bom contraste */}
                <h3 className="text-azul-dark text-h3">
                    {nomeUsuario}
                </h3>
            </div>

        </div>

        {/* LADO DIREITO: Categoria (Fonte Primária/Serifa) */}
        <div className="flex flex-col items-end cursor-default">
            {/* ALTERAÇÃO 3: Adicionei 'text-gray-600' para diferenciar do título */}
            <span className="text-body text-gray-600 font-bold uppercase">
                {tipo}
            </span>
            {/* Data (Abaixo do avatar/nome) */}
            {/* ALTERAÇÃO 4: Adicionei 'text-gray-400' para a data ficar mais suave */}
            <span className="text-[12px] text-small mt-1 ml-1 cursor-default text-gray-400">
                {data}
            </span>
        </div>

      </div>

      {/* --- DESCRIÇÃO --- */}
      {/* Margem top para separar da data */}
      {/* ALTERAÇÃO 5: Adicionei 'text-gray-800' para garantir leitura fácil */}
      <div className="mt-4 mr-10 text-body leading-relaxed wrap-break-words break-all whitespace-pre-wrap text-left">
        {descricao}
      </div>

    </div>
  );
}