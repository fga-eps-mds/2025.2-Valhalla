export type TipoUsuario = 'COMUM' | 'ADMIN' | 'ADMINMASTER';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  mediaSrc: string | null;
}