'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from 'sonner';
import api from "@/utils/api";
import CardDenuncia from "@/components/ui/card-denuncia-gerencia"; // Ajuste o caminho se necessário
import ModalExcluirDenunciaSoft from "@/components/ModalExcluirDenunciaSoft"; 

interface DenunciaBackend {
  
}

type Denuncia = {

};

export default function Gerencia() {
  return;
}