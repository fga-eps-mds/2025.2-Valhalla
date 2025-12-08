export type TipoUsuario = 'COMUM' | 'ADMIN' | 'ADMINMASTER';

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