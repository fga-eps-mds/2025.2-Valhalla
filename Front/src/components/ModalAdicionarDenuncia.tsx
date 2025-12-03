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

interface CriarDenunciaDados {
  descricao: string;
  idCategoria: number;
  anonimato?: boolean;
  mediaSrc?: string;
}

const criarDenuncia = async (dados: CriarDenunciaDados) => {
  try {
    const response = await api.post('/denuncias', dados);
    return response.data;
  } catch (error) {
    toast.error("Erro ao criar denúncia.");
    console.error("Erro ao criar denúncia:", error);
    throw error; 
  }
};