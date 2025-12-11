import Image from "next/image";
import { useEffect, useState } from "react";
import api from '@/utils/api';
import ModalReport from '@/components/modais/modalReport';
import {
  UserCircleIcon as UserCircleSolid,
  FlagIcon as FlagSolid,
  HandThumbUpIcon as HandThumbUpSolid,
} from "@heroicons/react/24/solid";

import {
  UserCircleIcon as UserCircleOutline,
  FlagIcon as FlagOutline,
  HandThumbUpIcon as HandThumbUpOutline,
} from "@heroicons/react/24/outline";

interface CardDenunciaProps {
  nomeUsuario: string;
  fotoUsuario?: string | null;
  descricao: string;
  anonimato: boolean;
  categoria: string; 
  idCategoria?: number;
  data: string; 
  idDenuncia?: number;
  usuarioId?: number;
  apoioCount?: number;
}

export default function CardDenuncia({ 
  nomeUsuario, 
  fotoUsuario, 
  descricao, 
  anonimato,
  categoria,
  data, 
  idDenuncia, 
  usuarioId, 
  apoioCount = 0,
}: CardDenunciaProps) {

  // Lógica de Anonimato
  const displayName = anonimato ? "Anônimo" : nomeUsuario;
  const showPhoto = !anonimato && fotoUsuario !== null && fotoUsuario !== undefined;

  // Interações: apoiar / reportar
  const [apoioAtivo, setApoioAtivo] = useState(false);
  const [reportAtivo, setReportAtivo] = useState(false);
  const [apoioCnt, setApoioCnt] = useState<number>(apoioCount ?? 0);
  const [loadingApoio, setLoadingApoio] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [modalReportAberto, setModalReportAberto] = useState(false);

  useEffect(() => {
    // if usuarioId and idDenuncia provided, fetch current apoio status and contagem
    if (usuarioId && idDenuncia) {
      api
        .get(`/apoio-denuncia/status/${idDenuncia}/${usuarioId}`)
        .then((res) => {
          const { apoiado } = res.data;
          setApoioAtivo(!!apoiado);
        })
        .catch(() => {});

      api
        .get(`/apoio-denuncia/contagem/${idDenuncia}`)
        .then((res) => setApoioCnt(Number(res.data.total) || 0))
        .catch(() => {});

      // Carregar status de report também
      api
        .get(`/report-denuncias/status/${idDenuncia}/${usuarioId}`)
        .then((res) => {
          const { reportado } = res.data;
          setReportAtivo(!!reportado);
        })
        .catch(() => {});
    }
  }, [usuarioId, idDenuncia]);

  useEffect(() => {
    setApoioCnt(apoioCount ?? 0);
  }, [apoioCount]);

  async function handleApoiar() {
    if (loadingApoio || !usuarioId || !idDenuncia) return;
    setLoadingApoio(true);
    try {
      const res = await api.post(`/apoio-denuncia/alternar`, { idDenuncia, idUsuario: usuarioId });

      if (res.status >= 200 && res.status < 300) {
        // Backend returned { status, mensagem }, toggle local icon state
        setApoioAtivo((prev) => !prev);
        // Reload contagem from backend to ensure it's accurate
        api
          .get(`/apoio-denuncia/contagem/${idDenuncia}`)
          .then((res) => setApoioCnt(Number(res.data.total) || 0))
          .catch(() => {});
      } else {
        throw new Error('Erro ao alternar apoio');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingApoio(false);
    }
  }

  async function handleReportar() {
    if (loadingReport || !usuarioId || !idDenuncia || reportAtivo) return;
    setModalReportAberto(true);
  }

  async function handleReportarConfirmado() {
    if (!usuarioId || !idDenuncia) return;
    setLoadingReport(true);
    try {
      const res = await api.post(`/report-denuncias`, { idUsuario: usuarioId, idDenuncia });

      if (res.status >= 200 && res.status < 300) {
        setReportAtivo(true);
        // Reload report status from backend to confirm
        api
          .get(`/report-denuncias/status/${idDenuncia}/${usuarioId}`)
          .then((res) => {
            const { reportado } = res.data;
            setReportAtivo(!!reportado);
          })
          .catch(() => {});
      } else {
        throw new Error('Erro ao criar report');
      }
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoadingReport(false);
    }
  }

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
                        {<UserCircleSolid className="w-8 h-8 text-azul-dark opacity-80" />}
                    </div>
                )}
                </div>

                {/* Nome (Fonte Primária/Serifa) */}
                <h3 className="text-h3">
                    {displayName}
                </h3>
            </div>

            <div className="mt-4 mr-10 text-body leading-relaxed wrap-break-words break-all whitespace-pre-wrap text-left">
              {descricao}
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

      <div>
                
        <div className="flex justify-start items-center gap-4 mt-4">
          <button
            onClick={handleApoiar}
            disabled={loadingApoio || !usuarioId}
            className={`flex items-center gap-1 transition-colors ${apoioAtivo ? 'text-azul-principal' : 'text-azul-principal hover:text-azul-hover'} cursor-pointer`}
          >
            {apoioAtivo ? (
              <HandThumbUpSolid className="w-5 h-5" />
            ) : (
              <HandThumbUpOutline className="w-5 h-5" />
            )}
            <span> {apoioAtivo ? 'Apoiado' : 'Apoiar'} ({apoioCnt})</span>
          </button>

          <button
            onClick={handleReportar}
            disabled={loadingReport || !usuarioId || reportAtivo}
            className={`flex items-center gap-1 transition-colors ${reportAtivo ? 'text-red-600' : 'text-red-400 hover:text-red-600'} cursor-pointer disabled:cursor-default`}
          >
            {reportAtivo ? (
              <FlagSolid className="w-5 h-5" />
            ) : (
              <FlagOutline className="w-5 h-5" />
            )}
            <span> {reportAtivo ? 'Reportado' : 'Reportar'} </span>
          </button>
        </div>
        
      </div>

      <ModalReport
        isOpen={modalReportAberto}
        onClose={() => setModalReportAberto(false)}
        onConfirm={handleReportarConfirmado}
      />

    </div>
  );
}