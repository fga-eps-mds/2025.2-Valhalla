import Image from "next/image";
import { UserCircleIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/contexts/AuthContext";

interface CardNoticiaProps {
  id: number;
  descricao: string;
  tipo: string;
  mediaSrc?: string | null;
  dataCriacao: string;
  autorNome?: string;
  autorFoto?: string | null;
  autorId: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function CardNoticia({
  id,
  descricao,
  tipo,
  mediaSrc,
  dataCriacao,
  autorNome,
  autorFoto,
  autorId,
  onEdit,
  onDelete
}: CardNoticiaProps) {
  
  const { user } = useAuth();

  const dataObj = new Date(dataCriacao);
  const dataFormatada = !isNaN(dataObj.getTime()) ? dataObj.toLocaleDateString('pt-BR') : dataCriacao;

  const isDono = user?.id === autorId;
  const isAdmin = user?.tipo === 'ADMIN' || user?.tipo === 'ADMINMASTER';
  const podeGerenciar = isDono || isAdmin;

  return (
    <div className="w-full bg-white border-2 border-azul-principal rounded-[20px] p-6 shadow-sm mb-4 transition hover:shadow-md">
      
      {/* CABEÇALHO */}
      <div className="flex justify-between items-start mb-4">
        
        <div className="flex items-center gap-3">
          <div className="relative w-[50px] h-[50px] shrink-0">
            {autorFoto ? (
              <Image
                src={autorFoto}
                alt={`Foto de ${autorNome}`}
                fill
                className="rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                <UserCircleIcon className="w-8 h-8 text-azul-dark opacity-80" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-texto-primario text-left">
              {autorNome || "Autor Desconhecido"}
            </h3>
            <span className="text-xs text-gray-500 block text-left">
              {dataFormatada}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="bg-azul-light text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {tipo}
          </span>

          {podeGerenciar && (
            <div className="flex gap-1 mt-1">
              {isDono && (
                <button
                  onClick={() => onEdit(id)}
                  className="p-2 rounded-full hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition"
                  title="Editar"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              )}
              
              <button
                onClick={() => onDelete(id)}
                className="p-2 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition"
                title="Excluir"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TEXTO */}
      <div className="text-base text-texto-corpo font-sans leading-relaxed whitespace-pre-wrap text-justify">
        {descricao}
      </div>

      {/* MÍDIA */}
      {mediaSrc && (
        <div className="mt-4 w-full h-[300px] relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
           <img 
             src={mediaSrc} 
             alt="Imagem da notícia" 
             className="w-full h-full object-cover"
           />
        </div>
      )}

    </div>
  );
}