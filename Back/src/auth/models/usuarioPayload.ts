import { TipoUsuario} from '@prisma/client';

export interface UsuarioPayload{
    sub: number; //Padrão do JWT para o id do usuário
    email: string; //Email do usuário
    tipo: TipoUsuario; //Tipo do usuário
    iat?:number; //Quando o token foi emitido
    exp?: number; //Quando o token expira
}