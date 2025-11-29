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
  
}

type Denuncia = {

};

export default function MinhasDenuncias() {
  return;
}