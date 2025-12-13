export type TipoUsuario = 'COMUM' | 'ADMIN' | 'ADMINMASTER';
export type CargoUsuario = 'ESTUDANTE' | 'SERVIDOR' | 'OUTRO';
export type TipoNoticia = 'GERAL' | 'AVISO' | 'EVENTO';

export interface Noticia {
  id: number;
  descricao: string;       
  tipo: string;             
  mediaSrc: string | null;  
  idUsuario: number;        
  dataCriacao: string;      
  usuario?: {
    nome: string;
    mediaSrc: string | null;
  };
}

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    tipo: TipoUsuario;
    mediaSrc: string | null;
};