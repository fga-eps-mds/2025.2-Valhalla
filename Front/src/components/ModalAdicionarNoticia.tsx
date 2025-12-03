"use client";

import {useState, useEffect} from "react";
import{
    CameraIcon,
    ArrowLeftIcon,

} from "@heroicons/react/24/outline";
import{
    ChevronUpDownIcon,
    PlusIcon
} from "@heroicons/react/20/solid";
import api from '@/utils/api';
import { useAuth} from "@/contexts/authContext";
import {toast} from 'sonner';

interface Categoria {
  id: number;
  nome: string;
}

const getCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await api.get('/categorias');
    return response.data;
  } catch (error) {
    toast.error("Erro ao buscar categorias.");
    console.error("Erro ao buscar categorias:", error);
    return [];
  }
};

interface CriarNoticiaDados {
  descricao: string;
  idCategoria: number;
  anonimato?: boolean;
  mediaSrc?: string;
}

const adicionarNoticia = async (dados: CriarNoticiaDados) => {
  try {
    const response = await api.post('/noticias', dados);
    return response.data;
  } catch (error) {
    toast.error("Erro ao adicionar notícia.");
    console.error("Erro ao adicionar notícia:", error);
    throw error; 
  }
};

export default function ModalAdicionarNoticia ({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
  

  const [descricao, setDescricao] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [anonimato, setAnonimato] = useState<boolean | null>(null);
  const [mediaSrc, setMediaSrc] = useState<string>('');
  const {user} = useAuth();

  const idUsuario = user?.id;
  // Estado local para guardar a LISTA CATEGORIA
    const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);

    useEffect(() => {
      const carregar = async () => {
        const dados = await getCategorias();
        setListaCategorias(dados);
      };
      carregar();
    }, []); 