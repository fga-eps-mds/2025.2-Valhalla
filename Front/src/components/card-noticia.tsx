
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

  const dataFormatada = new Date(dataCriacao).toLocaleDateString('pt-BR');


  const isDono = user?.id === autorId;
  const isAdmin = user?.tipo === 'ADMIN' || user?.tipo === 'ADMINMASTER';
  const podeGerenciar = isDono || isAdmin;

  return (
    <div className="w-full bg-white border-2 border-[var(--color-azul-principal)] rounded-[20px] p-6 shadow-sm mb-4 transition hover:shadow-md">
      
      {/* --- CABEÇALHO --- */}
      <div className="flex justify-between items-start mb-4">
        
        {/* Lado Esquerdo: Foto e Nome */}
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
                <UserCircleIcon className="w-8 h-8 text-[var(--color-azul-dark)] opacity-80" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-[18px] font-bold font-[var(--fonte-primaria)] text-[var(--color-texto-primario)] text-left">
              {autorNome || "Autor Desconhecido"}
            </h3>
            <span className="text-xs text-gray-500 block text-left">
              {dataFormatada}
            </span>
          </div>
        </div>

        {/* Lado Direito: Etiqueta e Botões */}
        <div className="flex flex-col items-end gap-2">
          {/* Etiqueta do Tipo (Ex: GERAL) */}
          <span className="bg-[var(--color-azul-light)] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {tipo}
          </span>

          {/* Botões de Ação (Só aparecem se tiver permissão) */}
          {podeGerenciar && (
            <div className="flex gap-1 mt-1">
              {/* Botão Editar (Apenas para o dono, por regra de negócio comum) */}
              {isDono && (
                <button
                  onClick={() => onEdit(id)}
                  className="p-2 rounded-full hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition"
                  title="Editar notícia"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              )}
              
              {/* Botão Excluir (Dono e Admins podem) */}
              <button
                onClick={() => onDelete(id)}
                className="p-2 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition"
                title="Excluir notícia"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- CORPO DA NOTÍCIA --- */}
      <div className="text-[16px] text-[var(--color-texto-corpo)] font-[var(--fonte-secundaria)] leading-relaxed whitespace-pre-wrap text-justify">
        {descricao}
      </div>

      {/* --- MÍDIA / IMAGEM (Se houver) --- */}
      {mediaSrc && (
        <div className="mt-4 w-full h-[300px] relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
           {/* Usamos img padrão para garantir compatibilidade com URLs externas sem config extra no next.config */}
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