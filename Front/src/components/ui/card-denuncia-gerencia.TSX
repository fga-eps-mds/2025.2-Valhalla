import React from "react";

interface CardDenunciaProps {
  id: number;
  nomeUsuario: string;
  fotoUsuario?: string | null;
  descricao: string;
  anonimato: boolean;
  categoria: string; 
  data: string;
  onDelete: (id: number) => void;
}

export default function CardDenuncia (){

  return;
}