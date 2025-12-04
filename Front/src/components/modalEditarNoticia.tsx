"use client";

import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import api from '@/utils/api'; 
import { toast } from 'sonner';

interface Categoria {
  id: number;
  nome: string;
}

export interface Noticia {
  id: number;
  descricao: string;
  idCategoria: number;
  mediaSrc?: string;
}

interface ModalEditarProps {
  isOpen: boolean;
  onClose: () => void;
  noticiaParaEditar: Noticia | null;
  aoAtualizar: () => void;
}

export default function ModalEditarNoticia({ isOpen, onClose, noticiaParaEditar, aoAtualizar }: ModalEditarProps) {
  return null;
}