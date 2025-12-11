import Image from "next/image";
import { UserCircleIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/contexts/AuthContext";
import { TipoNoticia } from "@/types";

interface CardNoticiaProps {
  id: number;
  nomeUsuario: string;
  fotoUsuario?: string | null;
  descricao: string;
  tipo: TipoNoticia;
  data: string;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export default function CardNoticia({ 
  id,
  nomeUsuario, 
  fotoUsuario, 
  descricao, 
  tipo,
  data,
  onDelete,
  onEdit,
}: CardNoticiaProps) {

  const { user } = useAuth();

  // Define o que será mostrado (Lógica de exibição)
  const displayName = nomeUsuario || "Usuário";
  const showPhoto = !!fotoUsuario;

  // Verifica se o usuário logado é o dono da notícia
  // (Ou se é ADMINMASTER que pode editar tudo, ajuste conforme sua regra)
  const isOwner = nomeUsuario === user?.nome; 

  return (
    <div className="w-full text-black border-2 border-azul-principal rounded-[20px] p-6 shadow-sm mb-4 bg-white">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-start mb-2">
        
        {/* LADO ESQUERDO: Usuário + Data */}
        <div className="flex flex-col">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative w-[50px] h-[50px] shrink-0">
                {showPhoto ? (
                    <Image
                    src={fotoUsuario!}
                    alt={`Foto de ${displayName}`}
                    fill
                    className="rounded-full object-cover border border-gray-200"
                    />
                ) : (
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center border border-gray-100">
                        <UserCircleIcon className="w-8 h-8 text-azul-dark opacity-80" />
                    </div>
                )}
                </div>
                {/* Nome */}
                <h3 className="text-h3 font-bold text-azul-dark">
                    {displayName}
                </h3>
            </div>
        </div>

        {/* LADO DIREITO: Tipo + Ações */}
        <div className="flex flex-col items-end gap-2">

            <span className="text-body font-bold text-gray-600 uppercase tracking-wide">
                {tipo}
            </span>
            
            {/* Data */}
            <span className="text-[12px] text-gray-400 cursor-default">
                {data}
            </span>

            {/* Botões de Ação */}
            <div className="flex gap-1 mt-1">
              
              {/* Botão Editar (Só mostra se for o dono) */}
              {isOwner && (
                <button
                  onClick={() => onEdit(id)}
                  className="group flex items-center justify-center p-2 rounded-full hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                  title="Editar notícia"
                >
                  <PencilIcon className="w-5 h-5 text-azul-light group-hover:text-azul-dark transition-colors" />
                </button>
              )}

              {/* Botão Excluir (Sempre mostra na tela de gerência) */}
              <button
                onClick={() => onDelete(id)}
                className="group flex items-center justify-center p-2 rounded-full hover:bg-red-50 transition-colors duration-200 cursor-pointer"
                title="Excluir notícia"
              >
                <TrashIcon className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors" />
              </button>
            </div>
        </div>

      </div>

      {/* --- DESCRIÇÃO --- */}
      <div className="mt-4 mr-10 text-body leading-relaxed wrap-break-words break-all whitespace-pre-wrap text-left">
        {descricao}
      </div>

    </div>
  );
}
