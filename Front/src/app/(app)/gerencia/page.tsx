'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from 'sonner';
import api from "@/utils/api";
import CardDenuncia from "@/components/ui/card-denuncia-gerencia";
import BotaoMenu from "@/components/ui/botao-menu";
import { UsersIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import ModalExcluirDenunciaSoft from "@/components/modalExcluirDenunciaSoft";

interface DenunciaBackend {
  id: number;
  descricao: string;
  idCategoria: number;
  mediaSrc: string | null;
  anonimato: boolean;
  dataCriacao: string;
  usuario: {
    nome: string;
    mediaSrc: string | null;
  };
  categoria: {
    nome: string;
  };
}

type Denuncia = {
  id: number;
  nomeUsuario: string;
  fotoUsuario?: string | null;
  descricao: string;
  anonimato: boolean;
  categoria: string;
  data: string;
};

export default function Gerencia() {
  return (
    <main>
      <h1>Gerencia</h1>
    </main>
  );
}