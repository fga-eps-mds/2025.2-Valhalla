export interface UsuarioToken {
    access_token: string;
    user?: {              // Informações adicionais do usuário
    id: number;
    nome: string;
    email: string;
    tipo: string;
    mediaSrc: string | null;
  };
}